import React, { useState } from 'react';
import styles from './TaskForm.module.css';

export type Task = {
    id: number;
    title: string;
    description?: string;
    date: string;
    remindBeforeDays: number;
};

interface Props {
    onAdd: (task: Task) => void;
    preselectedDate?: string;
    showDate?: boolean;
}

const AddTaskForm: React.FC<Props> = ({ onAdd, preselectedDate, showDate = true }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(preselectedDate || '');
    const [remindBeforeDays, setRemindBeforeDays] = useState(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !date) return;

        const newTask: Task = {
            id: Date.now(),
            title,
            description,
            date,
            remindBeforeDays,
        };
        onAdd(newTask);
        setTitle('');
        setDescription('');
        setDate(preselectedDate || '');
        setRemindBeforeDays(1);
    };

    return (
        <form className={styles.taskForm} onSubmit={handleSubmit}>
            <input
                className={styles.taskFormInput}
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title"
                required
            />
            <input
                className={styles.taskFormInput}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description"
            />
            {showDate && (
                <input
                    placeholder="Date"
                    className={styles.taskFormInput}
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                />
            )}
            <label htmlFor="remindBeforeDays" className={styles.taskFormLabel}>Remind before (days):</label>
            <input
                className={`${styles.taskFormInput} ${styles.taskFormNumber}`}
                type="number"
                value={remindBeforeDays}
                onChange={e => setRemindBeforeDays(+e.target.value)}
                placeholder="Remind before (days)"
                min={0}
            />
            <button className={styles.taskFormButton} type="submit">Add Task</button>
        </form>
    );
};

export default AddTaskForm;
