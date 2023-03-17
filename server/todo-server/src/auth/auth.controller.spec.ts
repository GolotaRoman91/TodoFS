import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ALREADY_REGISTERED_ERROR,
  WRONG_PASSWORD_ERROR,
} from './auth.constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

const authServiceMock = {
  findUser: jest.fn(),
  createUser: jest.fn(),
  validateUser: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('AuthController', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call createUser when registering a new user', async () => {
      const testDto: AuthDto = {
        login: 'test@example.com',
        password: 'testpassword',
      };

      authServiceMock.createUser.mockResolvedValue(null);

      await controller.register(testDto);

      expect(authServiceMock.createUser).toHaveBeenCalledWith(testDto);
    });

    it('should throw an error when registering an existing user', async () => {
      const testDto: AuthDto = {
        login: 'test@email.com',
        password: 'password',
      };

      authServiceMock.createUser.mockImplementation(() => {
        throw new BadRequestException(ALREADY_REGISTERED_ERROR);
      });

      try {
        await controller.register(testDto);
      } catch (error) {
        expect(error.message).toEqual(ALREADY_REGISTERED_ERROR);
      }

      expect(authServiceMock.createUser).toHaveBeenCalledWith(testDto);
    });

    it('should successfully create a new user', async () => {
      const testDto: AuthDto = {
        login: 'test@email.com',
        password: 'password',
      };

      const userMock = {
        id: 1,
        login: testDto.login,
        password: testDto.password,
      };

      authServiceMock.findUser.mockResolvedValue(null);
      authServiceMock.createUser.mockResolvedValue(userMock);

      const result = await controller.register(testDto);

      expect(authServiceMock.createUser).toHaveBeenCalledWith(testDto);
      expect(result).toEqual(userMock);
    });

    it('should fail to register a new user if the user already exists', async () => {
      const testDto: AuthDto = {
        login: 'test@email.com',
        password: 'password',
      };

      authServiceMock.createUser.mockImplementation(() => {
        throw new BadRequestException(ALREADY_REGISTERED_ERROR);
      });

      await expect(controller.register(testDto)).rejects.toThrowError(
        BadRequestException,
      );

      await expect(controller.register(testDto)).rejects.toMatchObject({
        message: ALREADY_REGISTERED_ERROR,
      });
    });

    it('should successfully validate a user', async () => {
      const testDto: AuthDto = {
        login: 'test@email.com',
        password: 'password',
      };

      const userMock = {
        id: 1,
        login: testDto.login,
        password: testDto.password,
      };

      authServiceMock.validateUser.mockResolvedValue(userMock);
      await controller.login(testDto);

      expect(authServiceMock.validateUser).toHaveBeenCalledWith(
        testDto.login,
        testDto.password,
      );
    });

    it('should fail to validate a user with incorrect password', async () => {
      const testDto: AuthDto = {
        login: 'test@email.com',
        password: 'wrong_password',
      };

      authServiceMock.validateUser.mockRejectedValue(
        new UnauthorizedException(WRONG_PASSWORD_ERROR),
      );

      await expect(controller.login(testDto)).rejects.toThrowError();
      await expect(controller.login(testDto)).rejects.toMatchObject({
        message: WRONG_PASSWORD_ERROR,
        constructor: UnauthorizedException,
      });
    });
  });
});
