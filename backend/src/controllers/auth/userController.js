import jwt from "jsonwebtoken";
import User from "../../models/auth/userModel.js";

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser)
      return res.status(409).json({ message: "Email is already registered" });

    const user = await User.create({ name, email, password, role });
    return res
      .status(201)
      .json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() }).select(
      "+password",
    );
    if (!user || !(await user.comparePassword(password || ""))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) =>
  res.json({ user: publicUser(req.user) });

export const listUsers = async (_req, res) =>
  res.json({ users: await User.find().sort({ createdAt: -1 }) });

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user });
};

export const updateUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await User.findById(req.params.id).select("+password");
  if (!user) return res.status(404).json({ message: "User not found" });

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email.toLowerCase();
  if (role !== undefined) user.role = role;
  if (password) user.password = password;
  await user.save();

  return res.json({ user });
};

export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ message: "User deleted" });
};
