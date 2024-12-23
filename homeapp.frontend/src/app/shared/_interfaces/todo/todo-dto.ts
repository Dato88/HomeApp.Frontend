import { TodoPriorityEnum } from '../../enum/todo-priority.enum';

export interface TodoDto {
  id: number;
  todoGroupId?: number;
  name: string;
  done: boolean;
  priority: TodoPriorityEnum;
  executionDate?: Date;
}
