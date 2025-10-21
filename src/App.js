import { useEffect, useState } from "react";
import axios from "axios";

function App() {
    const [tasks, setTasks] = useState([]);
    const [text, setText] = useState("");

    const API_URL = "http://localhost:5000/tasks";

    // Получаем все задачи
    useEffect(() => {
        const fetchTasks = async () => {
            const result = await axios.get(API_URL);
            setTasks(result.data);
        };
        fetchTasks();
    }, []);

    // Добавляем новую задачу
    const addTask = async () => {
        if (!text.trim()) return;
        const result = await axios.post(API_URL, { text });
        setTasks([...tasks, result.data]);
        setText("");
    };

    // Меняем статус задачи
    const toggleTask = async (id, done) => {
        const result = await axios.put(`${API_URL}/${id}`, { done: !done });
        setTasks(tasks.map(task => (task._id === id ? result.data : task)));
    };

    // Удаляем задачу
    const deleteTask = async (id) => {
        await axios.delete(`${API_URL}/${id}`);
        setTasks(tasks.filter(task => task._id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
            <h1 className="text-4xl font-bold mb-6">🧠 ToDo App</h1>

            <div className="flex gap-2 mb-6">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="px-3 py-2 rounded bg-gray-800 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Введите задачу..."
                />
                <button
                    onClick={addTask}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded"
                >
                    Добавить
                </button>
            </div>

            <ul className="w-full max-w-md">
                {tasks.map((task) => (
                    <li
                        key={task._id}
                        className={`flex justify-between items-center px-4 py-2 mb-2 rounded bg-gray-800 ${
                            task.done ? "line-through text-gray-400" : ""
                        }`}
                    >
            <span
                onClick={() => toggleTask(task._id, task.done)}
                className="cursor-pointer"
            >
              {task.text}
            </span>
                        <button
                            onClick={() => deleteTask(task._id)}
                            className="text-red-400 hover:text-red-600"
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
