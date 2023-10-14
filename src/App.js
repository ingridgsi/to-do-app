import { useState } from "react";

// const doItems = [
//   {
//     id: 98,
//     taskName: "Send email to sales department",
//     priority: "Urgent",
//     done: false,
//   },
//   {
//     id: 99,
//     taskName: "Pay the rent",
//     priority: "Important",
//     done: false,
//   },
//   {
//     id: 100,
//     taskName: "Update project budget",
//     priority: "Not urgent ",
//     done: false,
//   },
//   {
//     id: 101,
//     taskName: "Rewrite the meeting notes",
//     priority: "No important",
//     done: false,
//   },
// ];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [sortBy, setSortBy] = useState("All tasks");

  function handleAddNewTask(task) {
    setTasks((tasks) => [
      ...tasks,
      {
        id: Date.now(),
        taskName: task,
        done: false,

        isEditing: false,
      },
    ]);
    setSortBy("");
  }

  function handleDeleteTask(id) {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
  }

  function handleToggle(id) {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  function handleResetList() {
    const confirmDeleteAllTasks = window.confirm(
      "Are you sure you want to delete all tasks?"
    );

    if (confirmDeleteAllTasks) setTasks([]);
  }

  function handleEditTask(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              isEditing: !task.isEditing,
            }
          : task
      )
    );
  }

  function editTask(newTaskName, id) {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, taskName: newTaskName, isEditing: !task.isEditing }
          : task
      )
    );
  }

  return (
    <div>
      <Header />

      <Form handleAddNewTask={handleAddNewTask} />

      <ListContainer
        tasks={tasks}
        editTask={editTask}
        handleToggle={handleToggle}
        handleDeleteTask={handleDeleteTask}
        handleEditTask={handleEditTask}
        handleResetList={handleResetList}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <Stats tasks={tasks} />
    </div>
  );
}

function Header() {
  return (
    <>
      <header className="header">
        <h1> ✅ TO DO LIST</h1>
      </header>
      ;
    </>
  );
}

function Form({ handleAddNewTask }) {
  const [taskName, setTaskName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!taskName) return;

    handleAddNewTask(taskName);

    setTaskName("");
  }

  return (
    <div className="container">
      {/* <h2 className="secondary-heading"> 📝 Add your tasks</h2> */}
      <form className="form " onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="+ Add task"
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          ></input>
        </div>

        {/* <div>
          <label>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Urgent</option>
            <option>Important</option>
            <option>Not urgent</option>
            <option>Not important</option>
          </select>
        </div>
        <button>Add task</button>*/}
      </form>
    </div>
  );
}

function ListContainer({
  tasks,
  editTask,
  handleToggle,
  handleDeleteTask,
  handleEditTask,
  handleResetList,
  sortBy,
  setSortBy,
}) {
  let sortedTasks = tasks;

  if (sortBy === "All tasks") sortedTasks = tasks;

  if (sortBy === "Pending")
    sortedTasks = tasks.slice().filter((task) => !task.done);

  if (sortBy === "Complete")
    sortedTasks = tasks.slice().filter((task) => task.done);

  return (
    <>
      <div className="container">
        <div className="header-list-box ">
          <div>
            <h2 className="heading">📋 TASKS </h2>
          </div>
          <div className="header-list-options">
            {tasks.length > 0 ? (
              <>
                <div>
                  <button onClick={handleResetList}>DELETE ALL TASKS</button>
                </div>
                <div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {" "}
                    <option>All tasks</option>
                    <option>Pending</option>
                    <option>Complete</option>
                  </select>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="container-list">
          {sortedTasks.map((task, id) =>
            task.isEditing ? (
              <EditTodo task={task} key={id} editTask={editTask} />
            ) : (
              <TaskList
                task={task}
                tasks={tasks}
                key={id}
                handleToggle={handleToggle}
                handleDeleteTask={handleDeleteTask}
                handleEditTask={handleEditTask}
                handleResetList={handleResetList}
              />
            )
          )}
        </div>
      </div>
    </>
  );
}

function TaskList({ task, handleToggle, handleDeleteTask, handleEditTask }) {
  return (
    <>
      <div className="list-items">
        <ul>
          <div>
            <Task
              task={task}
              handleToggle={handleToggle}
              handleDeleteTask={handleDeleteTask}
              handleEditTask={handleEditTask}
            />
          </div>
        </ul>
      </div>
    </>
  );
}

function Task({ task, handleToggle, handleDeleteTask, handleEditTask }) {
  return (
    <div className="list">
      <div>
        <input
          key={task.id}
          className="check"
          type="checkbox"
          onChange={() => handleToggle(task.id)}
          checked={task.done}
        ></input>
      </div>
      <div>
        <li
          className="list-task"
          style={task.done ? { textDecoration: "line-through" } : {}}
        >
          {task.taskName}
        </li>
      </div>

      <div className="list-buttons">
        <div>
          <button onClick={() => handleDeleteTask(task.id)}>❌</button>
        </div>
        <div>
          <button onClick={() => handleEditTask(task.id)}>✏️</button>
        </div>
      </div>
    </div>
  );
}

function EditTodo({ editTask, task }) {
  const [newTaskName, setNewTaskName] = useState(task.taskName);

  function handleSubmit(e) {
    e.preventDefault();

    editTask(newTaskName, task.id);

    setNewTaskName("");
  }

  return (
    <div className="edit-list">
      <form onSubmit={handleSubmit}>
        <div>
          <input
            className="list"
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
          ></input>
        </div>

        <div className="edit-buttons list-buttons">
          <button type="submit">💾</button>
          <button>❌</button>
        </div>
      </form>
    </div>
  );
}

function Stats({ tasks }) {
  if (!tasks.length)
    return (
      <div className="container">
        <div className="header-stats">
          <h2 className="heading">📊 STATS</h2>
        </div>
        <div className="text-stats">
          <p>Start adding your tasks 📝</p>
        </div>
      </div>
    );

  const totalTasks = tasks.length;
  const totalTasksDone = tasks.filter((task) => task.done).length;
  const tasksPercent = Math.round((totalTasksDone / totalTasks) * 100);

  return (
    <>
      <div className="container">
        <div className="header-stats">
          <h2 className="heading">📊 STATS</h2>
        </div>

        <div className="text-stats">
          {tasksPercent === 100 ? (
            <p>You're done for today! Great job 🎉</p>
          ) : (
            <p>
              You have <strong>{`${totalTasks}`}</strong> tasks to do. You have
              done <strong>{`${totalTasksDone}`}</strong> so far.{" "}
              <strong>{`(${tasksPercent}%)`}</strong>
            </p>
          )}{" "}
        </div>
      </div>
    </>
  );
}
