import React, { useEffect, useState } from "react";
import axios from "axios";
import { ListGroup, Form, Button, Card, Spinner } from "react-bootstrap";
import { FaUser, FaPaperPlane } from "react-icons/fa";

const BASE_URL = "http://127.0.0.1:8000/api";

function MessageList({ otherUserId }) {
  /* ------------------------------------------------------------------ */
  /* 1.  Users sidebar                                                  */
  /* ------------------------------------------------------------------ */
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(otherUserId);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const token = localStorage.getItem("accessToken");
  const me = Number(localStorage.getItem("userId"));

  useEffect(() => {
    axios
      .get(`${BASE_URL}/users/`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setUsers(r.data.filter((u) => u.id !== me)))
      .finally(() => setLoadingUsers(false));
  }, [token, me]);

  /* ------------------------------------------------------------------ */
  /* 2.  Messages panel                                                 */
  /* ------------------------------------------------------------------ */
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  useEffect(() => {
    if (!activeUser) return;
    setLoadingMsgs(true);
    // fetch messages to OR from the active user
    axios
      .get(`${BASE_URL}/messages/?receiver=${activeUser}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setMessages(r.data))
      .finally(() => setLoadingMsgs(false));
  }, [activeUser, token]);

  const send = () => {
    if (!text.trim()) return;
    axios.post(
      `${BASE_URL}/messages/`,
      { receiver: Number(activeUser), body: text.trim() },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        setText("");
        // refetch fresh messages
        axios
          .get(`${BASE_URL}/messages/?receiver=${activeUser}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((r) => setMessages(r.data));
      }).catch(err=>{console.error('Error',err.response?.data)})
  };

  /* ------------------------------------------------------------------ */
  /* 3.  Layout                                                         */
  /* ------------------------------------------------------------------ */
  return (
    <div className="d-flex" style={{ height: "calc(100vh - 60px)" }}>
      {/* LEFT: user list */}
      <Card style={{ width: 260 }} className="border-0">
        <Card.Header className="bg-light">Users</Card.Header>
        {loadingUsers ? (
          <div className="p-3 text-center">
            <Spinner animation="border" size="sm" />
          </div>
        ) : (
          <ListGroup variant="flush" className="flex-grow-1 overflow-auto">
            {users.map((u) => (
              <ListGroup.Item
                key={u.id}
                action
                active={u.id === activeUser}
                onClick={() => setActiveUser(u.id)}
                className="d-flex align-items-center"
              >
                <FaUser className="me-2" />
                {u.username}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card>

      {/* RIGHT: chat area */}
      <Card className="flex-grow-1 ms-2">
        <Card.Header className="bg-light">
          {activeUser ? `Chat with ${users.find((u) => u.id === activeUser)?.username}` : "Select a user"}
        </Card.Header>

        {loadingMsgs ? (
          <div className="p-3 text-center">
            <Spinner animation="border" size="sm" />
          </div>
        ) : (
          <ListGroup
            variant="flush"
            className="flex-grow-1 overflow-auto"
            style={{ maxHeight: "calc(100vh - 200px)" }}
          >
            {messages.map((m) => (
              <ListGroup.Item
                key={m.id}
                className="border-0"
                style={{
                  background: m.sender.id === me ? "#e3f2fd" : "#f1f3f5",
                  textAlign: m.sender.id === me ? "right" : "left",
                }}
              >
                {m.body}
                <br />
                <small className="text-muted">{new Date(m.created_at).toLocaleTimeString()}</small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        {/* input bar */}
        <div className="p-2 border-top d-flex">
          <Form.Control
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <Button variant="primary" className="ms-2" onClick={send}>
            <FaPaperPlane />
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default MessageList;