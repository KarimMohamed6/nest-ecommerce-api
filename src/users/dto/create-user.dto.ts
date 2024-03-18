import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Roles } from 'src/utility/common/user-roles.enum';

export class CreateUserDto {
  @IsString()
  userName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  roles: Roles[];
}
