let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskList = document.getElementById("taskList");
const taskForm = document.getElementById("taskForm");
const taskModal = document.getElementById("taskModal");
const openModalBtn = document.getElementById("openTaskModal");
const cancelTaskBtn = document.getElementById("cancelTask");
const darkModeToggle = document.getElementById("darkModeToggle");
const searchInput = document.getElementById("searchInput");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filter = "all", search = "") {
  taskList.innerHTML = "";
  const filtered = tasks.filter(task => {
    const matchFilter =
      filter === "all" || (filter === "active" && !task.completed) || (filter === "completed" && task.completed);
    const matchSearch = task.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <input type="checkbox" ${task.completed ? "checked" : ""} data-index="${index}" class="complete-task">
        <strong>${task.title}</strong> - ${task.priority}
        <br><small>${task.description || ""} ${task.dueDate ? " | Due: " + task.dueDate : ""}</small>
      </div>
      <button class="delete-task" data-index="${index}">❌</button>
    `;
    taskList.appendChild(li);
  });
  updateStats();
}

function updateStats() {
  document.getElementById("taskCount").textContent = `${tasks.length} Tasks`;
  document.getElementById("completedCount").textContent = `${tasks.filter(t => t.completed).length} Completed`;
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDescription").value;
  const dueDate = document.getElementById("taskDueDate").value;
  const priority = document.getElementById("taskPriority").value;
  tasks.push({ title, description, dueDate, priority, completed: false });
  saveTasks();
  renderTasks();
  taskForm.reset();
  taskModal.classList.add("hidden");
});

taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-task")) {
    tasks.splice(e.target.dataset.index, 1);
    saveTasks();
    renderTasks();
  }
  if (e.target.classList.contains("complete-task")) {
    tasks[e.target.dataset.index].completed = e.target.checked;
    saveTasks();
    renderTasks();
  }
});

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderTasks(btn.dataset.filter, searchInput.value);
  });
});

searchInput.addEventListener("input", () => {
  const currentFilter = document.querySelector(".filter-btn.active").dataset.filter;
  renderTasks(currentFilter, searchInput.value);
});

openModalBtn.addEventListener("click", () => taskModal.classList.remove("hidden"));
cancelTaskBtn.addEventListener("click", () => taskModal.classList.add("hidden"));

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
});

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

renderTasks();
