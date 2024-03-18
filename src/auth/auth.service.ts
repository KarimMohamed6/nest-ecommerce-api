import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(userName: string, password: string): Promise<User | null> {
    const user = await this.userService.findByUserName(userName);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  async login(user: any) {
    const payload = {
      id: user.id,
      userName: user.userName,
      email: user.email,
      password: user.password,
      roles: user.roles,
    };

    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
    };
  }
}
