import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from './dto/auth.dto';
import { User } from './user.model';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User) private userModel: typeof User) {}
  async createUser(dto: AuthDto): Promise<User> {
    const { email, password } = dto;
    // const existingUser = await this.userModel.findOne({ where: { email } });
    // if (existingUser) {
    //   throw new Error('User with this email already exists');
    // }
    const salt = await bcrypt.genSaltSync(10);
    const passwordHash = await bcrypt.hashSync(password, salt);
    const newUser = await this.userModel.create({ email, passwordHash });
    return newUser;
  }
  async findUser(email: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { email } });
    return user;
  }
}
