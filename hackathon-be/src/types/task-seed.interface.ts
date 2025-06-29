export interface TaskSeedData {
  taskId: string;
  taskName: string;
  taskType: 'Low' | 'Medium' | 'High'; // Loại task
  difficultyExplanation: string; // Độ khó (giải thích)
  mainSkill: string; // Kỹ năng chính
  workload: 'Small' | 'Medium' | 'Large'; // Khối lượng
  priorityReason: 1 | 2 | 3 | 4 | 5; // Ưu tiên (1-5, lý do)
}

export interface UserSeedData {
  Id: string;
  Name: string;
  Department: string;
  Position: string;
  Experience: string;
  ProjectsDone: string;
  AvgTaskCompletion: string;
  DeadlineMisses: string;
}
