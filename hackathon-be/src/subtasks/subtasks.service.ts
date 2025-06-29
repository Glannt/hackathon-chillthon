import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subtask, SubtaskStatus } from '../entities/subtask.entity';
import { Task } from '../entities/task.entity';

@Injectable()
export class SubtasksService {
  constructor(
    @InjectRepository(Subtask)
    private subtasksRepository: Repository<Subtask>,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findAll(): Promise<Subtask[]> {
    return this.subtasksRepository.find({
      relations: ['task'],
    });
  }

  async findOne(id: string): Promise<Subtask> {
    const subtask = await this.subtasksRepository.findOne({
      where: { id },
      relations: ['task'],
    });
    if (!subtask) {
      throw new NotFoundException(`Subtask with ID ${id} not found`);
    }
    return subtask;
  }

  async findByTask(taskId: string): Promise<Subtask[]> {
    return this.subtasksRepository.find({
      where: { taskId },
      order: { order: 'ASC' },
    });
  }

  async create(subtaskData: Partial<Subtask>): Promise<Subtask> {
    // Validate task exists
    if (subtaskData.taskId) {
      const task = await this.tasksRepository.findOne({
        where: { id: subtaskData.taskId },
      });
      if (!task) {
        throw new NotFoundException(
          `Task with ID ${subtaskData.taskId} not found`,
        );
      }
    }

    // Set order if not provided
    if (!subtaskData.order) {
      const existingSubtasks = await this.subtasksRepository.find({
        where: { taskId: subtaskData.taskId },
      });
      subtaskData.order = existingSubtasks.length + 1;
    }

    const subtask = this.subtasksRepository.create(subtaskData);
    return this.subtasksRepository.save(subtask);
  }

  async update(id: string, subtaskData: Partial<Subtask>): Promise<Subtask> {
    const subtask = await this.findOne(id);

    // Validate task exists if changing
    if (subtaskData.taskId && subtaskData.taskId !== subtask.taskId) {
      const task = await this.tasksRepository.findOne({
        where: { id: subtaskData.taskId },
      });
      if (!task) {
        throw new NotFoundException(
          `Task with ID ${subtaskData.taskId} not found`,
        );
      }
    }

    await this.subtasksRepository.update(id, subtaskData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.subtasksRepository.delete(id);
  }

  async updateStatus(
    subtaskId: string,
    status: SubtaskStatus,
  ): Promise<Subtask> {
    await this.subtasksRepository.update(subtaskId, { status });
    return this.findOne(subtaskId);
  }

  async reorder(taskId: string, subtaskIds: string[]): Promise<Subtask[]> {
    const subtasks = await this.subtasksRepository.find({
      where: { taskId },
    });

    // Update order for each subtask
    for (let i = 0; i < subtaskIds.length; i++) {
      await this.subtasksRepository.update(subtaskIds[i], { order: i + 1 });
    }

    return this.findByTask(taskId);
  }
}
