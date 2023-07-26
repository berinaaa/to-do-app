// initial references
const newTaskInput = document.querySelector("#newTask input");
const tasksDiv = document.querySelector("#tasks");
let deleteTasks, editTasks, tasks;
let updateNote = ""; // variable to keep track of the task being edited
let count; // variable to store the number of tasks

// function on window load to save in local storage
window.onload = () => {
  updateNote = ""; // clear the updateNote variable on page load
  count = Object.keys(localStorage).length; // get the number of tasks stored in local storage
  displayTasks(); // display the tasks stored in local storage
  console.log(localStorage); // log the stored tasks in localStorage
};

// function to display the tasks
const displayTasks = () => {
  // check if there are tasks in local storage
  if (Object.keys(localStorage).length > 0) {
    tasksDiv.style.display = "inline-block"; // display the tasks container
  } else {
    tasksDiv.style.display = "none"; // hide the tasks container if no tasks are present
  }

  // clear the tasks container
  tasksDiv.innerHTML = "";

  // fetch all the keys in local storage and sort them
  let tasks = Object.keys(localStorage);
  tasks = tasks.sort();

  // loop through each task and create corresponding DOM elements
  for (let key of tasks) {
    let classValue = "";

    // get the value of the task (true or false, completed or not)
    let value = localStorage.getItem(key);
    let completed = JSON.parse(value);

    // create a new div to represent the task
    let taskInnerDiv = document.createElement("div");
    taskInnerDiv.classList.add("task");
    taskInnerDiv.setAttribute("id", key);
    taskInnerDiv.innerHTML = `<span id="taskname">${key.split("_")[1]}</span>`;

    // add "completed" button
    let completedButton = document.createElement("button");
    completedButton.classList.add("completed");
    completedButton.innerHTML = `<i class="fa-solid fa-bookmark"></i>`;
    taskInnerDiv.appendChild(completedButton); //adds a new child node to an existing parent node in the DOM

    // create an "edit" button
    let editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;

    // check if the task is not completed to make the edit button visible, otherwise hide it
    if (!completed) {
      editButton.style.visibility = "visible";
    } else {
      editButton.style.visibility = "hidden";
      taskInnerDiv.classList.add("completed"); // if task is completed, add a "completed" class
    }

    taskInnerDiv.appendChild(editButton);

    // add a "delete" button
    taskInnerDiv.innerHTML += `<button class="delete"><i class="fa-solid fa-trash"></i></button>`;

    // append the task div to the tasks container
    tasksDiv.appendChild(taskInnerDiv);
  }

  // handle the click event for "completed" buttons
  let completedButtons = document.querySelectorAll(".completed");
  completedButtons.forEach((element) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation(); // stop the click event from propagating to outer elements

      let taskDiv = element.parentElement; // get the parent element (task div)
      let key = taskDiv.id; 
      let value = localStorage.getItem(key);
      let completed = JSON.parse(value); 

      // toggle the completion status
      updateStorage(key.split("_")[0], key.split("_")[1], !completed);
    });
  });

  // handle the click event for "edit" buttons
  editTasks = document.getElementsByClassName("edit");
  Array.from(editTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation(); 
      disableButtons(true);
      let parent = element.parentElement; // get the parent element (task div)
      newTaskInput.value = parent.querySelector("#taskname").innerText; // update the input value with the task name
      updateNote = parent.id; // set updateNote to the task that is being edited
      parent.remove(); // remove the task div
    });
  });

  // handle the click event for "delete" buttons
  deleteTasks = document.getElementsByClassName("delete");
  Array.from(deleteTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation(); 
      let parent = element.parentElement; // get the parent element (task div)
      removeTask(parent.id); // delete the task from local storage
      parent.remove();
      count -= 1; // decrease the count of tasks
    });
  });
};

// disable edit button
const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool; // disable or enable edit buttons based on the 'bool' parameter
  });
};

// remove task from local storage
const removeTask = (taskValue) => {
  localStorage.removeItem(taskValue); // remove the task with the specified key from local storage
  displayTasks(); // refresh the displayed tasks
};

// add tasks to local storage
const updateStorage = (index, taskValue, completed) => {
  localStorage.setItem(`${index}_${taskValue}`, completed); // store the task with its completion status in local storage
  displayTasks(); // refresh the displayed tasks
};

// function to add new task
document.querySelector("#add").addEventListener("click", () => {
  disableButtons(false);  // enable the edit button

  if (newTaskInput.value.length == 0) {
    alert("Please enter a task");
  } else {
    // store the task locally and display it from local storage
    if (updateNote == "") {
      // new task
      updateStorage(count, newTaskInput.value, false);
    } else {
      // update task
      let existingCount = updateNote.split("_")[0];
      removeTask(updateNote);
      updateStorage(existingCount, newTaskInput.value, false);
      updateNote = "";
    }
    count += 1; // increase the count of tasks
    newTaskInput.value = ""; // clear the input field
  }
}); 