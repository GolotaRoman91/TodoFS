import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuthDto } from './dto/auth.dto';
import { User } from './user.model';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User) private userModel: typeof User) {}
  async createUser(dto: AuthDto) {
    return 'createUser';
  }
  async findUser(email: string) {
    return 'findUser';
  }
}
