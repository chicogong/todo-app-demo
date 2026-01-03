// ===== Constants =====
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

// ===== State =====
let todos = [];
const state = {
  currentFilter: 'all',
  currentSort: 'default',
  darkMode: false,
  editingId: null,
  draggedElement: null,
  statsExpanded: true
};

// ===== Storage Service =====
const StorageService = {
  save() {
    localStorage.setItem('todos', JSON.stringify(todos));
  },

  load() {
    const data = localStorage.getItem('todos');
    return data ? JSON.parse(data) : [];
  },

  saveSettings() {
    localStorage.setItem('settings', JSON.stringify({
      darkMode: state.darkMode,
      statsExpanded: state.statsExpanded
    }));
  },

  loadSettings() {
    const data = localStorage.getItem('settings');
    return data ? JSON.parse(data) : {};
  }
};

// ===== Business Logic =====
function addTodo(task, priority = PRIORITIES.MEDIUM, category = CATEGORIES.PERSONAL) {
  if (!task || task.trim() === '') return null;

  // Validate priority
  if (!Object.values(PRIORITIES).includes(priority)) {
    priority = PRIORITIES.MEDIUM;
  }

  // Validate category
  if (!Object.values(CATEGORIES).includes(category)) {
    category = CATEGORIES.PERSONAL;
  }

  const todo = {
    id: Date.now(),
    task: task.trim(),
    completed: false,
    priority,
    category,
    order: todos.length
  };

  todos.push(todo);
  StorageService.save();
  return todo.id;
}

function updateTodo(id, updates) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return false;

  if (updates.priority && Object.values(PRIORITIES).includes(updates.priority)) {
    todo.priority = updates.priority;
  }

  if (updates.category && Object.values(CATEGORIES).includes(updates.category)) {
    todo.category = updates.category;
  }

  if (typeof updates.completed === 'boolean') {
    todo.completed = updates.completed;
  }

  if (updates.task !== undefined) {
    todo.task = updates.task.trim();
  }

  StorageService.save();
  return true;
}

function completeTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return false;
  todo.completed = !todo.completed;
  StorageService.save();
  return true;
}

function deleteTodo(id) {
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return false;
  todos.splice(index, 1);
  StorageService.save();
  return true;
}

function reorderTodos(fromIndex, toIndex) {
  const [removed] = todos.splice(fromIndex, 1);
  todos.splice(toIndex, 0, removed);
  todos.forEach((todo, index) => {
    todo.order = index;
  });
  StorageService.save();
}

function getFilteredTodos() {
  let filtered = [...todos];

  // Filter by category
  if (state.currentFilter !== 'all') {
    filtered = filtered.filter(t => t.category === state.currentFilter);
  }

  // Sort
  if (state.currentSort === 'priority-desc') {
    filtered.sort((a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]);
  } else if (state.currentSort === 'priority-asc') {
    filtered.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  } else {
    filtered.sort((a, b) => a.order - b.order);
  }

  return filtered;
}

function calculateStats() {
  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    byCategory: {},
    byPriority: {}
  };

  // By category
  Object.values(CATEGORIES).forEach(cat => {
    const categoryTodos = todos.filter(t => t.category === cat);
    stats.byCategory[cat] = {
      total: categoryTodos.length,
      completed: categoryTodos.filter(t => t.completed).length
    };
  });

  // By priority
  Object.values(PRIORITIES).forEach(pri => {
    const priorityTodos = todos.filter(t => t.priority === pri);
    stats.byPriority[pri] = {
      total: priorityTodos.length,
      completed: priorityTodos.filter(t => t.completed).length
    };
  });

  return stats;
}

