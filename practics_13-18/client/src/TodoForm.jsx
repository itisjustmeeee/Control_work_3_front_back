import React, {useState} from "react";
import './App.css';

function TodoForm ({ onAdd }) {
    const [text, setText] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!text.trim()){
            setError('Введите задачу');
            return;
        }

        onAdd(text);
        setText('');
        setError('');
    };

    return(
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <input className="form-input"
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        if (error) setError('');
                    }}
                    placeholder="Введите задачу"
                />
                <button className="button-glow" type="submit">Добавить</button>
            </form>
        </div>
    );
}

export default TodoForm;