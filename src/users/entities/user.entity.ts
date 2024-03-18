import * as bcrypt from 'bcrypt';
import { Roles } from 'src/utility/common/user-roles.enum';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Roles,
    array: true,
    default: [Roles.USER],
  })
  roles: Roles[];

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updateedAt: Timestamp;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
