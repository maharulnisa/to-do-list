// Remove this: const { json } = require("express");

document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('inputT');
  const addTaskBtn = document.getElementById('add-task-Btn');
  const taskList = document.querySelector('.task-list');
  const todosContainer = document.querySelector('.todos-container');
  const emptyImage = document.querySelector('.empty-image');
  const progressBar = document.getElementById('progress');
  const progressNumber = document.getElementById('numbers');

  // Show empty state or tasks
  const toggleEmptyState = () => {
    emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
    todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
  };

  // Update progress bar & count
  const updateProgress = (checkCompletion = true) => {
    const total = taskList.children.length;
    const completed = taskList.querySelectorAll('.checkbox:checked').length;
    progressBar.style.width = total ? `${(completed / total) * 100}%` : '0%';
    progressNumber.textContent = `${completed} / ${total}`;
    if (checkCompletion && total > 0 && completed === total) {
      runConfetti();  // updated name
    }
  };

  // Save to localStorage
  const saveTaskToLocalStorage = () => {
    const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
      text: li.querySelector('span').textContent,
      completed: li.querySelector('.checkbox').checked
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  // Load on startup
  const loadTasksFromLocalStorage = () => {
    const saved = JSON.parse(localStorage.getItem('tasks')) || [];
    saved.forEach(({ text, completed }) => addTask(text, completed, false));
    toggleEmptyState();
    updateProgress();
  };

  // Add a new task
  const addTask = (text = '', completed = false, checkCompletion = true) => {
    const taskText = text || taskInput.value.trim();
    if (!taskText) return;

    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}>
      <span>${taskText}</span>
      <div class="task-buttons">
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    const checkbox = li.querySelector('.checkbox');
    const editBtn = li.querySelector('.edit-btn');
    const deleteBtn = li.querySelector('.delete-btn');

    if (completed) {
      li.classList.add('completed');
      editBtn.disabled = true;
      editBtn.style.opacity = '0.5';
      editBtn.style.pointerEvents = 'none';
    }

    checkbox.addEventListener('change', () => {
      const isChecked = checkbox.checked;
      li.classList.toggle('completed', isChecked);
      editBtn.disabled = isChecked;
      editBtn.style.opacity = isChecked ? '0.5' : '1';
      editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
      updateProgress();
      saveTaskToLocalStorage();
    });

    editBtn.addEventListener('click', () => {
      if (!checkbox.checked) {
        taskInput.value = li.querySelector('span').textContent;
        li.remove();
        toggleEmptyState();
        updateProgress(false);
        saveTaskToLocalStorage();
      }
    });

    deleteBtn.addEventListener('click', () => {
      li.remove();
      toggleEmptyState();
      updateProgress();
      saveTaskToLocalStorage();
    });

    taskList.appendChild(li);
    taskInput.value = '';
    toggleEmptyState();
    updateProgress(checkCompletion);
    saveTaskToLocalStorage();
  };

  // Prevent form submission
  addTaskBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addTask();
  });

  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTask();
    }
  });

  loadTasksFromLocalStorage();
});

// Rename this to avoid conflict
const runConfetti = () => {
  const duration = 15 * 1000;
  const end = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = end - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const particleCount = 50 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
  }, 250);
};
