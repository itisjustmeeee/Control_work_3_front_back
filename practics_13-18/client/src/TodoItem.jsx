import React from "react";
import './App.css';

function TodoItem({ todo, onToggle, onDelete}) {
    return (
        <div className="card">
            <span style={{margin: '1rem', textDecoration: todo.completed ? 'line-through' : 'none'}} className="text-decor">
                {todo.text}
            </span>
            <div>
             <button className="small-button" style={{margin: '0 10px', width: '150px'}} onClick={() => onDelete(todo.id)}>Удалить</button>
             <button className="small-button" style={{margin: '0 10px', width: '200px'}} onClick={() => onToggle(todo.id)}>{todo.completed ? 'сделано' : 'не выполнено'}</button>
            </div>
        </div>
    );
}
 export default TodoItem;