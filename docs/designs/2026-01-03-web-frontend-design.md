# Todo App Web 前端设计

**日期**: 2026-01-03
**状态**: Approved
**作者**: Claude Code

## 概述

为 Todo 应用添加现代化的 Web 前端界面，使用纯 HTML/CSS/JavaScript，支持所有 CLI 功能并增加丰富的交互体验。

## 需求

### 功能需求
- 所有 CLI 功能：添加、编辑、删除、完成、排序、筛选、统计
- 增强交互：拖拽排序、内联编辑、键盘快捷键、深色模式

### 技术约束
- 纯前端：HTML/CSS/JavaScript（无框架）
- 数据持久化：localStorage
- 无需后端服务器，打开 HTML 即可使用

### 设计风格
- 现代简约风格
- 清爽卡片设计
- 柔和配色
- 类似 Todoist

## 架构设计

### 文件结构

```
todo-app-demo/
├── public/
│   ├── index.html          # 主HTML文件
│   ├── app.js              # 所有JavaScript逻辑
│   └── styles.css          # 所有样式
├── index.js                # 现有CLI版本（保留）
└── package.json
```

### 架构层次

**1. 数据层（Data Layer）**
- 复用 CLI 版本的常量和数据结构
- StorageService 负责 localStorage 读写
- 数据格式完全一致

**2. 业务逻辑层（Service Layer）**
- 复用现有函数：addTodo(), updateTodo(), completeTodo(), deleteTodo()
- 新增排序和筛选辅助函数
- 新增统计计算函数

**3. UI 层（View Layer）**
- renderTodos() - 渲染任务列表
- renderStats() - 渲染统计面板
- updateUI() - 统一更新界面

**4. 交互层（Interaction Layer）**
- 表单处理
- 拖拽排序
- 键盘快捷键
- 深色模式切换

### 数据流

```
用户操作 → 事件处理器 → 业务逻辑 → 更新 todos
→ 保存 localStorage → 重新渲染 UI
```

### 状态管理

```javascript
const state = {
  currentFilter: 'all',      // 当前筛选器
  currentSort: 'default',    // 当前排序方式
  darkMode: false,           // 深色模式
  editingId: null            // 正在编辑的任务ID
};
```

## UI 设计

### 界面布局

**Header（顶部）**
- 应用标题
- 深色模式切换按钮
- 统计摘要

**Controls（控制区）**
- 添加任务表单
- 筛选器按钮组
- 排序按钮组

**Task List（任务列表）**
- 卡片式任务项
- 拖拽手柄
- 优先级标签
- 分类标签
- 操作按钮

**Stats Panel（统计面板）**
- 按分类统计
- 按优先级统计
- 可折叠

### 颜色方案

**浅色模式**
```css
--bg-primary: #f5f7fa;
--bg-secondary: #ffffff;
--text-primary: #2c3e50;
--text-secondary: #7f8c8d;
--accent: #4a90e2;
--priority-high: #ff6b6b;
--priority-medium: #ffa500;
--priority-low: #51cf66;
```

**深色模式**
```css
--bg-primary: #1a1a2e;
--bg-secondary: #16213e;
--text-primary: #eee;
--text-secondary: #aaa;
--accent: #0f3460;
```

### 组件设计

**任务卡片（Todo Card）**
```
┌─────────────────────────────────────┐
│ ⋮⋮ ☐ [HIGH] Buy groceries (shopping)│
│                           ✏️ 🗑️      │
└─────────────────────────────────────┘
```

组成：
- 拖拽手柄（⋮⋮）
- 复选框（完成状态）
- 优先级标签（彩色）
- 任务文本（可编辑）
- 分类标签
- 编辑/删除按钮

## 功能实现

### 1. 数据持久化

```javascript
const StorageService = {
  save() {
    localStorage.setItem('todos', JSON.stringify(todos));
  },
  load() {
    const data = localStorage.getItem('todos');
    return data ? JSON.parse(data) : [];
  },
  saveSettings() {
    localStorage.setItem('settings', JSON.stringify(state));
  },
  loadSettings() {
    const data = localStorage.getItem('settings');
    return data ? JSON.parse(data) : {};
  }
};
```

### 2. 拖拽排序

使用原生 Drag and Drop API：

```javascript
// dragstart - 开始拖拽
element.addEventListener('dragstart', (e) => {
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', element.innerHTML);
  draggedElement = element;
});

// dragover - 拖拽经过
element.addEventListener('dragover', (e) => {
  e.preventDefault();
  // 显示放置指示器
});

// drop - 放置
element.addEventListener('drop', (e) => {
  e.preventDefault();
  // 重新排列 todos 数组
  // 保存并重新渲染
});
```

### 3. 内联编辑

