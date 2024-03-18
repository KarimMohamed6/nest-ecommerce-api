import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { Role } from 'src/utility/decorators/authorize-roles.decorator';
import { Roles } from 'src/utility/common/user-roles.enum';
import { AuthorizeGuard } from 'src/auth/guards/Authorization.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Role(Roles.ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizeGuard)
  @Get('all')
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('one-by-id/:id')
  async findOneById(@Param('id', ParseIntPipe) id: string): Promise<User> {
    return await this.usersService.findOneById(+id);
  }

  @Get('one-by-name/:userName')
  async findOneByUserName(@Param('userName') userName: string): Promise<User> {
    return await this.usersService.findOneByUserName(userName);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @UseGuards(AuthenticationGuard)
  @Get('me')
  async getProfile(@CurrentUser() currentUser: User): Promise<User> {
    return currentUser;
  }
}
