export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string; // ISO 形式の日付文字列（例: "2024-12-31"）
}
