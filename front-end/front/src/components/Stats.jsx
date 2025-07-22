import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Table, Spinner, Alert, Row, Col } from "react-bootstrap";

function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://127.0.0.1:8000/api/task-stats/", {
          headers: { Authorization: `Bearer ${token}` },
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

  /* ---------- loading overlay ---------- */
  if (loading)
    return (
      <div className="overlay">
        <Spinner animation="border" variant="primary" />
      </div>
    );

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

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }

        .page-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          padding: 30px 40px;
          border-radius: 0 0 24px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          margin-bottom: 40px;
          animation: fadeIn 0.6s ease;
        }

        .page-header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }

        .btn-back {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
          border: none;
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-back:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .container {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 20px 60px;
        }

        .stat-card {
          transition: transform 0.2s, box-shadow 0.2s;
          border: none;
          border-radius: 14px;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }

        .stat-value {
          font-size: 36px;
          font-weight: 700;
          line-height: 1;
        }

        .table-container {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .table-hover tbody tr:hover {
          background-color: #f0f4ff;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Header */}
      <div className="page-header">
        <h1>📊 Task Statistics</h1>
        <button className="btn-back" onClick={() => (window.location.href = "/dashboard")}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="container">
        {/* Totals */}
        <Row className="mb-4">
          <Col md={6} className="mb-4 mb-md-0">
            <Card bg="info" text="white" className="stat-card">
              <Card.Body>
                <Card.Title>Total Tasks</Card.Title>
                <div className="stat-value">{stats?.totals?.all ?? 0}</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card bg="success" text="white" className="stat-card">
              <Card.Body>
                <Card.Title>Completed Tasks</Card.Title>
                <div className="stat-value">{stats?.totals?.completed ?? 0}</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <h4 className="mb-3">Tasks per User</h4>
        <div className="table-container">
          <Table striped hover responsive className="mb-0">
            <thead>
              <tr>
                <th>User</th>
                <th>Assigned</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {stats?.per_user?.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.assigned}</td>
                  <td>{user.completed}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Error */}
        {error && <Alert variant="danger">{error}</Alert>}
      </div>
    </>
  );
}

export default Stats;