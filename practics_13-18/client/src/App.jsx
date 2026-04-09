import React, { useEffect, useState } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { socket } from './socket';
import { subscribeToPush, unsubscribeFromPush } from './push/PushService';

function App() {

  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });

  const [notification, setNotification] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected:", socket.id);
    });

    return () => socket.off("connect");
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .catch(err => console.log('SW failed', err));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    socket.on("taskAdded", (task) => {
      setTodos(prev => [...prev, task]);

      setNotification(`Новая задача: ${task.text}`);
      setTimeout(() => setNotification(null), 3000);
    });

    return () => socket.off("taskAdded");
  }, []);

  useEffect(() => {
    socket.on('reminderTriggered', (task) => {
      setNotification(`Напоминание: ${task.text}`);
      setTimeout(() => setNotification(null), 3000);
    });

    return () => socket.off('reminderTriggered');
  }, []);

  useEffect(() => {
    socket.on('reminderUpdated', (updatedTask) => {
      setTodos(prev => 
        prev.map(todo => 
          todo.id === updatedTask.id ? updatedTask : todo
        )
      );
    });

    return () => socket.off('reminderUpdated');
  }, []);

  const addTodo = ({text, reminder}) => {
    const newTodo = {
      id: Date.now(),
      text,
      reminder,
      completed: false
    };
    
    socket.emit("newTask", newTodo);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo => 
        todo.id == id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleSubscribe = async () => {
    await subscribeToPush();
    setIsSubscribed(true);
  };

  const handleUnsubscribe = async () => {
    await unsubscribeFromPush();
    setIsSubscribed(false);
  };

  useEffect(() => {
    async function check() {
      if (!('serviceWorker' in navigator)) return;

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      setIsSubscribed(!!sub);
    }

    check();
  }, []);

  return(
    <div style={{width: '400px', margin: '0 auto'}}>
      <h1>ToDo List</h1>

      <footer style={{ textAlign: "center", marginTop: "20px"}}>
        {!isSubscribed ? (
          <button onClick={handleSubscribe} className='notificationButton'>
            Включить уведомления
          </button>
        ) : (
          <button onClick={handleUnsubscribe} className='notificationButton'>
            Отключить уведомления
          </button>
        )}
      </footer>

      <TodoForm onAdd={addTodo}/>

      <TodoList 
        todos={todos} 
        onToggle={toggleTodo} 
        onDelete={deleteTodo}
      />
    </div>
  );
}

export default App;
