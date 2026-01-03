// Simple Todo App
const todos = [];

function addTodo(task) {
  todos.push({ id: Date.now(), task, completed: false });
  console.log('Todo added:', task);
}

function listTodos() {
  console.log('Current todos:');
  todos.forEach(todo => {
    console.log(`${todo.completed ? '✓' : ' '} ${todo.task}`);
  });
}

// Example usage
addTodo('Buy groceries');
addTodo('Write code');
listTodos();
