import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { IUser } from "../models/user.model";

export class AuthService {
  constructor(private repo = new UserRepository()) {}

  // REGISTER
  async register(data: { name: string; email: string; password: string }): Promise<IUser> {
    const existing = await this.repo.findByEmail(data.email);
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.repo.create({ ...data, password: hashed });
    return user.toObject(); // plain JS object
  }

  // LOGIN
  async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    return { user: user.toObject(), token };
  }

  // GET CURRENT USER
  async getMe(token: string): Promise<IUser> {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await this.repo.findById(payload.id);
    if (!user) throw new Error("User not found");

    return user.toObject();
  }
}
