

window.addEventListener('load', () => {
  // register modal component
  Vue.component('dialog-create-task', {
    template: "#dialog-create-template"
    // template: dialogCreateTemplate
    // template: dialogCreateTemplate['#dialog-create-template']
  });

  const app = new Vue({
    el: '#app',
    data,
    methods,
    async created() {
      const { tasks, subjects } = await getInitData();
      this.tasks = tasks;
      this.subjects = subjects;
    }
  });
});

const data = {
  tasks: [
    {
      id: 101, text: 'create back', state: 'todo',
      subject: { id: '', name: '' }
    },
    {
      id: 102, text: 'create mongodb', state: 'todo',
      subject: { id: '', name: '' }
    },
    {
      id: 103, text: 'get request to back for this list', state: 'todo',
      subject: { id: '', name: '' }
    },
  ],
  subjects: [
    { id: '', name: '<не указан>' }
  ],
  isOpenDialogCreate: false,
  activeTask: {
    text: '', subject: { id: '', name: '' }
  }
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

async function getInitData() {
  const initData = {
    tasks: [],
    subjects: []
  };
  const responseTasks = await fetch('http://localhost:3000/list');
  initData.tasks = await responseTasks.json();
  const responseSubjects = await fetch('http://localhost:3000/list-subjects');
  initData.subjects = await responseSubjects.json();
  return initData;
}

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