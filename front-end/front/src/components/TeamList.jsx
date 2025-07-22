import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Card,
  ListGroup,
  Spinner,
  Row,
  Col,
  Alert,
  Button,
  Modal,
  Form,
} from "react-bootstrap";

function TeamList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* --- modals --- */
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form, setForm] = useState({ username: "", first_name: "", last_name: "", email: "" });

  /* ---------- fetch ---------- */
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const { data } = await axios.get("http://127.0.0.1:8000/api/users/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(data);
      } catch {
        setError("Failed to load team members.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  /* ---------- helpers ---------- */
  const openEdit = (user) => {
    setCurrentUser(user);
    setForm({
      username: user.username,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email,
    });
    setShowEdit(true);
  };

  const handleEditSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const { data } = await axios.put(
        `http://127.0.0.1:8000/api/users/${currentUser.id}/`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === data.id ? data : u))
      );
      setShowEdit(false);
    } catch {
      alert("❌ Could not update user.");
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${currentUser.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u.id !== currentUser.id));
      setShowDelete(false);
    } catch {
      alert("❌ Could not delete user.");
    }
  };

  /* ---------- render ---------- */
  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
          background: #f5f7fa;
        }
        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .page-title {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          color: #1e3a8a;
        }
        .back-btn {
          background: #1e3a8a;
          color: #fff;
          border: none;
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .back-btn:hover {
          background: #1e40af;
        }
        .user-card {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border: none;
          border-radius: 14px;
          overflow: hidden;
        }
        .user-card .card-header {
          font-weight: 600;
          background: #667eea;
          color: #fff;
        }
        .action-btn {
          font-size: 12px;
          margin-left: 6px;
        }
        .list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .list-text {
          flex: 1;
        }
      `}</style>

      <Container className="py-5">
        <Row>
          <Col>
            <div className="header-row">
              <h1 className="page-title">👥 Team Members</h1>
              <button
                className="back-btn"
                onClick={() => (window.location.href = "/dashboard")}
              >
                ← Back to Dashboard
              </button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Card className="user-card">
              <Card.Header>Team</Card.Header>

              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" size="sm" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-4 text-muted">No users found.</div>
              ) : (
                <ListGroup variant="flush">
                  {users.map((user) => (
                    <ListGroup.Item key={user.id}>
                      <div className="list-item">
                        <div className="list-text">
                          <div className="fw-semibold">{user.username}</div>
                          <div className="text-muted">
                            {user.first_name || user.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : "No name provided"}
                          </div>
                          <small className="text-secondary">{user.email}</small>
                        </div>
                        <div>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            className="action-btn"
                            onClick={() => openEdit(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            className="action-btn"
                            onClick={() => {
                              setCurrentUser(user);
                              setShowDelete(true);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card>
          </Col>
        </Row>
      </Container>

      {/* ---------- Edit Modal ---------- */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>First name</Form.Label>
              <Form.Control
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---------- Delete Modal ---------- */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{currentUser?.username}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TeamList;