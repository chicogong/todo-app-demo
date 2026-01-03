# Todo App Demo

A simple yet powerful command-line todo application with priority and category management features.

## Features

### Core Functionality
- ✅ **Priority Management** - Three-level priority system (High, Medium, Low)
- 📁 **Category Organization** - Predefined categories (Work, Personal, Study, Shopping)
- 🔄 **Flexible Sorting** - Sort tasks by priority (ascending or descending)
- 🔍 **Smart Filtering** - Filter tasks by category
- ✏️ **Task Updates** - Edit task attributes on the fly
- 📊 **Statistics View** - Comprehensive statistics by category and priority

### All Available Functions
- `addTodo(task, priority, category)` - Add a new todo with priority and category
- `updateTodo(id, updates)` - Update task attributes
- `completeTodo(id)` - Mark a task as completed
- `deleteTodo(id)` - Delete a task
- `listTodos()` - List all tasks
- `sortByPriority(ascending)` - Sort and display by priority
- `filterByCategory(category)` - Filter and display by category
- `showStats()` - Show comprehensive statistics

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/chicogong/todo-app-demo.git
cd todo-app-demo

# Run the demo
node index.js
```

### Basic Usage

```javascript
const { PRIORITIES, CATEGORIES, addTodo, listTodos, sortByPriority } = require('./index');

// Add tasks with priority and category
addTodo('Complete project report', PRIORITIES.HIGH, CATEGORIES.WORK);
addTodo('Buy groceries', PRIORITIES.LOW, CATEGORIES.SHOPPING);
addTodo('Learn JavaScript', PRIORITIES.MEDIUM, CATEGORIES.STUDY);

// List all tasks
listTodos();

// Sort by priority (high to low)
sortByPriority();

// Sort by priority (low to high)
sortByPriority(true);

// Filter by category
filterByCategory(CATEGORIES.WORK);

// Show statistics
showStats();
```

## Demo Output

```
=== Todo App Demo ===

Adding todos...
✓ Added: Complete project report [high] [work]
✓ Added: Buy groceries [low] [shopping]
✓ Added: Learn JavaScript [medium] [study]
✓ Added: Call dentist [medium] [personal]
✓ Added: Prepare presentation [high] [work]

=== All Todos ===
  [HIGH] Complete project report (work)
  [LOW] Buy groceries (shopping)
  [MEDIUM] Learn JavaScript (study)
  [MEDIUM] Call dentist (personal)
  [HIGH] Prepare presentation (work)

=== Todos (High to Low Priority) ===
  [HIGH] Complete project report (work)
  [HIGH] Prepare presentation (work)
  [MEDIUM] Learn JavaScript (study)
  [MEDIUM] Call dentist (personal)
  [LOW] Buy groceries (shopping)

=== Todos in "work" ===
  [HIGH] Complete project report
  [HIGH] Prepare presentation

=== Todo Statistics ===

By Category:
  work: 2 total, 1 completed
  personal: 1 total, 0 completed
  study: 1 total, 0 completed
  shopping: 1 total, 0 completed

By Priority:
  high: 2 total, 1 completed
  medium: 2 total, 0 completed
  low: 1 total, 0 completed

Overall: 5 total, 1 completed, 4 pending
```

## Architecture

### Data Model

Each todo item contains:
```javascript
{
  id: 1234567890,           // Unique timestamp ID
  task: "Task description", // Task text
  completed: false,         // Completion status
  priority: "high",         // Priority: "high" | "medium" | "low"
  category: "work"          // Category: "work" | "personal" | "study" | "shopping"
}
```

### Constants

```javascript
PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
}

CATEGORIES = {
  WORK: 'work',
  PERSONAL: 'personal',
  STUDY: 'study',
  SHOPPING: 'shopping'
}
```

### Design Philosophy

- **Functional Architecture** - Pure functions with single responsibilities
- **Input Validation** - All functions validate inputs with helpful error messages
- **Immutability** - Non-destructive operations (e.g., sorting creates a copy)
- **Simplicity** - Easy to understand and extend

## API Reference

### addTodo(task, priority, category)
Add a new todo item.

**Parameters:**
- `task` (string) - Task description
- `priority` (string, optional) - Priority level (default: 'medium')
- `category` (string, optional) - Category (default: 'personal')

**Returns:** Task ID (number)

**Example:**
```javascript
const id = addTodo('Buy milk', PRIORITIES.HIGH, CATEGORIES.SHOPPING);
```

### updateTodo(id, updates)
Update an existing todo item.

**Parameters:**
- `id` (number) - Task ID
- `updates` (object) - Fields to update: `{ priority, category, completed, task }`

**Returns:** Boolean (success/failure)

**Example:**
```javascript
updateTodo(id, { priority: PRIORITIES.LOW, category: CATEGORIES.PERSONAL });
```

### completeTodo(id)
Mark a task as completed.

**Parameters:**
- `id` (number) - Task ID

**Returns:** Boolean (success/failure)

### deleteTodo(id)
Delete a task.

**Parameters:**
- `id` (number) - Task ID

**Returns:** Boolean (success/failure)

### listTodos()
Display all todos with their status, priority, and category.

### sortByPriority(ascending)
Display todos sorted by priority.

**Parameters:**
- `ascending` (boolean, optional) - Sort order (default: false = high to low)

### filterByCategory(category)
Display todos filtered by category.

**Parameters:**
- `category` (string) - Category to filter by

### showStats()
Display comprehensive statistics including:
- Task counts by category (total and completed)
- Task counts by priority (total and completed)
- Overall statistics

## Project Structure

```
todo-app-demo/
├── index.js                          # Main application file
├── package.json                      # Package configuration
├── README.md                         # This file
├── docs/
│   └── designs/
│       └── 2026-01-03-todo-priority-category-design.md
├── screenshots/
│   └── demo-output.txt              # Demo output screenshot
└── .claude/                         # Claude Code configurations
    ├── agents/                      # Custom AI agents
    ├── commands/                    # Slash commands
    └── skills/                      # Reusable skills
```

## Design Document

Full design documentation available at: [`docs/designs/2026-01-03-todo-priority-category-design.md`](docs/designs/2026-01-03-todo-priority-category-design.md)

## Development

This project was developed using [Claude Code](https://claude.com/claude-code) with the Happy Coding Agent toolkit, demonstrating:
- Feature design through collaborative dialogue (`/feature-analyzer`)
- Incremental implementation with validation
- Clean, maintainable code architecture

## Future Enhancements

Potential features for future versions:
- Data persistence (JSON file or database)
- Custom user-defined categories
- Task deadlines and reminders
- Subtask support
- Web UI interface
- Export to various formats (JSON, CSV, Markdown)

## License

MIT

## Author

Created with [Claude Code](https://claude.com/claude-code)
