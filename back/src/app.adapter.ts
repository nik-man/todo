type Db = {
  tasks: Task[],
};

export type Task = {
  id: number,
  text: string,
  state: string,
};

export const db: Db = {
  tasks: [
    { id: 101, text: 'back:create back', state: 'todo' },
    { id: 102, text: 'back:create mongodb', state: 'todo' },
    { id: 103, text: 'back:get request to back for this list', state: 'done' },
    { id: 104, text: 'back:set restarting back when something edited', state: 'todo' },
  ],
};
