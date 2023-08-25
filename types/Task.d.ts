export type Task = {
  id: string;
  name: string;
  start: Date;
  end: Date;
  color: string;
  description?: string;
}

export type TaskCollection = {
  tasks: Task[];
}
