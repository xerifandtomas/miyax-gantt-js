export type Task = {
  id: string;
  name: string;
  start: string;
  end: string;
  color: string;
  description?: string;
}

export type TaskCollection = {
  tasks: Task[];
}
