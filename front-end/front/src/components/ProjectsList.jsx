import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal,Form } from "react-bootstrap";
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
} from "react-icons/fa";

import "./ProjectsPage.css"; // for custom styles

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false)
  const [newProject, setNewProject]= useState({
    name:'',
    description:'',
    start_date:'',
    end_date:'',
  })
  const handleChange =(e)=>{
    setNewProject({
      ...newProject,
      [e.target.name]:e.target.value,
    });
  }
  // handle the from
  const handleSaveProject = ()=>{
    axios.post('http://127.0.0.1:8000/api/projects/',{
      name: newProject.name,
      description: newProject.description,
      start_date: newProject.start_date || null,
      end_date: newProject.end_date || null,
      owner: 'yazid', 
    })
    .then((res)=>{
      //add it localy without a refresh
      console.log(res.data);
      setProjects([...projects, res.data]);
      setShowModal(false)
      setNewProject({
        name:'',
        description:'',
        start_date:'',
        end_date:''
      });
    }).catch((err)=>{
      console.error(err);
      console.error(err.response?.data);
      alert('failed to save project.')
    })
  }
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/projects/")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error(err));
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
          <Nav.Link href="#" className="text-white">
            <FaTasks className="me-2" /> Tasks
          </Nav.Link>
          <Nav.Link href="#" className="text-white">
            <FaSignOutAlt className="me-2" /> Logout
          </Nav.Link>
        </Nav>
      </div>

      {/* Content */}
      <div className="flex-grow-1">
        <Navbar bg="light" expand="lg" className="shadow-sm">
          <Container fluid>
            <Navbar.Brand href="#">Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
          </Container>
        </Navbar>

        <Container fluid className="mt-4">
          <Row>
            <Col>
              <h1 className="mb-4">Projects & Tasks</h1>
              <Button
                variant="primary"
                className="mb-3"
                onClick={() => setShowModal(true)}
              >
                <FaPlus className="me-2" /> Add Project
              </Button>

              {projects.map((proj) => (
                <Card key={proj.id} className="mb-3 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <Card.Title>{proj.name}</Card.Title>
                      <Button size="sm" variant="success">
                        <FaPlus className="me-1" /> Add Task
                      </Button>
                    </div>
                    <Card.Text className="text-muted">{proj.description}</Card.Text>

                    {proj.tasks && proj.tasks.length > 0 ? (
                      <ListGroup variant="flush">
                        {proj.tasks.map((task) => (
                          <ListGroup.Item
                            key={task.id}
                            className="d-flex justify-content-between align-items-center"
                          >
                            <span>{task.title}</span>
                            <span
                              className={`badge bg-${getStatusColor(task.status)}`}
                            >
                              {task.status}
                            </span>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <p className="text-muted">No tasks yet.</p>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </Col>
          </Row>
        </Container>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Add New Project</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Project Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={newProject.name}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={newProject.description}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Start Date</Form.Label>
        <Form.Control
          type="date"
          name="start_date"
          value={newProject.start_date}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>End Date</Form.Label>
        <Form.Control
          type="date"
          name="end_date"
          value={newProject.end_date}
          onChange={handleChange}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleSaveProject}>
      Save Project
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

export default ProjectsPage;
