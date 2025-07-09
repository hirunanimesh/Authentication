const authmodel = require("../AuthModel/authmodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"; // Default if not set

const oAuth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

class AuthController {
  static async redirectToGoogle(req, res) {
    const { role } = req.query;
    const validRoles = ["student", "teacher"];

    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid or missing role. Must be 'student' or 'teacher'.",
      });
    }

    const csrfToken = crypto.randomBytes(32).toString("hex");
    // Store CSRF token in a short-lived cookie
    res.cookie("oauth_csrf_token", csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 300000, // 5 minutes
      sameSite: "lax",
    });

    const statePayload = {
      csrfToken,
      role,
      nonce: crypto.randomBytes(16).toString("hex"), // Additional nonce for uniqueness
    };
    const state = Buffer.from(JSON.stringify(statePayload)).toString("base64url");

    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "openid",
      ],
      prompt: "consent",
      state: state, // Pass our custom state
    });
    res.redirect(authorizeUrl);
  }

  static async handleGoogleCallback(req, res) {
    const { code, state } = req.query;
    const storedCsrfToken = req.cookies.oauth_csrf_token;

    // Clear CSRF token cookie immediately
    res.clearCookie("oauth_csrf_token");

    if (!code) {
      return res.status(400).json({ message: "Authorization code missing." });
    }
    if (!state) {
      return res.status(400).json({ message: "State parameter missing." });
    }
    if (!storedCsrfToken) {
      return res.status(400).json({ message: "CSRF token cookie missing." });
    }

    let statePayload;
    try {
      statePayload = JSON.parse(Buffer.from(state, "base64url").toString("utf8"));
    } catch (error) {
      console.error("Error parsing state:", error);
      return res.status(400).json({ message: "Invalid state parameter encoding." });
    }

    if (statePayload.csrfToken !== storedCsrfToken) {
      console.error("CSRF token mismatch. Possible attack.");
      return res.status(403).json({ message: "CSRF token mismatch." });
    }

    const validRoles = ["student", "teacher"];
    const intendedRole = statePayload.role;
    if (!intendedRole || !validRoles.includes(intendedRole)) {
      console.error(`Invalid role ('${intendedRole}') found in state.`);
      return res.status(400).json({ message: "Invalid role specified in state." });
    }

    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);

      // Verify ID token and get user info (alternative to direct userinfo endpoint)
      // const idToken = tokens.id_token;
      // const ticket = await oAuth2Client.verifyIdToken({
      //     idToken,
      //     audience: GOOGLE_CLIENT_ID,
      // });
      // const payload = ticket.getPayload();
      // const { email, name, picture, email_verified } = payload;
      // if (!email || !email_verified) {
      //    return res.status(400).json({ message: "Email not provided or not verified by Google" });
      // }

      // Fetch user profile from Google using access token (current approach)
      const googleUser = await oAuth2Client.request({
        url: "https://www.googleapis.com/oauth2/v3/userinfo",
      });
      const { email, name, picture } = googleUser.data;

      if (!email) { // Should also check if email is verified if using People API directly.
                  // The id_token verification method above includes `email_verified`.
        return res
          .status(400)
          .json({ message: "Email not provided by Google" });
      }

      let user = await authmodel.findbyemail(email);
      let isNewUser = false;

      if (!user) {
        const usernameFromEmail = email.split("@")[0];
        const username = name || usernameFromEmail;

        // Use the role from the validated state
        user = await authmodel.signup(email, null, username, intendedRole);
        if (!user) {
          console.error(`DB Error: Failed to create user ${email} with role ${intendedRole} during Google OAuth.`);
          return res
            .status(500)
            .json({ message: "Server error: Could not create user account." });
        }
        isNewUser = true;
        console.log(`New user created via Google: ${email}, Role: ${intendedRole}, Username: ${username}`);
      } else {
        console.log(`Existing user logged in via Google: ${email}, DB Role: ${user.role}. Intended Role via OAuth: ${intendedRole}`);
        // Optional: Logic if existing user's role mismatches intendedRole.
        // For now, we just log in the existing user with their current DB role.
        // If user.role !== intendedRole, you might want to:
        // 1. Update their role (if allowed).
        // 2. Prevent login if roles are considered immutable or distinct accounts.
        // 3. Or simply allow login, and the JWT will reflect their stored role. (Current behavior)
      }

      // Issue your application's JWT
      // The user.role here will be the one from the database (either newly created with intendedRole, or existing user's role)
      const appTokenPayload = {
        username: user.username,
        role: user.role, // This will be the role from DB (either existing or newly created)
        email: user.email,
        id: user.id, // Include user ID for consistency if other parts of app use it
      };

      const appToken = jwt.sign(appTokenPayload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const appRefreshToken = jwt.sign(
        appTokenPayload,
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("token", appToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in production
        sameSite: "lax", // Or 'none' if frontend and backend are on different domains, then also secure:true
      });
      res.cookie("refreshToken", appRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      // Redirect to frontend (e.g., dashboard or a specific welcome page for new users)
      // The frontend should then probably fetch user details using the new token.
      res.redirect(`${FRONTEND_URL}/`); // Or a more specific path like /dashboard

    } catch (error) {
      console.error("Error during Google OAuth callback:", error);
      if (error.response && error.response.data) {
        console.error("Google API error details:", error.response.data);
      }
      return res.status(500).json({ message: "Internal server error during Google authentication" });
    }
  }

  static async signup(req, res) {
    const { email, password, username, role } = req.body;
    try {
      const user = await authmodel.signup(email, password, username, role);
      if (user) {
        return res
          .status(201)
          .json({ message: "User created successfully", user });
      }
      return res.status(400).json({ message: "Error creating user" });
    } catch (error) {
      console.error("Error during signup:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async get_me(req, res) {
    try {
      const user = await authmodel.findbyemail(req.user.email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async student_login(req, res) {
    const { email, password, role } = req.body;
    try {
      const user = await authmodel.findbyemail(email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        console.log("Invalid email or password");
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { username: user.username, role: role, email: email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        { username: user.username, role: role, email: email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Set the refresh token in a cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      console.log("Login successful for user:", user.username);
      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async teacher_login(req, res) {
    const { email, password, role } = req.body;
    try {
      const user = await authmodel.findbyemail(email);
      console.log("User found:", user);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        console.log("Invalid email or password");
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { username: user.username, role: role, email: email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        { username: user.username, role: role, email: email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Set the refresh token in a cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async logout(req, res) {
    try {
      // Clear the cookies
      res.clearCookie("refreshToken");
      res.clearCookie("token");
      return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Error during logout:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async get_students(req, res) {
    try {
      
      const students = await authmodel.get_students();
      return res.status(200).json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async get_teachers(req, res) {
    try {
      const teachers = await authmodel.get_teachers();
      return res.status(200).json(teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = AuthController;
