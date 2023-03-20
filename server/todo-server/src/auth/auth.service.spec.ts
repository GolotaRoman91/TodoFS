import { getModelToken } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserModel } from './user.model';
import { AuthDto } from './dto/auth.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import {
  ALREADY_REGISTERED_ERROR,
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
} from './auth.constants';

const userModelMock = {
  findOne: jest.fn(),
  create: jest.fn(),
};

const jwtServiceMock = {
  signAsync: jest.fn(),
};

userModelMock.findOne.mockImplementation(async (options) => {
  if (options.where.email === 'existing@example.com') {
    return {
      id: 1,
      email: 'existing@example.com',
      passwordHash: 'hashedpassword',
    };
  }
  return null;
});

userModelMock.create.mockImplementation(async (userData) => {
  return {
    id: 2,
    email: userData.email,
    passwordHash: userData.passwordHash,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt,
  };
});

jwtServiceMock.signAsync.mockImplementation(async () => {
  return 'sample_access_token';
});

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(UserModel), useValue: userModelMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should successfully login a user', async () => {
    const testDto: AuthDto = {
      login: 'existing@example.com',
      password: 'correctpassword',
    };

    const result = await service.login(testDto.login);

    expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
      email: testDto.login,
    });
    expect(result).toEqual({ access_token: 'sample_access_token' });
  });

  it('should fail to login a non-existent user', async () => {
    const testDto: AuthDto = {
      login: 'nonexistent@example.com',
      password: 'somepassword',
    };

    await expect(
      service.validateUser(testDto.login, testDto.password),
    ).rejects.toThrow(UnauthorizedException);
    await expect(
      service.validateUser(testDto.login, testDto.password),
    ).rejects.toMatchObject({
      message: USER_NOT_FOUND_ERROR,
    });
  });

  it('should successfully create a user', async () => {
    const testDto: AuthDto = {
      login: 'newuser@example.com',
      password: 'newpassword',
    };

    const newUser = await service.createUser(testDto);

    expect(userModelMock.create).toHaveBeenCalled();
    expect(newUser.email).toBe(testDto.login);
    expect(newUser.passwordHash).not.toBe(testDto.password);
  });

  it('should throw BadRequestException if the user already exists', async () => {
    const testDto: AuthDto = {
      login: 'existing@example.com',
      password: 'somepassword',
    };

    await expect(service.createUser(testDto)).rejects.toThrow(
      BadRequestException,
    );
    await expect(service.createUser(testDto)).rejects.toMatchObject({
      message: ALREADY_REGISTERED_ERROR,
    });
  });

  it('should fail to login with incorrect password', async () => {
    const testDto: AuthDto = {
      login: 'existing@example.com',
      password: 'wrongpassword',
    };

    await expect(
      service.validateUser(testDto.login, testDto.password),
    ).rejects.toThrow(UnauthorizedException);
    await expect(
      service.validateUser(testDto.login, testDto.password),
    ).rejects.toMatchObject({
      message: WRONG_PASSWORD_ERROR,
    });
  });
});
