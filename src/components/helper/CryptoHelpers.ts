import CryptoJS from 'crypto-js';
import type { Task } from '../Task/TaskForm';

export const encryptTasks = (tasks: Task[], password: string): string => {
    return CryptoJS.AES.encrypt(JSON.stringify(tasks), password).toString();
};

export const decryptTasks = (cipherText: string, password: string): Task[] => {
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, password);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted ? JSON.parse(decrypted) : [];
    } catch {
        return [];
    }
};