// ===== UI Rendering =====
function renderTodos() {
  const taskList = document.getElementById('taskList');
  const filtered = getFilteredTodos();

  if (filtered.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">✨</div>
        <p>No tasks ${state.currentFilter !== 'all' ? 'in this category' : 'yet'}. ${state.currentFilter === 'all' ? 'Add one above to get started!' : ''}</p>
      </div>
    `;
    return;
  }

  taskList.innerHTML = filtered.map((todo, index) => `
    <div class="task-item ${todo.completed ? 'completed' : ''}"
         data-id="${todo.id}"
         data-index="${index}"
         draggable="true">
      <span class="drag-handle">⋮⋮</span>
      <input type="checkbox"
             class="task-checkbox"
             ${todo.completed ? 'checked' : ''}
             onchange="completeTodo(${todo.id}); updateUI();">
      <span class="priority-badge ${todo.priority}">${todo.priority}</span>
      <span class="task-text" data-id="${todo.id}">${escapeHtml(todo.task)}</span>
      <span class="category-badge">${getCategoryIcon(todo.category)} ${todo.category}</span>
      <div class="task-actions">
        <button class="btn-icon btn-edit" onclick="startEdit(${todo.id})" title="Edit">✏️</button>
        <button class="btn-icon btn-delete" onclick="if(confirm('Delete this task?')) { deleteTodo(${todo.id}); updateUI(); }" title="Delete">🗑️</button>
      </div>
    </div>
  `).join('');

  // Add double-click to edit
  document.querySelectorAll('.task-text').forEach(el => {
    el.addEventListener('dblclick', () => {
      const id = parseInt(el.dataset.id);
      startEdit(id);
    });
  });

  // Add drag and drop
  setupDragAndDrop();
}

function renderStats() {
  const stats = calculateStats();

  // Summary
  document.getElementById('totalTasks').textContent = stats.total;
  document.getElementById('completedTasks').textContent = stats.completed;

  // Category stats
  const categoryStats = document.getElementById('categoryStats');
  categoryStats.innerHTML = Object.entries(stats.byCategory).map(([cat, data]) => `
    <div class="stat-item">
      <span class="stat-label">${getCategoryIcon(cat)} ${cat}</span>
      <span class="stat-value">${data.total} (${data.completed} done)</span>
    </div>
  `).join('');

  // Priority stats
  const priorityStats = document.getElementById('priorityStats');
  priorityStats.innerHTML = Object.entries(stats.byPriority).map(([pri, data]) => `
    <div class="stat-item">
      <span class="stat-label">${getPriorityIcon(pri)} ${pri}</span>
      <span class="stat-value">${data.total} (${data.completed} done)</span>
    </div>
  `).join('');
}

function updateUI() {
  renderTodos();
  renderStats();
}

// ===== Event Handlers =====
function startEdit(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo || todo.completed) return;

  state.editingId = id;
  const taskTextEl = document.querySelector(`.task-text[data-id="${id}"]`);
  const currentText = todo.task;

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'task-text-input';
  input.value = currentText;

  taskTextEl.replaceWith(input);
  input.focus();
  input.select();

  const saveEdit = () => {
    if (input.value.trim()) {
      updateTodo(id, { task: input.value });
    }
    state.editingId = null;
    updateUI();
  };

  const cancelEdit = () => {
    state.editingId = null;
    updateUI();
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  });

  input.addEventListener('blur', saveEdit);
}

function setupDragAndDrop() {
  const taskItems = document.querySelectorAll('.task-item');

  taskItems.forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('drop', handleDrop);
    item.addEventListener('dragend', handleDragEnd);
  });
}

function handleDragStart(e) {
  if (state.currentSort !== 'default') return;

  state.draggedElement = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
  if (state.currentSort !== 'default') return;
  if (e.preventDefault) e.preventDefault();

  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDrop(e) {
  if (state.currentSort !== 'default') return;
  if (e.stopPropagation) e.stopPropagation();

  if (state.draggedElement !== this) {
    const fromIndex = parseInt(state.draggedElement.dataset.index);
    const toIndex = parseInt(this.dataset.index);

    // Get actual indices in the full todos array
    const filtered = getFilteredTodos();
    const fromId = filtered[fromIndex].id;
    const toId = filtered[toIndex].id;
    const actualFromIndex = todos.findIndex(t => t.id === fromId);
    const actualToIndex = todos.findIndex(t => t.id === toId);

    reorderTodos(actualFromIndex, actualToIndex);
    updateUI();
  }

  return false;
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
}

function toggleDarkMode() {
  state.darkMode = !state.darkMode;
  document.body.classList.toggle('dark-mode', state.darkMode);
  updateThemeIcon();
  StorageService.saveSettings();
}

function updateThemeIcon() {
  const icon = document.querySelector('.theme-icon');
  icon.textContent = state.darkMode ? '☀️' : '🌙';
}

function toggleStats() {
  state.statsExpanded = !state.statsExpanded;
  const panel = document.getElementById('statsPanel');
  const toggle = document.getElementById('statsToggle');

  if (state.statsExpanded) {
    panel.style.maxHeight = panel.scrollHeight + 'px';
    toggle.innerHTML = '<span>▼</span>';
    toggle.classList.remove('collapsed');
  } else {
    panel.style.maxHeight = '0';
    toggle.innerHTML = '<span>▶</span>';
    toggle.classList.add('collapsed');
  }

  StorageService.saveSettings();
}

// ===== Helper Functions =====
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getCategoryIcon(category) {
  const icons = {
    work: '💼',
    personal: '👤',
    study: '📚',
    shopping: '🛒'
  };
  return icons[category] || '📝';
}

function getPriorityIcon(priority) {
  const icons = {
    high: '🔴',
    medium: '🟡',
    low: '🟢'
  };
  return icons[priority] || '⚪';
}

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
  // Load data
  todos = StorageService.load();
  const settings = StorageService.loadSettings();

  // Restore settings
  if (settings.darkMode) {
    state.darkMode = true;
    document.body.classList.add('dark-mode');
  }

  if (settings.statsExpanded !== undefined) {
    state.statsExpanded = settings.statsExpanded;
    if (!state.statsExpanded) {
      document.getElementById('statsPanel').style.maxHeight = '0';
      document.getElementById('statsToggle').classList.add('collapsed');
      document.getElementById('statsToggle').innerHTML = '<span>▶</span>';
    }
  }

  updateThemeIcon();
  updateUI();

  // Add task form
  document.getElementById('addTaskForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const categorySelect = document.getElementById('categorySelect');

    const task = taskInput.value;
    const priority = prioritySelect.value;
    const category = categorySelect.value;

    if (addTodo(task, priority, category)) {
      taskInput.value = '';
      prioritySelect.value = PRIORITIES.MEDIUM;
      categorySelect.value = CATEGORIES.PERSONAL;
      updateUI();
      taskInput.focus();
    }
  });

  // Filter buttons
  document.querySelectorAll('.btn-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentFilter = btn.dataset.filter;
      updateUI();
    });
  });

  // Sort buttons
  document.querySelectorAll('.btn-sort').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-sort').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentSort = btn.dataset.sort;
      updateUI();
    });
  });

  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', toggleDarkMode);

  // Stats toggle
  document.getElementById('statsToggle').addEventListener('click', toggleStats);

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + D - Toggle dark mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      toggleDarkMode();
    }

    // Escape - Cancel edit or clear input
    if (e.key === 'Escape') {
      if (state.editingId) {
        state.editingId = null;
        updateUI();
      } else {
        document.getElementById('taskInput').value = '';
      }
    }
  });
});
