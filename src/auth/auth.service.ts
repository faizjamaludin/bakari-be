import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { }
  async signup(dto: AuthDto) {
    //generate password
    const password = await argon.hash(dto.password);

    //save new user in db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password,
          role: 'staff'
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      //return saved user
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email existed');
        }
      }
    }
  }

  async signin(dto: AuthDto) {
    //find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    //if user does not exist throw exception
    if (!user) throw new ForbiddenException('Email incorrect');

    //compare password
    const pwMatches = await argon.verify(user.password, dto.password);

    //password incorrect throw excemption
    if (!pwMatches) throw new ForbiddenException('Password does not match');

    //send back the user
    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string): Promise<{ accessToken: string }> {

    const payload = { sub: userId, email };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: "30d",
      secret: secret,
    })

    return { accessToken: token }

  }

}
