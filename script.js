document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const completedTasksList = document.getElementById("completedTasksList");
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const themeIcon = document.getElementById("themeIcon");

    // Load tasks and theme from localStorage
    loadTasks();
    loadTheme();

    // Add event listener for adding a task
    addTaskBtn.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            saveTaskToLocalStorage(taskText, false); // Save new active task
            taskInput.value = ""; // Clear the input field
        }
    });

    // Add task by pressing the "Enter" key
    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            addTaskBtn.click();
        }
    });

    // Toggle theme
    themeToggleBtn.addEventListener("click", toggleTheme);

    function addTask(taskText) {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            <span class="task-text">${taskText}</span>
            <button class="btn btn-sm btn-success ml-2 complete-btn">Complete</button>
            <button class="btn btn-sm btn-danger ml-2 delete-btn">Delete</button>
        `;

        taskList.appendChild(li);

        const completeBtn = li.querySelector(".complete-btn");
        const deleteBtn = li.querySelector(".delete-btn");

        completeBtn.addEventListener("click", () => {
            markTaskAsComplete(taskText, li);
        });

        deleteBtn.addEventListener("click", () => {
            taskList.removeChild(li);
            removeTaskFromLocalStorage(taskText, false);
        });
    }

    function markTaskAsComplete(taskText, li) {
        removeTaskFromLocalStorage(taskText, false);
        saveTaskToLocalStorage(taskText, true);

        li.querySelector(".complete-btn").remove();
        li.querySelector(".task-text").classList.add("completed");
        taskList.removeChild(li);
        completedTasksList.appendChild(li);

        const deleteBtn = li.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", () => {
            completedTasksList.removeChild(li);
            removeTaskFromLocalStorage(taskText, true);
        });
    }

    function loadTasks() {
        const activeTasks = JSON.parse(localStorage.getItem("activeTasks")) || [];
        activeTasks.forEach(task => addTask(task));

        const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
        completedTasks.forEach(task => {
            const li = document.createElement("li");
            li.className = "list-group-item completed d-flex justify-content-between align-items-center";
            li.innerHTML = `
                <span class="task-text completed">${task}</span>
                <button class="btn btn-sm btn-danger ml-2 delete-btn">Delete</button>
            `;

            completedTasksList.appendChild(li);

            const deleteBtn = li.querySelector(".delete-btn");
            deleteBtn.addEventListener("click", () => {
                completedTasksList.removeChild(li);
                removeTaskFromLocalStorage(task, true);
            });
        });
    }

    function saveTaskToLocalStorage(taskText, isCompleted) {
        const storageKey = isCompleted ? "completedTasks" : "activeTasks";
        const tasks = JSON.parse(localStorage.getItem(storageKey)) || [];
        tasks.push(taskText);
        localStorage.setItem(storageKey, JSON.stringify(tasks));
    }

    function removeTaskFromLocalStorage(taskText, isCompleted) {
        const storageKey = isCompleted ? "completedTasks" : "activeTasks";
        let tasks = JSON.parse(localStorage.getItem(storageKey)) || [];
        tasks = tasks.filter(task => task !== taskText);
        localStorage.setItem(storageKey, JSON.stringify(tasks));
    }

    function toggleTheme() {
        document.body.classList.toggle("dark-theme");

        const isDarkTheme = document.body.classList.contains("dark-theme");
        localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
        
        // Change the icon and button text
        themeIcon.textContent = isDarkTheme ? "🌜" : "🌞";
        themeToggleBtn.textContent = isDarkTheme ? "Light Theme" : "Dark Theme"; // Update button text
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.body.classList.add("dark-theme");
            themeIcon.textContent = "🌜";
            themeToggleBtn.textContent = "Light Theme"; // Initial button text
        } else {
            themeIcon.textContent = "🌞";
            themeToggleBtn.textContent = "Dark Theme"; // Initial button text
        }
    }
});
