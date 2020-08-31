
window.addEventListener('load', () => {
  // register modal component
  Vue.component("modal", {
    template: "#dialog-create-template"
  });

  const app = new Vue({
    el: '#app',
    data,
    methods,
    created() {
      fetch('http://localhost:3000/list')
        .then(response => response.json())
        .then(json => {
          this.tasks = json;
        })
    }
  });
});

const data = {
  tasks: [
    { id: 101, text: 'create back', state: 'todo' },
    { id: 102, text: 'create mongodb', state: 'todo' },
    { id: 103, text: 'get request to back for this list', state: 'todo' },
  ],
  isOpenDialogCreate: false,
};

const methods = {
  create: async function () {
    const text = prompt(`Create new task:`);
    if (!text) { return; }
    const newTask = await postTask(text);
    this.tasks.push(newTask);
  },
  edit: (task) => {
    const text = prompt(`Edition task:`, task.text);
    if (!text || text === task.text) { return; }
    task.text = text;
    putTaskText(task);
  },
  deleteTask: function (task, index) {
    if (!confirm(`Are you sure to delete the task? \n ${task.text}
    state: ${task.state}`)) { return; }
    this.tasks.splice(index, 1);
    httpDeleteTask(task);
  },
  done: (task) => {
    task.state = 'done';
    putTaskState(task);
  },
  undone: (task) => {
    task.state = 'todo';
    putTaskState(task);
  },
  openDialogCreate: function () {
    // alert('open dialog create here');
    this.isOpenDialogCreate = true;
  },
  closeDialogCreate: function () {
    // alert('close dialog create here');
    this.isOpenDialogCreate = false;
  }
};

function putTaskState(task) {
  fetch(
    `http://localhost:3000/task/${task.id}?state=${task.state}`,
    {
      method: 'PUT',
    });
}

function putTaskText(task) {
  fetch(
    `http://localhost:3000/task/${task.id}?text=${task.text}`,
    {
      method: 'PUT',
    });
}

function httpDeleteTask(task) {
  fetch(
    `http://localhost:3000/task/${task.id}`,
    {
      method: 'DELETE',
    });
}

async function postTask(text) {
  const response = await fetch(`http://localhost:3000/task`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }) // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}