```javascript
// 双击进入编辑模式
todoText.addEventListener('dblclick', () => {
  state.editingId = todo.id;
  const input = document.createElement('input');
  input.value = todo.task;
  todoText.replaceWith(input);
  input.focus();

  // Enter 保存
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      updateTodo(todo.id, { task: input.value });
      state.editingId = null;
      updateUI();
    }
    if (e.key === 'Escape') {
      state.editingId = null;
      updateUI();
    }
  });
});
```

### 4. 键盘快捷键

```javascript
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + D - 切换深色模式
  if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
    e.preventDefault();
    toggleDarkMode();
  }

  // Escape - 清空输入/取消编辑
  if (e.key === 'Escape') {
    if (state.editingId) {
      state.editingId = null;
      updateUI();
    } else {
      document.getElementById('taskInput').value = '';
    }
  }
});
```

### 5. 深色模式

```javascript
function toggleDarkMode() {
  state.darkMode = !state.darkMode;
  document.body.classList.toggle('dark-mode', state.darkMode);
  StorageService.saveSettings();
  updateDarkModeIcon();
}

// 页面加载时恢复设置
window.addEventListener('DOMContentLoaded', () => {
  const settings = StorageService.loadSettings();
  if (settings.darkMode) {
    state.darkMode = true;
    document.body.classList.add('dark-mode');
  }
});
```

### 6. 筛选和排序

```javascript
function getFilteredTodos() {
  let filtered = [...todos];

  // 按分类筛选
  if (state.currentFilter !== 'all') {
    filtered = filtered.filter(t => t.category === state.currentFilter);
  }

  // 排序
  if (state.currentSort === 'priority-desc') {
    filtered.sort((a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]);
  } else if (state.currentSort === 'priority-asc') {
    filtered.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  }

  return filtered;
}
```

## Implementation Tasks

- [ ] **创建 HTML 结构** `priority:1` `phase:ui` `time:15min`
  - files: public/index.html
  - [ ] 创建基本 HTML 模板和 meta 标签
  - [ ] 添加 header 区域（标题、深色模式按钮）
  - [ ] 添加控制区域（表单、筛选器、排序按钮）
  - [ ] 添加任务列表容器
  - [ ] 添加统计面板容器
  - [ ] 引入 CSS 和 JS 文件

- [ ] **实现基础 CSS 样式** `priority:2` `phase:ui` `deps:创建 HTML 结构` `time:20min`
  - files: public/styles.css
  - [ ] 定义 CSS 变量（浅色/深色主题）
  - [ ] 实现基础布局（Flexbox/Grid）
  - [ ] 设计任务卡片样式
  - [ ] 实现响应式设计
  - [ ] 添加过渡动画

- [ ] **实现深色模式样式** `priority:3` `phase:ui` `deps:实现基础 CSS 样式` `time:10min`
  - files: public/styles.css
  - [ ] 定义深色模式 CSS 变量
  - [ ] 添加 .dark-mode 类样式
  - [ ] 实现平滑主题切换过渡
  - [ ] 测试颜色对比度

- [ ] **初始化 JavaScript 和数据层** `priority:4` `phase:model` `deps:创建 HTML 结构` `time:15min`
  - files: public/app.js
  - [ ] 复制常量定义（PRIORITIES, CATEGORIES, PRIORITY_ORDER）
  - [ ] 初始化 todos 数组和 state 对象
  - [ ] 实现 StorageService（save/load/saveSettings/loadSettings）
  - [ ] 页面加载时从 localStorage 恢复数据
  - [ ] 测试数据持久化

- [ ] **实现核心业务逻辑函数** `priority:5` `phase:api` `deps:初始化 JavaScript 和数据层` `time:20min`
  - files: public/app.js
  - [ ] 实现 addTodo() 函数（带验证和保存）
  - [ ] 实现 updateTodo() 函数
  - [ ] 实现 completeTodo() 函数
  - [ ] 实现 deleteTodo() 函数
  - [ ] 实现 getFilteredTodos() 辅助函数
  - [ ] 实现 calculateStats() 统计函数
  - [ ] 测试所有业务逻辑

- [ ] **实现 UI 渲染函数** `priority:6` `phase:ui` `deps:实现核心业务逻辑函数` `time:25min`
  - files: public/app.js
  - [ ] 实现 renderTodos() 渲染任务列表
  - [ ] 实现 renderStats() 渲染统计面板
  - [ ] 实现 updateUI() 统一更新函数
  - [ ] 为任务卡片添加事件监听器（完成、编辑、删除）
  - [ ] 测试渲染逻辑

