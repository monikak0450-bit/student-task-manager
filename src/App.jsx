
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("studentTasks")) || [];
    } catch {
      return [];
    }
  });

  const [taskTitle, setTaskTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("studentTasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(event) {
    event.preventDefault();
    if (!taskTitle.trim()) return;

    setTasks((old) => [
      ...old,
      {
        id: Date.now(),
        title: taskTitle.trim(),
        priority,
        deadline,
        completed: false,
      },
    ]);

    setTaskTitle("");
    setPriority("Medium");
    setDeadline("");
  }

  function toggleTask(id) {
    setTasks((old) =>
      old.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((old) => old.filter((task) => task.id !== id));
  }

  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const high = tasks.filter(
    (task) => task.priority === "High" && !task.completed
  ).length;

  const medium = tasks.filter(
    (task) => task.priority === "Medium" && !task.completed
  ).length;

  const low = tasks.filter(
    (task) => task.priority === "Low" && !task.completed
  ).length;

  const today = new Date().toLocaleDateString("en-CA");

  const upcoming = tasks
    .filter(
      (task) =>
        !task.completed &&
        task.deadline &&
        task.deadline >= today
    )
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 4);

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Pending" && !task.completed) ||
      (filter === "Completed" && task.completed);

    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="planner">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">♡</div>
          <div>
            <h2>Orchid.</h2>
            <span>YOUR STUDY BUDDY</span>
          </div>
        </div>

        <p className="side-label">WORKSPACE</p>
        <a className="nav-link active" href="#overview">✿ Overview</a>
        <a className="nav-link" href="#my-tasks">♡ My Tasks</a>
        <a className="nav-link" href="#progress">✧ My Progress</a>
        <a className="nav-link" href="#deadlines">☼ Deadlines</a>

        <div className="sidebar-note">
          <span>🌷</span>
          <h3>Little steps add up!</h3>
          <p>You don't have to do everything today. Just start somewhere.</p>
        </div>

        <div className="sidebar-footer">Made with ♡ for students</div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="date-label">{dateLabel}</p>
            <h1>Hello, Let's Study! <span>♡</span></h1>
            <p className="subtitle">Let's make today a little more productive.</p>
          </div>
          <div className="avatar">🌸</div>
        </header>

        <section className="hero-card" id="overview">
          <div>
            <span className="hero-tag">YOUR GENTLE REMINDER ✿</span>
            <h2>Dream big, start small.</h2>
            <p>Every little task you finish is progress worth celebrating.</p>
            <a className="hero-button" href="#my-tasks">View my tasks ↗</a>
          </div>
          <div className="hero-flower">🌷</div>
          <span className="hero-sparkle sparkle-one">✦</span>
          <span className="hero-sparkle sparkle-two">✿</span>
        </section>

        <section className="stats-grid">
          <article className="stat-card pink-card">
            <div className="stat-top"><span>Total tasks</span><span>♡</span></div>
            <strong>{tasks.length}</strong>
            <p>Your little to-do list</p>
          </article>

          <article className="stat-card yellow-card">
            <div className="stat-top"><span>To do</span><span>✎</span></div>
            <strong>{pending}</strong>
            <p>One step at a time</p>
          </article>

          <article className="stat-card green-card">
            <div className="stat-top"><span>Completed</span><span>✓</span></div>
            <strong>{completed}</strong>
            <p>Look at you go!</p>
          </article>

          <article className="stat-card purple-card">
            <div className="stat-top"><span>Progress</span><span>✧</span></div>
            <strong>{progress}%</strong>
            <p>You're making it happen</p>
          </article>
        </section>

        <div className="dashboard-grid">
          <section className="panel task-panel" id="my-tasks">
            <div className="panel-heading">
              <div>
                <span className="mini-label">LET'S GET THINGS DONE</span>
                <h2>My little task list <span>♡</span></h2>
              </div>
              <span className="heading-flower">✿</span>
            </div>

            <form onSubmit={addTask} className="task-form">
              <label>
                What do you need to do?
                <input
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Finish my DBMS assignment..."
                  required
                />
              </label>

              <div className="form-row">
                <label>
                  Priority
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </label>

                <label>
                  Due date
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </label>
              </div>

              <button className="add-button" type="submit">
                + Add a little task
              </button>
            </form>

            <div className="list-toolbar">
              <h3>Your tasks <span>({filteredTasks.length})</span></h3>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filter tasks"
              >
                <option>All</option>
                <option>Pending</option>
                <option>Completed</option>
              </select>
            </div>

            <input
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="⌕  Search your tasks..."
              aria-label="Search tasks"
            />

            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <span>🧸</span>
                <h3>Nothing here just yet!</h3>
                <p>Add a task and your study journey begins.</p>
              </div>
            ) : (
              <ul className="task-list">
                {filteredTasks.map((task) => (
                  <li className="task-item" key={task.id}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      aria-label={`Complete ${task.title}`}
                    />

                    <div className="task-details">
                      <span className={task.completed ? "task-done" : ""}>
                        {task.title}
                      </span>
                      <small>
                        {task.deadline || "No due date"} · {task.priority} priority
                      </small>
                    </div>

                    <span className={`priority priority-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>

                    <button
                      className="delete-button"
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      aria-label={`Delete ${task.title}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="right-column">
            <section className="panel progress-panel" id="progress">
              <div className="panel-heading">
                <div>
                  <span className="mini-label">YOU'RE DOING GREAT</span>
                  <h2>My progress ✧</h2>
                </div>
                <span className="panel-emoji">🌼</span>
              </div>

              <div className="progress-circle" style={{ "--progress": `${progress}%` }}>
                <div className="circle-inner">
                  <strong>{progress}%</strong>
                  <span>complete</span>
                </div>
              </div>

              <p className="progress-caption">
                {tasks.length === 0
                  ? "Your journey starts with one task."
                  : completed === tasks.length
                    ? "Everything is done. Time to celebrate! ♡"
                    : "Keep going, you're doing lovely!"}
              </p>

              <div className="progress-bar">
                <div style={{ width: `${progress}%` }} />
              </div>
              <div className="progress-legend">
                <span>Completed</span><strong>{completed} of {tasks.length}</strong>
              </div>
            </section>

            <section className="panel priority-panel">
              <div className="panel-heading">
                <div>
                  <span className="mini-label">A LITTLE PLAN</span>
                  <h2>Priority petals</h2>
                </div>
                <span className="panel-emoji">🌸</span>
              </div>

              <div className="priority-row">
                <span className="priority-dot dot-high" />
                <span>High priority</span>
                <strong>{high}</strong>
              </div>
              <div className="priority-track"><div className="track-high" style={{ width: `${pending ? high / pending * 100 : 0}%` }} /></div>

              <div className="priority-row">
                <span className="priority-dot dot-medium" />
                <span>Medium priority</span>
                <strong>{medium}</strong>
              </div>
              <div className="priority-track"><div className="track-medium" style={{ width: `${pending ? medium / pending * 100 : 0}%` }} /></div>

              <div className="priority-row">
                <span className="priority-dot dot-low" />
                <span>Low priority</span>
                <strong>{low}</strong>
              </div>
              <div className="priority-track"><div className="track-low" style={{ width: `${pending ? low / pending * 100 : 0}%` }} /></div>
            </section>

            <section className="panel deadlines-panel" id="deadlines">
              <div className="panel-heading">
                <div>
                  <span className="mini-label">DON'T FORGET</span>
                  <h2>Coming up ♡</h2>
                </div>
                <span className="panel-emoji">🗓️</span>
              </div>

              {upcoming.length === 0 ? (
                <p className="no-deadlines">No upcoming deadlines. Enjoy the breathing room! 🌷</p>
              ) : (
                upcoming.map((task) => (
                  <div className="deadline-item" key={task.id}>
                    <div className="deadline-date">
                      <strong>{new Date(`${task.deadline}T12:00:00`).getDate()}</strong>
                      <span>
                        {new Date(`${task.deadline}T12:00:00`).toLocaleDateString("en-US", { month: "short" })}
                      </span>
                    </div>
                    <div className="deadline-details">
                      <strong>{task.title}</strong>
                      <span>{task.priority} priority</span>
                    </div>
                  </div>
                ))
              )}
            </section>
          </div>
        </div>

        <footer className="page-footer">
          <span>made with ♡ and a little bit of magic</span>
          <span>Orchid. study planner ✿</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
