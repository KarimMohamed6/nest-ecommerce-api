import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findOneByUserName(createUserDto.userName);

    if (existingUser) {
      throw new ConflictException('Invalid userName');
    }

    const user = this.userRepo.create(createUserDto);
    await this.userRepo.save(user);
    const { password, ...result } = user;

    return result;
  }

  async findAll(): Promise<User[] | null> {
    return await this.userRepo.find();
  }

  async findOneById(id: number): Promise<User | undefined> {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findOneByUserName(userName: string): Promise<User | undefined> {
    const user = await this.userRepo.findOne({ where: { userName } });

    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