- [ ] **实现表单处理** `priority:7` `phase:ui` `deps:实现 UI 渲染函数` `time:15min`
  - files: public/app.js
  - [ ] 监听表单提交事件
  - [ ] 获取输入值（任务、优先级、分类）
  - [ ] 调用 addTodo() 并更新 UI
  - [ ] 清空表单
  - [ ] Enter 键提交支持
  - [ ] 测试添加任务

- [ ] **实现筛选和排序功能** `priority:8` `phase:ui` `deps:实现 UI 渲染函数` `time:15min`
  - files: public/app.js
  - [ ] 为筛选按钮添加事件监听器
  - [ ] 更新 state.currentFilter 并重新渲染
  - [ ] 为排序按钮添加事件监听器
  - [ ] 更新 state.currentSort 并重新渲染
  - [ ] 高亮当前选中的筛选/排序按钮
  - [ ] 测试筛选和排序

- [ ] **实现内联编辑功能** `priority:9` `phase:ui` `deps:实现 UI 渲染函数` `time:20min`
  - files: public/app.js
  - [ ] 为任务文本添加双击事件监听
  - [ ] 创建输入框替换文本
  - [ ] 监听 Enter 键保存
  - [ ] 监听 Escape 键取消
  - [ ] 点击外部取消编辑
  - [ ] 测试内联编辑

- [ ] **实现拖拽排序功能** `priority:10` `phase:ui` `deps:实现 UI 渲染函数` `time:25min`
  - files: public/app.js
  - [ ] 为任务卡片添加 draggable 属性
  - [ ] 实现 dragstart 事件处理
  - [ ] 实现 dragover 事件处理（视觉反馈）
  - [ ] 实现 drop 事件处理（重新排列数组）
  - [ ] 保存新顺序到 localStorage
  - [ ] 测试拖拽排序

- [ ] **实现深色模式切换** `priority:11` `phase:ui` `deps:实现深色模式样式` `time:10min`
  - files: public/app.js
  - [ ] 实现 toggleDarkMode() 函数
  - [ ] 为切换按钮添加事件监听器
  - [ ] 保存深色模式设置到 localStorage
  - [ ] 页面加载时恢复深色模式设置
  - [ ] 更新按钮图标（月亮/太阳）
  - [ ] 测试深色模式切换

- [ ] **实现键盘快捷键** `priority:12` `phase:ui` `deps:实现深色模式切换` `time:10min`
  - files: public/app.js
  - [ ] 监听全局 keydown 事件
  - [ ] 实现 Ctrl/Cmd + D 切换深色模式
  - [ ] 实现 Escape 清空输入/取消编辑
  - [ ] 实现 Enter 在输入框中添加任务
  - [ ] 测试所有快捷键

- [ ] **优化和细节完善** `priority:13` `phase:ui` `deps:实现键盘快捷键` `time:15min`
  - files: public/app.js, public/styles.css
  - [ ] 添加加载动画
  - [ ] 添加空状态提示（无任务时）
  - [ ] 优化移动端响应式布局
  - [ ] 添加过渡动画和微交互
  - [ ] 测试所有浏览器兼容性

- [ ] **测试和文档** `priority:14` `phase:test` `deps:优化和细节完善` `time:20min`
  - files: public/index.html, README.md
  - [ ] 完整功能测试（所有操作）
  - [ ] 测试数据持久化
  - [ ] 截图浅色和深色模式
  - [ ] 更新 README 添加 Web 版本说明和截图
  - [ ] 提交代码到 GitHub

## 测试计划

### 功能测试
1. 添加任务（各种优先级和分类）
2. 编辑任务（内联编辑）
3. 完成/取消完成任务
4. 删除任务
5. 筛选功能（所有分类）
6. 排序功能（默认、高→低、低→高）
7. 拖拽排序
8. 统计数据准确性
9. 深色模式切换
10. 键盘快捷键

### 数据持久化测试
1. 添加任务后刷新页面
2. 切换深色模式后刷新页面
3. localStorage 数据格式验证

### 浏览器兼容性
- Chrome/Edge（最新版）
- Firefox（最新版）
- Safari（最新版）

### 响应式测试
- 桌面（1920x1080）
- 平板（768x1024）
- 手机（375x667）

## 技术细节

### 性能优化
- 事件委托减少监听器数量
- 防抖处理 localStorage 写入
- CSS 动画使用 transform（GPU 加速）

### 可访问性
- 语义化 HTML
- ARIA 标签
- 键盘导航支持
- 足够的颜色对比度

### 浏览器支持
- ES6+ 特性（现代浏览器）
- localStorage API
- Drag and Drop API
- CSS Grid/Flexbox

## 未来扩展

- PWA 支持（离线使用）
- 数据导出/导入
- 任务截止日期
- 子任务支持
- 多设备同步（后端 API）
