import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Table, Spinner, Alert, Row, Col } from "react-bootstrap";

function Stats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
    useEffect(() => {
      const fetchStats = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("accessToken");
          const res = await axios.get("http://127.0.0.1:8000/api/task-stats/", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setStats(res.data);
        } catch (err) {
          setError("Failed to load stats.");
        } finally {
          setLoading(false);
        }
      };
      fetchStats();
    }, []);
  
    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;
  
    return (
      <div>
        <Row className="mb-4">
          <Col>
            <Card bg="info" text="white">
              <Card.Body>
                <Card.Title>Total Tasks</Card.Title>
                <Card.Text style={{ fontSize: 32 }}>{stats?.totals?.all ?? 0}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card bg="success" text="white">
              <Card.Body>
                <Card.Title>Completed Tasks</Card.Title>
                <Card.Text style={{ fontSize: 32 }}>{stats?.totals?.completed ?? 0}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <h4 className="mb-3">Tasks per User</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>User</th>
              <th>Assigned</th>
              <th>Completed</th>
             
            </tr>
          </thead>
          <tbody>
          {stats?.per_user?.map(user => (
                <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.assigned}</td>
                    <td>{user.completed}</td>
            
                </tr>
                ))}
          </tbody>
        </Table>
      </div>
    );
  }
export default Stats