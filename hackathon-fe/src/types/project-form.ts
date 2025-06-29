export interface CreateProjectForm {
  name: string;
  description: string;
  isActive: boolean;
}

export interface ProjectFormValidation {
  name: string;
  description: string;
}

export interface ProjectDraft {
  name: string;
  description: string;
  timestamp: string;
}

export interface ProjectPreview {
  name: string;
  description: string;
  isActive: boolean;
  createdBy: string;
}
