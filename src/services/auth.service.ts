import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";

export class AuthService {
  constructor(private repo = new UserRepository()) {}

  async register(data: any) {
    const existing = await this.repo.findByEmail(data.email);
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(data.password, 10);
    return this.repo.create({ ...data, password: hashed });
  }

  async login(email: string, password: string) {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return { user, token };
  }

  // ✅ REQUIRED FOR /auth/me
  async getMe(token: string) {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    const user = await this.repo.findById(payload.id);
    if (!user) throw new Error("User not found");

    return user;
  }
}
