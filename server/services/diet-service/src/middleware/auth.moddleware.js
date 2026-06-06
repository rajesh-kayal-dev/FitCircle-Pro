import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check header exists
    if (!authHeader) {
      return res.status(401).json({ message: "No token ❌" });
    }

    // 2. Check correct format "Bearer TOKEN"
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token format ❌" });
    }

    // 3. Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing ❌" });
    }

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach user
    req.user = decoded;

    next();
  } catch (error) {

    res.status(401).json({
      message: "Invalid token ❌",
    });
  }
};

export default protect;