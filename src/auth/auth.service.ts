import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto } from './dto/account.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(data: SignInDto): Promise<{ accessToken: string }> {
    if (data.email !== 'test@test.com' || data.password !== 'testtest') {
      throw new UnauthorizedException();
    }

    const payload = { sub: 1, email: data.email };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken: accessToken };
  }
}
