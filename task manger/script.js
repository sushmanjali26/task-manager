const TASKS_STORAGE_KEY = "taskManagerTasks";
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

function loadTasks() {
  const tasksJson = localStorage.getItem(TASKS_STORAGE_KEY);
  return tasksJson ? JSON.parse(tasksJson) : [];
}

function saveTasks(tasks) {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  const tasks = loadTasks();
  taskList.innerHTML = "";
  if (tasks.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "list-group-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTaskCompleted(task.id));

    const span = document.createElement("span");
    span.textContent = task.text;
    span.className = "task-text";
    if (task.completed) span.classList.add("task-completed");
    span.addEventListener("click", () => editTask(task.id));

    const btnGroup = document.createElement("div");

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-sm btn-outline-secondary";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => editTask(task.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-outline-danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(btnGroup);

    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  if (text === "") {
    alert("Please enter a task.");
    return;
  }
  const tasks = loadTasks();
  tasks.push({ id: Date.now(), text, completed: false });
  saveTasks(tasks);
  taskInput.value = "";
  renderTasks();
}

function toggleTaskCompleted(id) {
  const tasks = loadTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index > -1) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    renderTasks();
  }
}

function deleteTask(id) {
  let tasks = loadTasks();
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks(tasks);
  renderTasks();
}

function editTask(id) {
  const tasks = loadTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return;

  const li = taskList.children[index];
  const span = li.querySelector(".task-text");
  const input = document.createElement("input");
  input.type = "text";
  input.className = "form-control";
  input.value = tasks[index].text;
  input.style.marginLeft = "12px";

  li.replaceChild(input, span);
  input.focus();

  function saveEdit() {
    const newText = input.value.trim();
    if (newText === "") {
      alert("Task cannot be empty.");
      input.focus();
      return;
    }
    tasks[index].text = newText;
    saveTasks(tasks);
    renderTasks();
  }

  input.addEventListener("blur", saveEdit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") renderTasks();
  });
}

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

renderTasks();
