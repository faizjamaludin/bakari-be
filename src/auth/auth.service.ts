import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    const { email, password } = dto;

    //generate password
    const hashPassword = await argon.hash(password);

    //save new user in db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: email,
          password: hashPassword,
          role: 'staff',
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

  // user sign in function

  async signin(dto: AuthDto, req: Request, res: Response) {
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

    const token = this.signToken(user.id, user.email);

    if (!token) {
      throw new ForbiddenException();
    }

    res.cookie('accessToken', token);

    //send back the user
    return { token: token };
  }

  // generate token function
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = { sub: userId, email };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: secret,
    });

    return { accessToken: token };
  }
}
