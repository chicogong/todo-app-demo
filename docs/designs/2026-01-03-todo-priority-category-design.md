# Todo 应用优先级和分类功能设计

**日期**: 2026-01-03
**状态**: Approved
**作者**: Claude Code

## 概述

为 Todo 应用添加任务优先级和分类功能，支持按优先级排序、按分类筛选、编辑任务属性和统计视图。

## 需求

### 功能需求
- 任务优先级：高(high)、中(medium)、低(low) 三级
- 任务分类：预定义分类（工作、个人、学习、购物）
- 按优先级排序（高→低 或 低→高）
- 按分类筛选（只显示特定分类的任务）
- 编辑任务属性（修改优先级和分类）
- 统计视图（显示各分类和优先级的任务数量）

### 技术约束
- 仅内存存储（不需要持久化）
- 保持简单的命令行交互
- Node.js 实现

## 数据模型

### Todo 对象结构

```javascript
{
  id: 1234567890,           // 时间戳ID
  task: "完成项目报告",      // 任务描述
  completed: false,         // 完成状态
  priority: "high",         // 优先级: "high" | "medium" | "low"
  category: "work"          // 分类: "work" | "personal" | "study" | "shopping"
}
```

### 常量定义

```javascript
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
```

## 架构设计

### 方案选择

采用**函数式架构**：
- 全局数组 `todos` 存储所有任务
- 独立的纯函数处理不同操作
- 每个函数职责单一

### 核心函数

1. **addTodo(task, priority, category)** - 添加任务
2. **updateTodo(id, updates)** - 更新任务属性
3. **completeTodo(id)** - 标记任务完成
4. **deleteTodo(id)** - 删除任务
5. **listTodos()** - 列出所有任务
6. **sortByPriority(ascending)** - 按优先级排序显示
7. **filterByCategory(category)** - 按分类筛选显示
8. **showStats()** - 显示统计信息

## 实现细节

### 1. addTodo()

```javascript
function addTodo(task, priority = PRIORITIES.MEDIUM, category = CATEGORIES.PERSONAL) {
  // 验证输入
  if (!Object.values(PRIORITIES).includes(priority)) {
    priority = PRIORITIES.MEDIUM;
  }
  if (!Object.values(CATEGORIES).includes(category)) {
    category = CATEGORIES.PERSONAL;
  }

  // 创建任务
  const todo = { id: Date.now(), task, completed: false, priority, category };
  todos.push(todo);
  console.log(`✓ Added: ${task} [${priority}] [${category}]`);
}
```

### 2. updateTodo()

```javascript
function updateTodo(id, updates) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return false;

  // 更新字段
  if (updates.priority) todo.priority = updates.priority;
  if (updates.category) todo.category = updates.category;
  if (typeof updates.completed === 'boolean') todo.completed = updates.completed;

  console.log(`✓ Updated: ${todo.task}`);
  return true;
}
```

### 3. sortByPriority()

```javascript
function sortByPriority(ascending = false) {
  const sorted = [...todos].sort((a, b) => {
    const diff = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
    return ascending ? -diff : diff;
  });

  // 显示排序后的任务
  sorted.forEach(todo => {
    const status = todo.completed ? '✓' : ' ';
    console.log(`${status} [${todo.priority.toUpperCase()}] ${todo.task} (${todo.category})`);
  });
}
```

### 4. filterByCategory()

```javascript
function filterByCategory(category) {
  const filtered = todos.filter(t => t.category === category);

  // 显示筛选结果
  filtered.forEach(todo => {
    const status = todo.completed ? '✓' : ' ';
    console.log(`${status} [${todo.priority.toUpperCase()}] ${todo.task}`);
  });
}
```

### 5. showStats()

```javascript
function showStats() {
  // 按分类统计
  Object.values(CATEGORIES).forEach(cat => {
    const count = todos.filter(t => t.category === cat).length;
    const completed = todos.filter(t => t.category === cat && t.completed).length;
    console.log(`${cat}: ${count} total, ${completed} completed`);
  });

  // 按优先级统计
  Object.values(PRIORITIES).forEach(pri => {
    const count = todos.filter(t => t.priority === pri).length;
    console.log(`${pri}: ${count} tasks`);
  });
}
```

