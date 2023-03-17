import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { genSalt, hash, compare } from 'bcryptjs';
import {
  ALREADY_REGISTERED_ERROR,
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
} from './auth.constants';
import { AuthDto } from './dto/auth.dto';
import { UserModel } from './user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: AuthDto): Promise<UserModel> {
    const { login, password } = dto;
    const oldUser = await this.findUser(dto.login);
    if (oldUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }
    const salt = await genSalt(10);
    const email = login;
    const passwordHash = await hash(password, salt);
    const newUser = await this.userModel.create({
      email,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return newUser;
  }

  async findUser(email: string): Promise<UserModel> {
    const user = await this.userModel.findOne({ where: { email } });
    return user;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UserModel, 'email'>> {
    const user = await this.findUser(email);
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }
    const isCorrectPassword = await compare(password, user.passwordHash);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }
    return { email: user.email };
  }

  async login(email: string) {
    const payload = { email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
