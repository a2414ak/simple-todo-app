import { useState } from 'react';
import './App.css';
import { Todo, TodoStatus } from './types';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [filterStatus, setFilterStatus] = useState<TodoStatus>('notStarted');
  const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate'>('createdAt');

  const isOverdue = (due: string | undefined): boolean => {
    if (!due) return false;
    return new Date(due) < new Date(new Date().toDateString());
  };

  const addTodo = () => {
    if (input.trim() === '') return;
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: input,
      completed: false,
      dueDate: dueDate || undefined,
      status: 'notStarted',
    };
    setTodos([...todos, newTodo]);
    setInput('');
    setDueDate('');
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, status: !todo.completed ? 'completed' : 'notStarted' }
          : todo
      )
    );
  };

  const updateTodoStatus = (id: string, newStatus: TodoStatus) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, status: newStatus, completed: newStatus === 'completed' }
          : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const getSortedTodos = (todosToSort: Todo[]): Todo[] => {
    const sorted = [...todosToSort];
    if (sortBy === 'createdAt') {
      return sorted; // 作成順（ID は Date.now()）
    } else if (sortBy === 'dueDate') {
      return sorted.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }
    return sorted;
  };

  const filteredTodos = getSortedTodos(todos.filter((todo) => todo.status === filterStatus));

  const statusLabels: Record<TodoStatus, string> = {
    notStarted: '未着手',
    inProgress: '進行中',
    completed: '完了',
  };

  return (
    <div className="app">
      <h1>シンプル ToDo アプリ</h1>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="タスクを入力..."
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          placeholder="期限を選択..."
        />
        <button onClick={addTodo}>追加</button>
      </div>

      <div className="status-tabs-container">
        <div className="status-tabs">
          {(['notStarted', 'inProgress', 'completed'] as TodoStatus[]).map((status) => (
            <button
              key={status}
              className={`status-tab ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {statusLabels[status]} ({todos.filter((t) => t.status === status).length})
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'dueDate')}
          className="sort-select"
        >
          <option value="createdAt">作成日時</option>
          <option value="dueDate">期限</option>
        </select>
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className={`todo-item ${todo.completed ? 'completed' : ''} ${
              isOverdue(todo.dueDate) ? 'overdue' : ''
            }`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <div className="todo-content">
              <span>{todo.text}</span>
              {todo.dueDate && (
                <span className="due-date">期限: {todo.dueDate}</span>
              )}
            </div>
            <div className="todo-actions">
              <select
                value={todo.status}
                onChange={(e) => updateTodoStatus(todo.id, e.target.value as TodoStatus)}
                className="status-select"
              >
                <option value="notStarted">未着手</option>
                <option value="inProgress">進行中</option>
                <option value="completed">完了</option>
              </select>
              <button onClick={() => deleteTodo(todo.id)}>削除</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
