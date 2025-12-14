import User from "../models/user.model";

export class UserRepository {
  async create(data: any) {
    return User.create(data);
  }

  async findByEmail(email: string) {
    return User.findOne({ email }); // ✅ now works
  }

  async findById(id: string) {
    return User.findById(id);
  }
}
