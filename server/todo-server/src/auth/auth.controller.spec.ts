import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';
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

    it('should call findUser when registering a new user', async () => {
      const testDto: AuthDto = {
        login: 'test@example.com',
        password: 'testpassword',
      };

      authServiceMock.findUser.mockResolvedValue(null);

      await controller.register(testDto);

      expect(authServiceMock.findUser).toHaveBeenCalledWith(testDto.login);
    });

    it('should successfully find an existing user', async () => {
      const testDto: AuthDto = {
        login: 'test@email.com',
        password: 'password',
      };

      const userMock = {
        id: 1,
        login: testDto.login,
        password: testDto.password,
      };

      authServiceMock.findUser.mockResolvedValue(userMock);

      try {
        await controller.register(testDto);
      } catch (error) {
        expect(error.message).toEqual(ALREADY_REGISTERED_ERROR);
      }

      expect(authServiceMock.findUser).toHaveBeenCalledWith(testDto.login);
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

      const userMock = {
        id: 1,
        login: testDto.login,
        password: testDto.password,
      };

      authServiceMock.findUser.mockResolvedValue(userMock);

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
  });
});
