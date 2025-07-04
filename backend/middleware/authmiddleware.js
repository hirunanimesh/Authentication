const jwt = require('jsonwebtoken');

const authmiddleware = (allowedRoles) => {
  return async (req, res, next) => {
    const token = req.cookies.token;
    

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded JWT:", decoded);
     
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
          return res.status(401).json({ message: "Unauthorized - No refresh token" });
        }

        try {
          const refreshDecoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

          const newAccessToken = jwt.sign(
            {
              id: refreshDecoded.id,
              role: refreshDecoded.role,
              email: refreshDecoded.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
          );

          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          });

          req.user = refreshDecoded;
          next();
        } catch (refreshErr) {
          return res.status(401).json({ message: "Invalid refresh token" });
        }
      } else {
        return res.status(403).json({ message: "Invalid token" });
      }
    }
  };
};
module.exports = authmiddleware;