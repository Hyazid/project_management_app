import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Card, ListGroup, Spinner } from "react-bootstrap";

function TeamList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios
      .get("http://127.0.0.1:8000/api/users/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        // Optionally handle error
      });
  }, []);

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h4">Team Members</Card.Header>
        <ListGroup variant="flush">
          {loading ? (
            <ListGroup.Item>
              <Spinner animation="border" size="sm" /> Loading users...
            </ListGroup.Item>
          ) : (
            users.map((user) => (
              <ListGroup.Item key={user.id}>
                <strong>{user.username}</strong>
                {user.first_name || user.last_name
                  ? ` (${user.first_name} ${user.last_name})`
                  : ""}
                <br />
                <small>{user.email}</small>
              </ListGroup.Item>
            ))
          )}
          {!loading && users.length === 0 && (
            <ListGroup.Item>No users found.</ListGroup.Item>
          )}
        </ListGroup>
      </Card>
    </Container>
  );
}

export default TeamList;