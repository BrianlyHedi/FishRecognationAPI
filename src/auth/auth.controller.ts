import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterRequestDto,
  RegisterResponseDto
} from './dto/register.dto';
import { LoginResponseDto } from './dto/login.dto';
import { WebResponse } from 'src/common/web-response';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

@Public()
@Post('/register')
@HttpCode(201)
async register(@Body() request: RegisterRequestDto) {
    const result = await this.authService.register(request);
    console.log('Request DTO at controller:', request);
  return {
    message: 'Register success',
    data: result,
  };
  }

  @Public()
  @Post('/login')
  @HttpCode(200)
  async login(@Body() request) {
    const result = await this.authService.login(request);
    return {
      message: 'Login success',
      data: result,
    };
  }
}
