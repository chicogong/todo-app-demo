// Todo App with Priority and Category Support

// Constants
const PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

const CATEGORIES = {
  WORK: 'work',
  PERSONAL: 'personal',
  STUDY: 'study',
  SHOPPING: 'shopping'
};

const PRIORITY_ORDER = {
  high: 3,
  medium: 2,
  low: 1
};

// Data storage
const todos = [];

// Add a new todo
function addTodo(task, priority = PRIORITIES.MEDIUM, category = CATEGORIES.PERSONAL) {
  // Validate priority
  if (!Object.values(PRIORITIES).includes(priority)) {
    console.log(`⚠ Invalid priority. Using default: ${PRIORITIES.MEDIUM}`);
    priority = PRIORITIES.MEDIUM;
  }

  // Validate category
  if (!Object.values(CATEGORIES).includes(category)) {
    console.log(`⚠ Invalid category. Using default: ${CATEGORIES.PERSONAL}`);
    category = CATEGORIES.PERSONAL;
  }

  const todo = {
    id: Date.now(),
    task,
    completed: false,
    priority,
    category
  };

  todos.push(todo);
  console.log(`✓ Added: ${task} [${priority}] [${category}]`);
  return todo.id;
}

// Update a todo
function updateTodo(id, updates) {
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    console.log('✗ Todo not found');
    return false;
  }

  if (updates.priority && Object.values(PRIORITIES).includes(updates.priority)) {
    todo.priority = updates.priority;
  }

  if (updates.category && Object.values(CATEGORIES).includes(updates.category)) {
    todo.category = updates.category;
  }

  if (typeof updates.completed === 'boolean') {
    todo.completed = updates.completed;
  }

  if (updates.task) {
    todo.task = updates.task;
  }

  console.log(`✓ Updated: ${todo.task}`);
  return true;
}

// Mark todo as completed
function completeTodo(id) {
  return updateTodo(id, { completed: true });
}

// Delete a todo
function deleteTodo(id) {
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    console.log('✗ Todo not found');
    return false;
  }

  const deleted = todos.splice(index, 1)[0];
  console.log(`✓ Deleted: ${deleted.task}`);
  return true;
}

// List all todos
function listTodos() {
  if (todos.length === 0) {
    console.log('No todos yet. Add one with addTodo()!');
    return;
  }

  console.log('\n=== All Todos ===');
  todos.forEach(todo => {
    const status = todo.completed ? '✓' : ' ';
    const priorityBadge = `[${todo.priority.toUpperCase()}]`;
    const categoryBadge = `(${todo.category})`;
    console.log(`${status} ${priorityBadge} ${todo.task} ${categoryBadge}`);
  });
  console.log('');
}

// Sort and display todos by priority
function sortByPriority(ascending = false) {
  if (todos.length === 0) {
    console.log('No todos to sort.');
    return;
  }

  const sorted = [...todos].sort((a, b) => {
    const diff = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
    return ascending ? -diff : diff;
  });

  console.log(ascending ? '\n=== Todos (Low to High Priority) ===' : '\n=== Todos (High to Low Priority) ===');
  sorted.forEach(todo => {
    const status = todo.completed ? '✓' : ' ';
    const priorityBadge = `[${todo.priority.toUpperCase()}]`;
    const categoryBadge = `(${todo.category})`;
    console.log(`${status} ${priorityBadge} ${todo.task} ${categoryBadge}`);
  });
  console.log('');
}

// Filter todos by category
function filterByCategory(category) {
  if (!Object.values(CATEGORIES).includes(category)) {
    console.log(`✗ Invalid category. Available: ${Object.values(CATEGORIES).join(', ')}`);
    return;
  }

  const filtered = todos.filter(t => t.category === category);

  if (filtered.length === 0) {
    console.log(`No todos found in category: ${category}`);
    return;
  }

  console.log(`\n=== Todos in "${category}" ===`);
  filtered.forEach(todo => {
    const status = todo.completed ? '✓' : ' ';
    const priorityBadge = `[${todo.priority.toUpperCase()}]`;
    console.log(`${status} ${priorityBadge} ${todo.task}`);
  });
  console.log('');
}

// Show statistics
function showStats() {
  console.log('\n=== Todo Statistics ===\n');

  // By category
  console.log('By Category:');
  Object.values(CATEGORIES).forEach(cat => {
    const count = todos.filter(t => t.category === cat).length;
    const completed = todos.filter(t => t.category === cat && t.completed).length;
    console.log(`  ${cat}: ${count} total, ${completed} completed`);
  });

  // By priority
  console.log('\nBy Priority:');
  Object.values(PRIORITIES).forEach(pri => {
    const count = todos.filter(t => t.priority === pri).length;
    const completed = todos.filter(t => t.priority === pri && t.completed).length;
    console.log(`  ${pri}: ${count} total, ${completed} completed`);
  });

  // Overall
  const total = todos.length;
  const totalCompleted = todos.filter(t => t.completed).length;
  console.log(`\nOverall: ${total} total, ${totalCompleted} completed, ${total - totalCompleted} pending\n`);
}

// Demo usage
console.log('=== Todo App Demo ===\n');

// Add some todos
console.log('Adding todos...');
const id1 = addTodo('Complete project report', PRIORITIES.HIGH, CATEGORIES.WORK);
const id2 = addTodo('Buy groceries', PRIORITIES.LOW, CATEGORIES.SHOPPING);
const id3 = addTodo('Learn JavaScript', PRIORITIES.MEDIUM, CATEGORIES.STUDY);
const id4 = addTodo('Call dentist', PRIORITIES.MEDIUM, CATEGORIES.PERSONAL);
const id5 = addTodo('Prepare presentation', PRIORITIES.HIGH, CATEGORIES.WORK);

// List all todos
listTodos();

// Sort by priority
sortByPriority();

// Filter by category
filterByCategory(CATEGORIES.WORK);

// Complete a todo
console.log('\nCompleting a todo...');
completeTodo(id1);

// Update a todo
console.log('\nUpdating a todo...');
updateTodo(id2, { priority: PRIORITIES.HIGH });

// Show statistics
showStats();

// Sort ascending
sortByPriority(true);

// Export functions for potential reuse
module.exports = {
  PRIORITIES,
  CATEGORIES,
  addTodo,
  updateTodo,
  completeTodo,
  deleteTodo,
  listTodos,
  sortByPriority,
  filterByCategory,
  showStats
};
