# Calendar Task Application

A modern, encrypted task management calendar built with React, TypeScript, and Vite.

## Features

- 📅 Interactive calendar with month navigation
- 🔒 Encrypted task storage using CryptoJS
- 🔔 Task notifications with reminder dates
- 🎨 Modern UI with dark mode support
- ⌨️ Keyboard shortcuts (ESC to close modals, Enter to unlock)

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. **Unlock Tasks**: Enter a password to access encrypted task data (press Enter or click "Unlock Tasks"). For development, modify `const devmode: boolean = false` in `Calendar.tsx` to `true` to bypass password.

2. **View Tasks**: Click any day in the current month to view existing tasks for that date.

3. **Add Tasks**: Fill in the title, description (optional), and reminder days, then click "Add Task". The modal stays open for adding multiple tasks.

4. **Navigate**: Use Previous/Next buttons to change months. Task indicators (•) show days with assigned tasks.

5. **Close Modals**: Click the × button or press ESC to close task modals.

## Technical Notes

- Tasks are encrypted and stored in localStorage
- Uses date-fns for date handling
- React Compiler enabled for optimized performance
- Fully responsive design
