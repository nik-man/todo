
window.addEventListener('load', () => {
  const app = new Vue({
    el: '#app',
    data,
    methods,
    created() {
      fetch('http://localhost:3000/list',
        { mode: 'cors' })
        .then(response => {
          console.log(response);
          return response.json(); })
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
  ]
};

const methods = {
  create: function () {
    const text = prompt(`Create new task:`);
    if (text) { this.tasks.push({ id: 100 + this.tasks.length, text, state: 'todo' }); }
  },
  edit: (task) => {
    const text = prompt(`Edition task:`, task.text);
    if (text) { task.text = text; }
  },
  deleteTask: function (task, index) {
    if (!confirm(`Are you sure to delete the task? \n ${task.text}`)) { return; }
    this.tasks.splice(index, 1);
  },
  done: (task) => {
    task.state = 'done';
  },
  undone: (task) => {
    task.state = 'todo';
  }
};
