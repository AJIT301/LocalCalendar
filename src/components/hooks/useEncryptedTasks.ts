import { useState, useEffect } from 'react';
import type { Task } from '../Task/TaskForm';
import { encryptTasks, decryptTasks } from '../helper/CryptoHelpers';

export const useEncryptedTasks = (password: string) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const encrypted = localStorage.getItem('tasks');
        if (encrypted && password) {
            setTasks(decryptTasks(encrypted, password));
        }
    }, [password]);

    const addTask = (task: Task) => {
        const updatedTasks = [...tasks, task];
        setTasks(updatedTasks);
        if (password) {
            localStorage.setItem('tasks', encryptTasks(updatedTasks, password));
        }
    };

    return { tasks, addTask };
};