import { HttpException, Inject, Injectable } from '@nestjs/common';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { RegisterRequestDto, RegisterResponseDto } from './dto/register.dto';
import { ValidationService } from 'src/common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AuthValidation } from './auth.validation';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/user/user.repository';
import {
  User
} from '../../node_modules/.prisma/main-client';
import {
  PrismaService,
} from 'src/common/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  async register(request: RegisterRequestDto) {
      this.logger.debug('Registering new user', {
        request
      });

    // Check password
    if (request.password != request.password) {
      throw new HttpException('Passwords do not match', 400);
    }

    // Check email and username exists
    const userCount = await this.userRepository.countByEmailOrUsername(
      request.email,
        request.username,
    );
    if (userCount != 0) {
      this.logger.error(
        `User with email ${request.email} or username ${request.username} already exists`,
      );
      throw new HttpException(
        'User with that email or username already exists',
        409,
      );
    }

    // Create user  
    console.log('Registering user:', {
      nama: request.nama,
      email: request.email,
      username: request.username,
    });
    const user = await this.userRepository.createUser({
      nama: request.nama,
        email: request.email,
        username: request.username,
        passwordHash: await bcrypt.hash(request.password, 10),
        fullname: request.fullname,
    });

    return {
      nama: user.nama,
        email: user.email ?? "",
      username: user.username,
      role: user.role,
      fullname: user.fullname,
    };
  }

  async login(request: LoginRequestDto) {
    this.logger.debug('Logging in user', { request });


    // Check user exists
    const user = await this.userRepository.findByEmailOrUsername(
      request.email,
    );
    if (!user) {
      throw new HttpException('Email, username, or password is wrong', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(
      request.password,
        user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new HttpException('Email, username, or password is wrong', 401);
    }

    // // Update last login
    // await this.userRepository.updateLastLogin(user.id);

    // Create token
    const token = await this.generateToken(user);

    return {
      email: user.email ?? "",
      username: user.username,
      role: user.role,
      fullname: user.fullname,
      token: token,
    };
  }

  private async generateToken(user: User) {
    return this.jwtService.signAsync({ sub: user.id, role: user.role });
  }
}
