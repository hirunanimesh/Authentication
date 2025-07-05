const authmodel = require("../AuthModel/authmodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {
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
