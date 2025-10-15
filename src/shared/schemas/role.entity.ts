import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRole } from './user-role.entity';

export enum RoleName {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_USER = 'ROLE_USER'
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: 'enum', 
    enum: RoleName, 
    nullable: false 
  })
  role_name: RoleName;

  @OneToMany(() => UserRole, userRole => userRole.role)
  userRoles: UserRole[];
}
