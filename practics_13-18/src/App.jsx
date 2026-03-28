import React, { useEffect, useState } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false
    };
    setTodos([...todos, newTodo]);
  }

  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo => todo.id === id ? {...todo, completed: !todo.completed} : todo)
    );
  };

  const deleteTodo = (id) => {
    setTodos(
      todos.filter(todo => todo.id !== id)
    );
  };

  return(
    <div style={{width: '400px', margin: '0 auto'}}>
      <h1>ToDo List</h1>
      <TodoForm onAdd={addTodo}/>
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo}/>
    </div>
  );
}

export default App;
