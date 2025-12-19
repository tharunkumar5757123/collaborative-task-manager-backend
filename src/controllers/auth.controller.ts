import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { AuthService } from "../services/auth.service";
import { RegisterDto, LoginDto } from "../dto/auth.dto";

const service = new AuthService();

/* ======================
   REGISTER
====================== */
export const register = async (req: Request, res: Response) => {
  try {
    RegisterDto.parse(req.body);

    const user = await service.register(req.body);

    const { password, ...safeUser } = user;
    res.status(201).json(safeUser);
  } catch (err: any) {
    console.error("Register error:", err.message || err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/* ======================
   LOGIN
====================== */
export const login = async (req: Request, res: Response) => {
  try {
    LoginDto.parse(req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // 🔥 REQUIRED FOR RENDER
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      userId: user._id,
    });
  } catch (err: any) {
    console.error("Login error:", err.message || err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/* ======================
   LOGOUT
====================== */
export const logout = (_: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.json({ message: "Logged out" });
};

/* ======================
   GET CURRENT USER
====================== */
export const me = async (req: Request, res: Response) => {
  try {
    // authMiddleware already verified token
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    res.json(user);
  } catch (err: any) {
    console.error("Me error:", err.message || err);
    res.status(500).json({ message: "Server error" });
  }
};
