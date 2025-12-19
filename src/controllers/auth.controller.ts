import { Request, Response } from "express";
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

    // user is already plain object, no need for toObject
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

    const { user, token } = await service.login(
      req.body.email,
      req.body.password
    );

    // user is already plain object
    const { password, ...safeUser } = user;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.json(safeUser);
  } catch (err: any) {
    console.error("Login error:", err.message || err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};


/* ======================
   GET CURRENT USER
====================== */
export const me = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await service.getMe(token);

    // user is already a plain object
    const { password, ...safeUser } = user;

    res.json(safeUser);
  } catch (err: any) {
    console.error("Me error:", err.message || err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

