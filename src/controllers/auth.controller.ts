import { Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middleware";

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const user: IUser = await User.create(req.body);
    const { password, ...safeUser } = user.toObject();
    res.status(201).json(safeUser);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful", userId: user._id, role: user.role });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  res.json(req.user);
};

export const logout = (_: AuthRequest, res: Response) => {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" });
  res.json({ message: "Logged out" });
};