export type Task = {
  id: number;
  title: string;
  description?: string;
  status: string;
  dueDate?: string;

  category?: {
    id: number;
    name: string;
  };
};

export type Category = {
  id: number;
  name: string;
};