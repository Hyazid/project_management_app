import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FaUser, FaProjectDiagram, FaTasks, FaCheck, FaArrowLeft, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// clean base URL — change if you deploy elsewhere
const BASE_URL = "http://127.0.0.1:8000/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ projects: 0, tasks: 0, completed: 0 });
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /* fetch profile & stats */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return navigate("/login");

    const fetchData = async () => {
      try {
        const [me, projRes, taskRes] = await Promise.all([
          axios.get(`${BASE_URL}/auth/me/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/my-projects/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/my-tasks/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUser(me.data);
        setForm(me.data);
        setStats({
          projects: projRes.data.length,
          tasks: taskRes.data.length,
          completed: taskRes.data.filter((t) => t.status === "done").length,
        });
      } catch (err) {
        console.error(err);
        setError("Could not load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  /* save profile */
  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");
    setSaving(true);
    try {
      const { data } = await axios.put(
        `${BASE_URL}/users/${user?.id}/`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(data);
      setEditMode(false);
    } catch (e) {
      console.error(e);
      setError("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  /* log-out */
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  /* loading state */
  if (loading)
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" />
        <span className="ms-2">Loading…</span>
      </Container>
    );

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
          background: #f5f7fa;
        }
        .cover {
          height: 220px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 0 0 24px 24px;
          position: relative;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 4px solid #fff;
          background: #fff;
          position: absolute;
          bottom: -60px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          color: #667eea;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
        }
        .stat-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s;
        }
        .stat-card:hover {
          transform: translateY(-4px);
        }
        .action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
        }
      `}</style>

      {/* Top bar */}
      <Container className="action-bar mt-2">
        <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-1" /> Back
        </Button>
        <Button variant="outline-danger" size="sm" onClick={handleLogout}>
          <FaSignOutAlt className="me-1" /> Log-out
        </Button>
      </Container>

      {/* Cover + Avatar */}
      <div className="cover">
        <div className="avatar">
          <FaUser />
        </div>
      </div>

      <Container className="mt-5">
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Stats row */}
        <Row className="mb-4 g-3">
          {[
            { label: "Projects", value: stats.projects, icon: <FaProjectDiagram /> },
            { label: "Tasks", value: stats.tasks, icon: <FaTasks /> },
            { label: "Completed", value: stats.completed, icon: <FaCheck /> },
          ].map((s) => (
            <Col md={4} key={s.label}>
              <Card className="stat-card p-3 text-center">
                <div className="fs-2 text-primary">{s.icon}</div>
                <div className="fw-bold fs-4">{s.value}</div>
                <small className="text-muted">{s.label}</small>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Profile Card */}
        <Card>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="m-0">Personal Information</h5>
              {!editMode && (
                <Button size="sm" onClick={() => setEditMode(true)}>
                  Edit
                </Button>
              )}
            </div>

            {editMode ? (
              <>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          value={form.username || ""}
                          onChange={(e) => setForm({ ...form, username: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          value={form.email || ""}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          value={form.first_name || ""}
                          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          value={form.last_name || ""}
                          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
                <div className="d-flex gap-2 mt-3">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? <Spinner size="sm" /> : "Save"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setForm(user);
                      setEditMode(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <div>
                <p><strong>Username:</strong> {user?.username}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p>
                  <strong>Name:</strong>{" "}
                  {user?.first_name || user?.last_name
                    ? `${user?.first_name} ${user?.last_name}`
                    : "Not set"}
                </p>
                <p><strong>Last login:</strong> {new Date().toLocaleString()}</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default Profile;