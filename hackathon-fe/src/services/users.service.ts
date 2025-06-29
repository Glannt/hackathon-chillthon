import apiService from "@/lib/axios";
import { User, CreateUserForm, UpdateUserForm } from "@/types/task-form";

export interface AvailableRoles {
  roles: string[];
  departments: string[];
}

export class UsersService {
  static async getAllUsers(): Promise<User[]> {
    const response = await apiService.get<User[]>("/users");

    return response;
  }

  static async getUserById(id: string): Promise<User> {
    const response = await apiService.get<User>(`/users/${id}`);

    return response;
  }

  static async createUser(data: CreateUserForm): Promise<User> {
    const response = await apiService.post<User>("/users", data);

    return response;
  }

  static async updateUser(id: string, data: UpdateUserForm): Promise<User> {
    const response = await apiService.patch<User>(`/users/${id}`, data);

    return response;
  }

  static async deleteUser(id: string): Promise<void> {
    await apiService.delete<void>(`/users/${id}`);
  }

  // Get users by role
  static async getUsersByRole(role: string): Promise<User[]> {
    const response = await apiService.get<User[]>(`/users?role=${role}`);

    return response;
  }

  // Get users by department
  static async getUsersByDepartment(department: string): Promise<User[]> {
    const response = await apiService.get<User[]>(
      `/users?department=${department}`,
    );

    return response;
  }

  // Seed users data
  static async seedUsers(): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>("/users/seed");

    return response;
  }

  // Get available roles and departments
  static async getAvailableRoles(): Promise<AvailableRoles> {
    const response = await apiService.get<AvailableRoles>(
      "/users/roles/available",
    );

    return response;
  }
}

export const usersService = new UsersService();
export default usersService;
