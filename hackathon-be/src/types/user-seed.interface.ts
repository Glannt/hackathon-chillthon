import { UserRole, Department } from '../entities/user.entity';

export interface UserSeedData {
  name: string;
  department: Department;
  position: string;
  experience: string;
  projectsDone: number;
  avgTaskCompletion: string;
  deadlineMisses: number;
  role: UserRole;
  email: string;
}
