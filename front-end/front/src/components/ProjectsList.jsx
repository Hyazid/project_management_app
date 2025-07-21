import React, { useEffect, useState } from "react";
import axios from "axios";
import Register from "./Register";
import TeamList from "./TeamList";
import { useNavigate } from "react-router-dom";
import { Modal, Form, Alert, Spinner } from "react-bootstrap";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Button,
  ListGroup,
  Card,
} from "react-bootstrap";
import {
  FaPlus,
  FaProjectDiagram,
  FaTasks,
  FaBars,
  FaSignOutAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import "./ProjectsPage.css"; // for custom styles

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
  });
  //tasks
  const [showTaskModal, setShowTaskModal]= useState(false);
  const [taskProjectId, setTaskProjectId] = useState(null)
  const [newTask , setNewTask] = useState(
    {
      title:'',
      description:'',
      priority:'low',
      status:'todo',
      assignee: '', // --- Task Assignment ---
    }
  )
  const [taskFormErrors, setTaskFormErrors] = useState({})
  const [taskFormLoading, setTaskFormLoading]= useState(false)

  // --- Task Assignment: users list ---
  const [users, setUsers] = useState([]);

  // Fetch all users for assignment
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://127.0.0.1:8000/api/users/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch(e) {
        // Optionally handle error
      }
    };
    fetchUsers();
  }, []);

  // Handle form input changes
  const navigate = useNavigate();
  const goToUser = () => {
    navigate("/TeamList");
  };
  const goToStats = () => {
    navigate("/Stats");
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject({
      ...newProject,
      [name]: value,
    });

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};

    if (!newProject.name.trim()) {
      errors.name = 'Project name is required';
    }

    if (!newProject.description.trim()) {
      errors.description = 'Description is required';
    }

    if (newProject.start_date && newProject.end_date) {
      if (new Date(newProject.start_date) > new Date(newProject.end_date)) {
        errors.end_date = 'End date cannot be before start date';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSaveProject = async () => {
    if (!validateForm()) {
      return;
    }

    setFormLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post('http://127.0.0.1:8000/api/projects/', {
        name: newProject.name.trim(),
        description: newProject.description.trim(),
        start_date: newProject.start_date || null,
        end_date: newProject.end_date || null,

      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Add project to local state
      setProjects([...projects, response.data]);

      // Reset form and close modal
      setNewProject({
        name: '',
        description: '',
        start_date: '',
        end_date: ''
      });
      setShowModal(false);
      setFormErrors({});

    } catch (err) {
      console.error('Error saving project:', err);

      if (err.response?.data) {
        // Handle specific field errors from backend
        if (typeof err.response.data === 'object') {
          setFormErrors(err.response.data);
        } else {
          setError('Failed to save project. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setNewProject({
      name: '',
      description: '',
      start_date: '',
      end_date: ''
    });
    setFormErrors({});
    setError("");
  };

  // Delete project
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://127.0.0.1:8000/api/projects/${projectId}/`,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setProjects(projects.filter(proj => proj.id !== projectId));
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project. Please try again.');
    }
  };

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://127.0.0.1:8000/api/projects/",{
          headers:{
            Authorization: `Bearer ${token}`,
          }
        });
        setProjects(response.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className={`sidebar bg-dark text-white ${sidebarOpen ? "" : "collapsed"}`}>
        <div className="sidebar-header d-flex justify-content-between align-items-center p-3">
          <h4 className="m-0"><FaProjectDiagram /> Project Manager</h4>
          <Button variant="outline-light" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars />
          </Button>
        </div>
        <Nav className="flex-column p-3">
          <Nav.Link href="#" className="text-white">
            <FaProjectDiagram className="me-2" /> Projects
          </Nav.Link>
          <Nav.Link onClick = {goToStats} className="text-white">
            <FaTasks className="me-2" /> Stats
          </Nav.Link>
          <Nav.Link href="#" className="text-white">
            <FaSignOutAlt className="me-2" /> logout
          </Nav.Link>
        </Nav>
      </div>

      {/* Content */}
      <div className="flex-grow-1">
        <Navbar bg="light" expand="lg" className="shadow-sm">
          <Container fluid>
            <Navbar.Brand href="#">Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Brand  onClick={goToUser}>Users</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            
          </Container>
        </Navbar>

        <Container fluid className="mt-4">
          <Row>
            <Col>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Projects & Tasks</h1>
                <Button
                  variant="primary"
                  onClick={() => setShowModal(true)}
                  disabled={loading}
                >
                  <FaPlus className="me-2" /> Add Project
                </Button>
              </div>

              {/* Error display */}
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError("")}>
                  {error}
                </Alert>
              )}

              {/* Loading state */}
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <>
                  {/* Projects list */}
                  {projects.length === 0 ? (
                    <Card className="text-center py-5">
                      <Card.Body>
                        <FaProjectDiagram size={50} className="text-muted mb-3" />
                        <h4 className="text-muted">No projects yet</h4>
                        <p className="text-muted">Create your first project to get started</p>
                      </Card.Body>
                    </Card>
                  ) : (
                    projects.map((proj) => (
                      <Card key={proj.id} className="mb-3 shadow-sm">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <Card.Title>{proj.name}</Card.Title>
                              <Card.Text className="text-muted">{proj.description}</Card.Text>
                              {proj.start_date && (
                                <small className="text-muted">
                                  Start: {new Date(proj.start_date).toLocaleDateString()}
                                </small>
                              )}
                              {proj.end_date && (
                                <small className="text-muted ms-3">
                                  End: {new Date(proj.end_date).toLocaleDateString()}
                                </small>
                              )}
                            </div>
                            <div className="d-flex gap-2">
                              <Button size="sm"
                                variant="success"
                                onClick={()=>{
                                  setTaskProjectId(proj.id)
                                  setShowTaskModal(true)
                                }}
                              >
                                <FaPlus className="me-1" /> Add Task
                              </Button>
                              <Button size="sm" variant="outline-secondary">
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

                          {/* Tasks list */}
                          {proj.tasks && proj.tasks.length > 0 ? (
                            <ListGroup variant="flush">
                              {proj.tasks.map((task) => (
                                <ListGroup.Item
                                  key={task.id}
                                  className="d-flex justify-content-between align-items-center"
                                >
                                  <div>
                                    <span>{task.title}</span>
                                    {task.description && (
                                      <small className="text-muted d-block">{task.description}</small>
                                    )}
                                    {/* --- Task Assignment: show assignee --- */}
                                    {task.assignee && (
                                      <div>
                                        <small className="text-primary">Assigned to: {task.assignee.username}</small>
                                      </div>
                                    )}
                                  </div>
                                  <div className="d-flex gap-2 align-items-center">
                                    <span className={`badge bg-${getPriorityColor(task.priority)}`}>
                                      {task.priority}
                                    </span>
                                    <span className={`badge bg-${getStatusColor(task.status)}`}>
                                      {task.status}
                                    </span>
                                  </div>
                                </ListGroup.Item>
                              ))}
                            </ListGroup>
                          ) : (
                            <div className="text-center py-3 bg-light rounded">
                              <p className="text-muted mb-0">No tasks yet. Add your first task!</p>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    ))
                  )}
                </>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      {/* Add Project Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Project Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newProject.name}
                onChange={handleChange}
                isInvalid={!!formErrors.name}
                placeholder="Enter project name"
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newProject.description}
                onChange={handleChange}
                isInvalid={!!formErrors.description}
                placeholder="Enter project description"
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="start_date"
                    value={newProject.start_date}
                    onChange={handleChange}
                    isInvalid={!!formErrors.start_date}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.start_date}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="end_date"
                    value={newProject.end_date}
                    onChange={handleChange}
                    isInvalid={!!formErrors.end_date}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.end_date}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={formLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveProject} disabled={formLoading}>
            {formLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Saving...
              </>
            ) : (
              'Save Project'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- Task Assignment: Add Task Modal with Assignee Dropdown --- */}
      <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                isInvalid={!!taskFormErrors.title}
              />
              <Form.Control.Feedback type="invalid">
                {taskFormErrors.title}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                isInvalid={!!taskFormErrors.description}
              />
              <Form.Control.Feedback type="invalid">
                {taskFormErrors.description}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                name="priority"
                value={newTask.priority}
                onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={newTask.status}
                onChange={e => setNewTask({ ...newTask, status: e.target.value })}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </Form.Select>
            </Form.Group>
            {/* --- Task Assignment: Assignee dropdown --- */}
            <Form.Group className="mb-3">
              <Form.Label>Assign To</Form.Label>
              <Form.Select
                name="assignee"
                value={newTask.assignee}
                onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
              >
                <option value="">Unassigned</option>
                {users.map(user =>
                  <option key={user.id} value={user.id}>{user.username}</option>
                )}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowTaskModal(false)}
            disabled={taskFormLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              setTaskFormLoading(true);
              setTaskFormErrors({});
              // Validate
              if (!newTask.title.trim()) {
                setTaskFormErrors({ title: 'Title is required' });
                setTaskFormLoading(false);
                return;
              }
              // Submit to backend
              try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.post(
                  "http://127.0.0.1:8000/api/project/tasks/",
                  {
                    ...newTask,
                    project: taskProjectId,
                    assignee: newTask.assignee || null // --- Task Assignment ---
                  },
                  {
                    headers: { Authorization: `Bearer ${token}` }
                  }
                );
                setProjects(prevProjects =>
                  prevProjects.map(project =>
                    project.id === response.data.project
                      ? { ...project, tasks: [...(project.tasks || []), response.data] }
                      : project
                  )
                );
                setShowTaskModal(false);
                setNewTask({ title: '', description: '', priority: 'low', status: 'todo', assignee: '' });
                // Optionally re-fetch projects/tasks here!
              } catch (err) {
                if (err.response?.data) setTaskFormErrors(err.response.data);
              } finally {
                setTaskFormLoading(false);
              }
            }}
            disabled={taskFormLoading}
          >
            {taskFormLoading ? "Saving..." : "Save Task"}
          </Button>
        </Modal.Footer>
      </Modal>
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