## 错误处理

1. **输入验证**：所有函数验证参数有效性
2. **默认值**：无效输入使用默认值
3. **友好提示**：显示清晰的错误信息

## 示例用法

```javascript
// 添加任务
addTodo('完成项目报告', PRIORITIES.HIGH, CATEGORIES.WORK);
addTodo('买菜', PRIORITIES.LOW, CATEGORIES.SHOPPING);
addTodo('学习JavaScript', PRIORITIES.MEDIUM, CATEGORIES.STUDY);

// 查看任务
listTodos();
sortByPriority();              // 高到低
sortByPriority(true);          // 低到高
filterByCategory(CATEGORIES.WORK);

// 更新任务
updateTodo(todoId, { priority: PRIORITIES.HIGH });

// 统计
showStats();
```

## Implementation Tasks

- [ ] **定义常量和数据结构** `priority:1` `phase:model` `time:5min`
  - files: index.js
  - [ ] 定义 PRIORITIES, CATEGORIES, PRIORITY_ORDER 常量
  - [ ] 初始化 todos 数组
  - [ ] 提交代码

- [ ] **实现 addTodo() 函数** `priority:2` `phase:model` `deps:定义常量和数据结构` `time:10min`
  - files: index.js
  - [ ] 编写带参数验证的 addTodo 函数
  - [ ] 添加测试用例
  - [ ] 运行测试验证
  - [ ] 提交代码

- [ ] **实现 updateTodo() 函数** `priority:3` `phase:api` `deps:实现 addTodo() 函数` `time:10min`
  - files: index.js
  - [ ] 编写 updateTodo 函数查找和更新逻辑
  - [ ] 添加边界情况测试
  - [ ] 运行测试验证
  - [ ] 提交代码

- [ ] **实现 completeTodo() 和 deleteTodo()** `priority:4` `phase:api` `deps:实现 updateTodo() 函数` `time:8min`
  - files: index.js
  - [ ] 编写 completeTodo 函数
  - [ ] 编写 deleteTodo 函数
  - [ ] 测试两个函数
  - [ ] 提交代码

- [ ] **实现 listTodos() 函数** `priority:5` `phase:ui` `deps:实现 addTodo() 函数` `time:8min`
  - files: index.js
  - [ ] 编写格式化输出的 listTodos 函数
  - [ ] 测试不同状态的任务显示
  - [ ] 提交代码

- [ ] **实现 sortByPriority() 函数** `priority:6` `phase:ui` `deps:实现 listTodos() 函数` `time:12min`
  - files: index.js
  - [ ] 编写排序逻辑
  - [ ] 实现升序/降序参数
  - [ ] 测试排序结果
  - [ ] 提交代码

- [ ] **实现 filterByCategory() 函数** `priority:7` `phase:ui` `deps:实现 listTodos() 函数` `time:10min`
  - files: index.js
  - [ ] 编写分类筛选逻辑
  - [ ] 添加输入验证
  - [ ] 测试筛选结果
  - [ ] 提交代码

- [ ] **实现 showStats() 函数** `priority:8` `phase:ui` `deps:实现 filterByCategory() 函数` `time:15min`
  - files: index.js
  - [ ] 编写按分类统计逻辑
  - [ ] 编写按优先级统计逻辑
  - [ ] 添加总体统计
  - [ ] 测试统计结果
  - [ ] 提交代码

- [ ] **添加示例用法** `priority:9` `phase:docs` `deps:实现 showStats() 函数` `time:5min`
  - files: index.js
  - [ ] 添加完整的示例代码
  - [ ] 运行并验证所有功能
  - [ ] 提交代码

## 测试计划

### 手动测试

1. 添加不同优先级和分类的任务
2. 测试排序功能（升序/降序）
3. 测试分类筛选
4. 测试更新任务属性
5. 验证统计数据准确性

### 边界情况

- 空任务列表
- 无效的优先级/分类输入
- 更新不存在的任务
- 筛选不存在的分类

## 未来扩展

- 数据持久化（JSON 文件或数据库）
- 自定义分类
- 任务截止日期
- 子任务支持
- Web UI 界面
