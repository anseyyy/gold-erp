import jwt from "jsonwebtoken";
import User from "../../models/auth/userModel.js";

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer "))
      return res.status(401).json({ message: "Authentication required" });

    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user)
      return res.status(401).json({ message: "User no longer exists" });

    req.user = user;
    next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
