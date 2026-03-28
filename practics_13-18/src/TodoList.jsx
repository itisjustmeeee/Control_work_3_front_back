import React from "react";
import TodoItem from './TodoItem';

function TodoList ({ todos, onToggle, onDelete }) {
    return(
        <div>
            {todos.map(todo => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default TodoList;