import React, { useState, useEffect } from 'react';
import AddTaskForm, { type Task } from '../Task/TaskForm';
import Modal from '../Modal/Modal';
import { useEncryptedTasks } from '../hooks/useEncryptedTasks';
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    format,
    addMonths,
    subMonths,
    isSameDay,
    isSameMonth,
} from 'date-fns';
import styles from './Calendar.module.css';

const Calendar: React.FC = () => {
    const devmode: boolean = false
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [password, setPassword] = useState('');
    const { tasks, addTask } = useEncryptedTasks(password);
    const [tempPassword, setTempPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (successMessage) {
            const controller = new AbortController();
            const timeout = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

            return () => {
                controller.abort();
                clearTimeout(timeout);
            };
        }
    }, [successMessage]);

    useEffect(() => {
        if (selectedDate) {
            setSuccessMessage(''); // Clear message when date changes
        }
    }, [selectedDate]);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const renderHeader = () => (
        <div className={styles['calendar-header']}>
            <button className={styles['calendar-nav-button']} onClick={prevMonth}>Previous</button>
            <h1 className={styles['calendar-title']}>{format(currentMonth, 'MMMM yyyy')}</h1>
            <button className={styles['calendar-nav-button']} onClick={nextMonth}>Next</button>
        </div>
    );

    const renderDays = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className={styles['calendar-weekdays']}>
                {days.map(day => (
                    <div key={day} className={styles['calendar-weekday']}>{day}</div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);



        const cells = [];
        let day = startDate;

        while (day <= endDate) {
            let className = styles['calendar-day'];
            const isCurrentMonth = day.getFullYear() === currentMonth.getFullYear() && day.getMonth() === currentMonth.getMonth();
            if (!isCurrentMonth) className += ' ' + styles['other-month'];
            if (isSameDay(day, new Date())) className += ' ' + styles['today'];

            // Highlight day if it has a task
            const dayString = format(day, 'yyyy-MM-dd');
            const dayTasks = tasks.filter(t => t.date === dayString);
            if (dayTasks.length > 0) className += ' ' + styles['has-task'];

            cells.push(
                <div
                    key={day.toString()}
                    className={className}
                    title={dayString}
                    onClick={() => {
                        if (isCurrentMonth) {
                            setSelectedDate(dayString);
                            setIsModalOpen(true);
                        }
                    }}
                >
                    <span className={styles['calendar-day-number']}>{format(day, 'd')}</span>
                    {dayTasks.length > 0 && (
                        <span className={styles['calendar-notification']}>●</span>
                    )}
                </div>
            );
            day = addDays(day, 1);
        }

        return <div className={styles['calendar-grid']}>{cells}</div>;
    };
    
    if (!devmode) {
        if (!password) {
            return (
                <div>
                    <h2>Enter password to unlock tasks:</h2>
                    <input
                        type="password"
                        value={tempPassword}
                        onChange={e => setTempPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && setPassword(tempPassword)}
                        placeholder="Enter password"
                    />
                    <button onClick={() => setPassword(tempPassword)}>Unlock Tasks</button>
                </div>
            );
        }
    }
    return (
        <div className={styles['calendar-container']}>
            {renderHeader()}
            <div className={styles['calendar-main']}>
                {renderDays()}
                {renderCells()}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedDate(null);
                }}
            >
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Tasks for {selectedDate}</h2>
                </div>
                {selectedDate && (
                    <div className={styles.modalBody}>
                        {(() => {
                            const dayTasks = tasks.filter(t => t.date === selectedDate);
                            return dayTasks.length === 0 ? (
                                <p className={styles.modalNoTasks}>No tasks for this date.</p>
                            ) : (
                                <ul className={styles.modalTaskList}>
                                    {dayTasks.map(task => (
                                        <li key={task.id} className={styles.modalTaskItem}>
                                            <div className={styles.modalTaskTitle}>{task.title}</div>
                                            {task.description && <div className={styles.modalTaskDescription}>{task.description}</div>}
                                            <div className={styles.modalTaskReminder}>Remind before {task.remindBeforeDays} days</div>
                                        </li>
                                    ))}
                                </ul>
                            );
                        })()}
                        <div className={styles.modalFormSection}>
                            <h3 className={styles.modalFormTitle}>Add New Task</h3>
                            {successMessage && <p className={styles.modalSuccessMessage}>{successMessage}</p>}
                        </div>
                        <AddTaskForm
                            onAdd={(task: Task) => {
                                addTask(task);
                                setSuccessMessage('Task added!');
                                // Keep modal open to allow adding more tasks
                            }}
                            preselectedDate={selectedDate}
                            showDate={false}
                        />
                    </div>
                )}
            </Modal>

            <h2>Pending Events This Week:</h2>
            <ul>
                {tasks
                    .filter(t => {
                        const today = new Date();
                        const taskDate = new Date(t.date);
                        const remindDate = new Date(taskDate);
                        remindDate.setDate(taskDate.getDate() - t.remindBeforeDays);
                        return today >= remindDate && today <= taskDate;
                    })
                    .map(t => (
                        <li key={t.id}>{t.title} ({t.date})</li>
                    ))}
            </ul>
        </div>
    );
};

export default Calendar;
