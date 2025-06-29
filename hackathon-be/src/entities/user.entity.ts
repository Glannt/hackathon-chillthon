import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Task } from './task.entity';
import { Project } from './project.entity';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  DEVELOPER = 'developer',
  QA = 'qa',
  DEVOPS = 'devops',
}

export enum Department {
  BACKEND = 'Backend',
  FRONTEND = 'Frontend',
  MOBILE = 'Mobile',
  AI = 'AI',
  DEVOPS = 'DevOps',
  TESTER = 'Tester',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'enum', enum: Department })
  department: Department;

  @Column({ type: 'varchar', length: 255 })
  position: string;

  @Column({ type: 'varchar', length: 50 })
  experience: string;

  @Column({ type: 'int', default: 0 })
  projectsDone: number;

  @Column({ type: 'varchar', length: 100 })
  avgTaskCompletion: string;

  @Column({ type: 'int', default: 0 })
  deadlineMisses: number;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.DEVELOPER })
  role: UserRole;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Task, (task) => task.assignedUser, {
    cascade: false,
    onDelete: 'SET NULL',
  })
  tasks: Task[];

  @ManyToMany(() => Project, (project) => project.users, {
    cascade: false,
    onDelete: 'CASCADE',
  })
  projects: Project[];
}
