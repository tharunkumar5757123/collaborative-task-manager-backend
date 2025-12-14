import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { RegisterDto, LoginDto } from "../dto/auth.dto";

const service = new AuthService();

/* ======================
   REGISTER
====================== */
export const register = async (req: Request, res: Response) => {
  RegisterDto.parse(req.body);

  const user = await service.register(req.body);

  // ❌ never send password
  const { password, ...safeUser } = user.toObject();

  res.status(201).json(safeUser);
};

/* ======================
   LOGIN
====================== */
export const login = async (req: Request, res: Response) => {
  LoginDto.parse(req.body);

  const { user, token } = await service.login(
    req.body.email,
    req.body.password
  );

  // ❌ never send password
  const { password, ...safeUser } = user.toObject();

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.json(safeUser);
};

/* ======================
   GET CURRENT USER
====================== */
export const me = async (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const user = await service.getMe(token);

  const { password, ...safeUser } = user.toObject();
  res.json(safeUser);
};
