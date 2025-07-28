import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Button,
  ListGroup,
  Card,
  Modal,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import {
  FaPlus,
  FaUser,
  FaProjectDiagram,
  FaTasks,
  FaTeamspeak,
  FaBars,
  FaMailBulk,
  FaSignOutAlt,
  FaChartBar,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import "./ProjectsPage.css"; // keep your CSS file, we add extra styles below

function ProjectsPage() {
  /* ---------------------------------- state --------------------------------- */
  const [projects, setProjects] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  // Task modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskProjectId, setTaskProjectId] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "low",
    status: "todo",
    assignee: "",
  });
  const [taskFormErrors, setTaskFormErrors] = useState({});
  const [taskFormLoading, setTaskFormLoading] = useState(false);
  const [users, setUsers] = useState([]);

  // Inline edit states
  const [editingProject, setEditingProject] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  /* -------------------------------- fetchers -------------------------------- */
  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get("http://127.0.0.1:8000/api/projects/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(data);
    } catch {
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get("http://127.0.0.1:8000/api/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
    } catch {
      // swallow
    }
  };

  /* ------------------------------ CRUD helpers ------------------------------ */
  const handleSaveProject = async () => {
    setFormLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const payload = { ...newProject };
      const url = editingProject
        ? `http://127.0.0.1:8000/api/projects/${editingProject.id}/`
        : "http://127.0.0.1:8000/api/projects/";
      const { data } = editingProject
        ? await axios.put(url, payload, { headers: { Authorization: `Bearer ${token}` } })
        : await axios.post(url, payload, { headers: { Authorization: `Bearer ${token}` } });

      editingProject
        ? setProjects((p) => p.map((x) => (x.id === data.id ? data : x)))
        : setProjects((p) => [...p, data]);

      handleCloseModal();
    } catch (err) {
      setError(err?.response?.data || "Failed to save project.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Delete project?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://127.0.0.1:8000/api/projects/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects((p) => p.filter((x) => x.id !== id));
    } catch {
      alert("Could not delete project.");
    }
  };

  const handleSaveTask = async () => {
    setTaskFormLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const payload = { ...newTask, project: taskProjectId };
      const url = editingTask
        ? `http://127.0.0.1:8000/api/project/tasks/${editingTask.id}/`
        : "http://127.0.0.1:8000/api/project/tasks/";
      const { data } = editingTask
        ? await axios.put(url, payload, { headers: { Authorization: `Bearer ${token}` } })
        : await axios.post(url, payload, { headers: { Authorization: `Bearer ${token}` } });

      // update local state
      setProjects((projs) =>
        projs.map((p) =>
          p.id === taskProjectId
            ? {
                ...p,
                tasks: editingTask
                  ? p.tasks.map((t) => (t.id === data.id ? data : t))
                  : [...(p.tasks || []), data],
              }
            : p
        )
      );
      handleCloseTaskModal();
    } catch (err) {
      setError(err?.response?.data || "Task save failed.");
    } finally {
      setTaskFormLoading(false);
    }
  };

  const handleDeleteTask = async (taskId, projectId) => {
    if (!window.confirm("Delete task?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://127.0.0.1:8000/api/project/tasks/${taskId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects((projs) =>
        projs.map((p) =>
          p.id === projectId ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId) } : p
        )
      );
    } catch {
      alert("Could not delete task.");
    }
  };

  /* ------------------------------ UI helpers ------------------------------ */
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setNewProject({ name: "", description: "", start_date: "", end_date: "" });
    setFormErrors({});
    setError("");
  };

  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
    setEditingTask(null);
    setNewTask({ title: "", description: "", priority: "low", status: "todo", assignee: "" });
    setTaskFormErrors({});
    setError("");
  };

  const openProjectModal = (proj = null) => {
    if (proj) {
      setEditingProject(proj);
      setNewProject(proj);
    }
    setShowModal(true);
  };

  const openTaskModal = (projId, task = null) => {
    setTaskProjectId(projId);
    if (task) {
      setEditingTask(task);
      setNewTask(task);
    }
    setShowTaskModal(true);
  };

  /* ----------------------------- sidebar nav ------------------------------ */
  const nav = (path) => () => navigate(path);

  /* -------------------------------- render -------------------------------- */
  return (
    <div className="d-flex">
      {/* glass sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
        <div className="sidebar-header">
          <h4 className="m-0">
            <FaProjectDiagram /> {sidebarOpen && "Project Manager"}
          </h4>
          <Button
            variant="outline-light"
            size="sm"
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </Button>
        </div>
        <Nav className="flex-column">
          <Nav.Link onClick={nav("/")} active>
            <FaProjectDiagram className="me-2" /> {sidebarOpen && "Projects"}
          </Nav.Link>
          <Nav.Link onClick={nav("/Mail")} active>
            <FaMailBulk className="me-2" /> {sidebarOpen && "Messages"}
          </Nav.Link>
          <Nav.Link onClick={nav("/MyTasks")}>
            <FaTasks className="me-2" /> {sidebarOpen && "My Tasks"}
          </Nav.Link>
          <Nav.Link onClick={nav("/TeamList")}>
            <FaTeamspeak className="me-2" /> {sidebarOpen && "Team"}
          </Nav.Link>
          <Nav.Link onClick={nav("/Stats")}>
            <FaChartBar className="me-2" /> {sidebarOpen && "Stats"}
          </Nav.Link>
          <Nav.Link onClick={nav("/profile")}>
            <FaUser className="me-2" /> {sidebarOpen && "Profile"}
          </Nav.Link>
          <Nav.Link onClick={() => localStorage.clear() & window.location.reload()}>
            <FaSignOutAlt className="me-2" /> {sidebarOpen && "Logout"}
          </Nav.Link>
        </Nav>
      </aside>

      {/* main content */}
      <main className="main-panel">
        <Navbar bg="light" className="shadow-sm">
          <Container fluid>
            <Navbar.Brand>Dashboard</Navbar.Brand>
          </Container>
        </Navbar>

        <Container fluid className="mt-4">
            {/* ====== DASHBOARD HEADER ====== */}
<Row className="mb-4">
  <Col>
    <Card className="bg-gradient-primary text-black p-4 rounded-4 shadow-sm">
      <h2 className="mb-1">Welcome back! 👋</h2>
      <p className="mb-0">
        Today is {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </p>
    </Card>
  </Col>
</Row>

{/* ====== MINI STATS ====== */}
<Row className="mb-4 g-3">
  {[
    { label: "Total Projects", value: projects.length, icon: <FaProjectDiagram /> },
    {
      label: "Open Tasks",
      value: projects.flatMap((p) => p.tasks || []).filter((t) => t.status !== "done").length,
      icon: <FaTasks />,
    },
    {
      label: "Completed Tasks",
      value: projects.flatMap((p) => p.tasks || []).filter((t) => t.status === "done").length,
      icon: <FaCheck />,
    },
  ].map((s) => (
    <Col md={4} key={s.label}>
      <Card className="shadow-sm border-0">
        <Card.Body className="d-flex align-items-center">
          <div className="me-3 text-primary fs-3">{s.icon}</div>
          <div>
            <div className="fw-bold fs-5">{s.value}</div>
            <small className="text-muted">{s.label}</small>
          </div>
        </Card.Body>
      </Card>
    </Col>
  ))}
</Row>

{/* ====== UPCOMING DEADLINES ====== */}
{(() => {
  const upcoming = projects
    .flatMap((p) => (p.tasks || []).map((t) => ({ ...t, projectName: p.name })))
    .filter((t) => t.end_date && new Date(t.end_date) >= new Date())
    .sort((a, b) => new Date(a.end_date) - new Date(b.end_date))
    .slice(0, 3);
  return upcoming.length ? (
    <Row className="mb-4">
      <Col>
        <Card>
          <Card.Header as="h5" className="bg-light">
            🔥 Upcoming Deadlines
          </Card.Header>
          <ListGroup variant="flush">
            {upcoming.map((t) => (
              <ListGroup.Item key={t.id} className="d-flex justify-content-between">
                <span>
                  <strong>{t.title}</strong> ({t.projectName})
                </span>
                <small>{new Date(t.end_date).toLocaleDateString()}</small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      </Col>
    </Row>
  ) : null;
})()}
          <Row>
            <Col>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Projects & Tasks</h1>
                <Button variant="primary" onClick={() => openProjectModal()}>
                  <FaPlus /> Add Project
                </Button>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                </div>
              ) : projects.length === 0 ? (
                <Card className="text-center py-5">
                  <FaProjectDiagram size={60} className="text-muted mb-3" />
                  <h4>No projects yet</h4>
                  <p>Create your first project to get started</p>
                </Card>
              ) : (
                projects.map((proj) => (
                  <Card key={proj.id} className="project-card mb-4">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <Card.Title className="fw-bold">{proj.name}</Card.Title>
                          <Card.Text className="text-muted">{proj.description}</Card.Text>
                          <small className="text-muted">
                            {proj.start_date && `Start: ${proj.start_date}`}{" "}
                            {proj.end_date && `| End: ${proj.end_date}`}
                          </small>
                        </div>
                        <div className="d-flex gap-2">
                          <Button size="sm" onClick={() => openTaskModal(proj.id)}>
                            <FaPlus /> Task
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => openProjectModal(proj)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDeleteProject(proj.id)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </div>

                      {proj.tasks?.length ? (
                        <ListGroup className="mt-3">
                          {proj.tasks.map((task) => (
                            <ListGroup.Item
                              key={task.id}
                              className="d-flex justify-content-between align-items-center"
                            >
                              <div>
                                <strong>{task.title}</strong>{" "}
                                {task.assignee && (
                                  <span className="text-primary">
                                    (@{task.assignee.username})
                                  </span>
                                )}
                                <br />
                                <span className="text-muted">{task.description}</span>
                              </div>
                              <div className="d-flex gap-2">
                                <span
                                  className={`badge bg-${getPriorityColor(
                                    task.priority
                                  )}`}
                                >
                                  {task.priority}
                                </span>
                                <span
                                  className={`badge bg-${getStatusColor(task.status)}`}
                                >
                                  {task.status}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline-secondary"
                                  onClick={() => openTaskModal(proj.id, task)}
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => handleDeleteTask(task.id, proj.id)}
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      ) : (
                        <small className="text-muted mt-3 d-block">
                          No tasks yet.
                        </small>
                      )}
                    </Card.Body>
                  </Card>
                ))
              )}
            </Col>
          </Row>



              

        </Container>
      </main>

      {/* Modals */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingProject ? "Edit Project" : "Add Project"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={newProject.start_date}
                onChange={(e) =>
                  setNewProject({ ...newProject, start_date: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={newProject.end_date}
                onChange={(e) =>
                  setNewProject({ ...newProject, end_date: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveProject} disabled={formLoading}>
            {formLoading ? <Spinner size="sm" animation="border" /> : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showTaskModal} onHide={handleCloseTaskModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingTask ? "Edit Task" : "Add Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Assignee</Form.Label>
              <Form.Select
                value={newTask.assignee}
                onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTaskModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveTask} disabled={taskFormLoading}>
            {taskFormLoading ? <Spinner size="sm" /> : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* inject glass styles */}
      <style>{`
        :root {
          --sidebar-width: 260px;
          --sidebar-collapsed: 70px;
        }
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
          background: #f5f7fa;
        }
        /* glass sidebar */
        .sidebar {
          width: var(--sidebar-width);
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-right: 1px solid rgba(255, 255, 255, 0.25);
          transition: width 0.3s;
          overflow: hidden;
          z-index: 1030;
        }
        .sidebar.collapsed {
          width: var(--sidebar-collapsed);
        }
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.25);
        }
        .sidebar .nav-link {
          color: black;
          font-weight: 500;
        }
        .main-panel {
          margin-left: var(--sidebar-width);
          min-height: 100vh;
          transition: margin-left 0.3s;
        }
        .collapsed ~ .main-panel {
          margin-left: var(--sidebar-collapsed);
        }
        .project-card {
          border: none;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
        }
        .toggle-btn {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 1.2rem;
        }
        @media (max-width: 768px) {
          .sidebar {
            width: 0;
          }
          .sidebar.collapsed {
            width: 0;
          }
          .main-panel {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case "todo":
      return "secondary";
    case "in-progress":
      return "warning";
    case "done":
      return "success";
    default:
      return "light";
  }
}

function getPriorityColor(priority) {
  switch (priority) {
    case "low":
      return "success";
    case "medium":
      return "warning";
    case "high":
      return "danger";
    default:
      return "secondary";
  }
}

export default ProjectsPage;