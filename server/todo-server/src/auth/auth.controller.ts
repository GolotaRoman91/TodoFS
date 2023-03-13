import { AuthDto } from './dto/auth.dto';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    return 'register';
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    return 'login';
  }
}
