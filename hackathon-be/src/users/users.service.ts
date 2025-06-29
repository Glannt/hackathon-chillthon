import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, Department } from '../entities/user.entity';
import { UserSeedData } from '../types/user-seed.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.usersRepository.find({ where: { role } });
  }

  async findByDepartment(department: Department): Promise<User[]> {
    return this.usersRepository.find({ where: { department } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, userData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async seedUsers(): Promise<void> {
    const usersData: UserSeedData[] = [
      {
        name: 'A',
        department: Department.BACKEND,
        position: 'Senior Backend Developer',
        experience: '5 years',
        projectsDone: 12,
        avgTaskCompletion: '1.5 ngày (Medium)',
        deadlineMisses: 2,
        role: UserRole.DEVELOPER,
        email: 'a@company.com',
      },
      {
        name: 'B',
        department: Department.FRONTEND,
        position: 'Junior Frontend Developer',
        experience: '1 years',
        projectsDone: 4,
        avgTaskCompletion: '2 ngày (Easy)',
        deadlineMisses: 0,
        role: UserRole.DEVELOPER,
        email: 'b@company.com',
      },
      {
        name: 'C',
        department: Department.MOBILE,
        position: 'Mid-level Flutter Developer',
        experience: '3 years',
        projectsDone: 6,
        avgTaskCompletion: '2.5 ngày (Medium)',
        deadlineMisses: 1,
        role: UserRole.DEVELOPER,
        email: 'c@company.com',
      },
      {
        name: 'D',
        department: Department.BACKEND,
        position: 'Junior Backend Developer',
        experience: '1.5 years',
        projectsDone: 5,
        avgTaskCompletion: '3 ngày (Hard)',
        deadlineMisses: 3,
        role: UserRole.DEVELOPER,
        email: 'd@company.com',
      },
      {
        name: 'E',
        department: Department.AI,
        position: 'Senior AI Engineer',
        experience: '6 years',
        projectsDone: 10,
        avgTaskCompletion: '2 ngày (Hard)',
        deadlineMisses: 1,
        role: UserRole.DEVELOPER,
        email: 'e@company.com',
      },
      {
        name: 'F',
        department: Department.FRONTEND,
        position: 'Mid-level React Developer',
        experience: '2.5 years',
        projectsDone: 7,
        avgTaskCompletion: '1.8 ngày (Medium)',
        deadlineMisses: 0,
        role: UserRole.DEVELOPER,
        email: 'f@company.com',
      },
      {
        name: 'G',
        department: Department.DEVOPS,
        position: 'Senior DevOps Engineer',
        experience: '7 years',
        projectsDone: 15,
        avgTaskCompletion: '1.2 ngày (Medium)',
        deadlineMisses: 2,
        role: UserRole.DEVOPS,
        email: 'g@company.com',
      },
      {
        name: 'H',
        department: Department.TESTER,
        position: 'QA Engineer',
        experience: '2 years',
        projectsDone: 8,
        avgTaskCompletion: '2.2 ngày (Easy)',
        deadlineMisses: 0,
        role: UserRole.QA,
        email: 'h@company.com',
      },
      {
        name: 'I',
        department: Department.AI,
        position: 'Junior Data Scientist',
        experience: '1 years',
        projectsDone: 3,
        avgTaskCompletion: '3.5 ngày (Hard)',
        deadlineMisses: 2,
        role: UserRole.DEVELOPER,
        email: 'i@company.com',
      },
      {
        name: 'J',
        department: Department.BACKEND,
        position: 'Mid-level Backend Developer',
        experience: '4 years',
        projectsDone: 9,
        avgTaskCompletion: '2 ngày (Medium)',
        deadlineMisses: 1,
        role: UserRole.DEVELOPER,
        email: 'j@company.com',
      },
    ];

    for (const userData of usersData) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: userData.email },
      });

      if (!existingUser) {
        await this.usersRepository.save(userData);
      }
    }
  }
}
