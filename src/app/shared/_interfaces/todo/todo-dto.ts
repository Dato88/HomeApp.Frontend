import { TodoPriorityEnum } from '../../enum/todo-priority.enum';

export interface TodoDto {
  todoId: number;
  todoGroupId?: number;
  name: string;
  done: boolean;
  priority: TodoPriorityEnum;
  lastModified?: Date;
  isLoading: boolean;
}
