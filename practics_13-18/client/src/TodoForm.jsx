import React, {useState} from "react";
import './App.css';

function TodoForm ({ onAdd }) {
    const [text, setText] = useState('');
    const [reminder, setreminder] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!text.trim()){
            setError('Введите задачу');
            return;
        }

        if (!reminder) {
            setError('Выберите дату и время напоминания');
            return;
        }

        onAdd({text, reminder});
        setText('');
        setreminder('');
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
                <input
                    className="form-input"
                    type="datetime-local"
                    value={reminder}
                    onChange={(e) => {
                        setreminder(e.target.value);
                        if (error) setError('');
                    }}
                />
                {error && <div className="error">{error}</div>}
                <button className="button-glow" type="submit">Добавить</button>
            </form>
        </div>
    );
}

export default TodoForm;