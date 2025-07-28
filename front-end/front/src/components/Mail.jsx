import React, { useEffect, useState } from "react";
import axios from "axios";
import { ListGroup, Form, Button, Card } from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa";

const BASE_URL = "http://127.0.0.1:8000/api";

function Mail({ otherUserId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const token = localStorage.getItem("accessToken");
  const userId = Number(localStorage.getItem("userId"));

  // Load messages
  const load = () => {
    if (!token || !userId || !otherUserId) return;
    axios
      .get(`${BASE_URL}/messages/?receiver=${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setMessages(r.data))
      .catch((err) => console.error("Failed to load messages:", err));
  };

  // Send message
  const send = () => {
    if (!text.trim()) return;
    axios
      .post(
        `${BASE_URL}/messages/`,
        { receiver: otherUserId, body: text },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setText("");
        load();
      })
      .catch((err) => console.error("Failed to send message:", err));
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000); // Refresh every 5 seconds (optional)
    return () => clearInterval(interval);
  }, [otherUserId]);

  return (
    <Card className="shadow-sm">
      <Card.Body className="p-0">
        {/* Messages List */}
        <div className="messages-scroll" style={{ maxHeight: 400, overflowY: "auto" }}>
          <ListGroup variant="flush">
            {messages.map((m) => (
              <ListGroup.Item
                key={m.id}
                className={`d-flex flex-column ${
                  m.sender.id === userId ? "align-items-end bg-primary-subtle" : "align-items-start bg-light"
                }`}
                style={{ border: "none" }}
              >
                <span className="fw-semibold">{m.body}</span>
                <small className="text-muted mt-1">
                  {new Date(m.created_at).toLocaleTimeString()}
                </small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        {/* Message Input */}
        <div className="d-flex p-3 border-top">
          <Form.Control
            placeholder="Type a message…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <Button variant="primary" className="ms-2" onClick={send}>
            <FaPaperPlane />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Mail;
