let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  const filtered = tasks.filter(task =>
    filter === "all" ? true : task.category === filter
  );

  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.innerHTML = `
      <span>${task.text} <small>(${task.category})</small></span>
      <div>
        <button onclick="toggleComplete(${index})">✅</button>
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="deleteTask(${index})">🗑️</button>
      </div>
    `;
    taskList.appendChild(li);
  });

  updateProgress();
}

function addTask() {
  const input = document.getElementById("taskInput");
  const category = document.getElementById("category").value;
  const text = input.value.trim();
  if (!text) return;

  tasks.push({ text, completed: false, category });
  input.value = "";
  saveTasks();
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function editTask(index) {
  const newText = prompt("Update your task:", tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText.trim() || tasks[index].text;
    saveTasks();
    renderTasks();
  }
}

function filterTasks(cat) {
  filter = cat;
  renderTasks();
}

function updateProgress() {
  const completed = tasks.filter(t => t.completed).length;
  document.getElementById("progressBar").textContent =
    `${completed} of ${tasks.length} completed`;
}

window.onload = () => renderTasks();
