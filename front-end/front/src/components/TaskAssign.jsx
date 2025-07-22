import React, { useEffect, useState } from "react";
import axios from "axios";

function TaskAssign() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  /* which task dropdown is open */
  const [openMenu, setOpenMenu] = useState(null);

  /* ---------- fetch ---------- */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    async function fetchData() {
      try {
        const [projRes, taskRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/my-projects/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/api/my-tasks/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setProjects(projRes.data);
        setTasks(taskRes.data);
      } catch {
        alert("❌ Could not load data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  /* ---------- update status ---------- */
  const handleStatusChange = async (taskId, newStatus) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/tasks/${taskId}/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      setOpenMenu(null);
    } catch {
      alert("❌ Failed to update status");
    }
  };

  /* ---------- loader ---------- */
  if (loading)
    return (
      <div className="loader">
        <span>⏳ Loading your dashboard…</span>
      </div>
    );

  return (
    <>
      <style>{`
        body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:#f5f7fa;color:#333}
        .container{max-width:900px;margin:40px auto;padding:0 20px}
        .section{margin-bottom:40px}
        .section h2{margin:0 0 20px;font-size:26px;font-weight:700;color:#1e3a8a;display:flex;align-items:center;gap:8px}
        .section h2 svg{width:28px;height:28px;fill:currentColor}
        .card{background:#fff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,.08);overflow:hidden}
        .card ul{margin:0;padding:0;list-style:none}
        .card li{padding:20px;border-bottom:1px solid #e5e7eb;position:relative}
        .card li:last-child{border-bottom:none}
        .card li:hover{background:#f3f6ff}
        .project-name{font-size:18px;font-weight:600;margin-bottom:4px}
        .project-date{font-size:14px;color:#6b7280}
        .task-header{font-size:13px;color:#6b7280;margin-bottom:4px}
        .task-title{font-size:17px;font-weight:600;margin-bottom:4px}
        .task-desc{font-size:14px;color:#4b5563;margin-bottom:6px}
        .task-status{display:inline-block;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:600;background:#e0f2fe;color:#0369a1}
        .empty{padding:30px 20px;text-align:center;color:#9ca3af;font-style:italic}
        .loader{display:flex;align-items:center;justify-content:center;height:100vh;font-size:18px;color:#4b5563}

        /* buttons */
        .btn-row{display:flex;gap:10px;margin-bottom:30px}
        .btn{
          padding:10px 18px;
          border:none;
          border-radius:6px;
          font-size:14px;
          cursor:pointer;
          transition:background .2s;
        }
        .btn.primary{background:#1e3a8a;color:#fff}
        .btn.primary:hover{background:#1e40af}
        .btn.secondary{background:#e5e7eb;color:#111827}
        .btn.secondary:hover{background:#d1d5db}

        /* tiny dropdown */
        .dropdown{position:absolute;top:18px;right:18px}
        .dropdown-toggle{font-size:13px;padding:4px 8px;border:1px solid #d1d5db;border-radius:4px;background:#fff;cursor:pointer}
        .dropdown-menu{position:absolute;right:0;top:110%;background:#fff;border:1px solid #d1d5db;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.1);z-index:9}
        .dropdown-item{padding:6px 12px;font-size:13px;cursor:pointer}
        .dropdown-item:hover{background:#f3f4f6}

        @media(max-width:600px){
          .container{margin:20px auto}
          .section h2{font-size:22px}
        }
      `}</style>

      {/* ---------- top buttons ---------- */}
      <div className="container">
        <div className="btn-row">
          <button className="btn primary" onClick={() => window.location.href = "/dashboard"}>
            ← Back to Dashboard
          </button>
        </div>

        {/* PROJECTS */}
        <div className="section">
          <h2>
            <svg viewBox="0 0 24 24"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm16 0H5v10h14V7zM7 9h2v2H7V9zm0 4h2v2H7v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z"/></svg>
            My Projects
          </h2>
          <div className="card">
            {projects.length === 0 ? (
              <div className="empty">You have no assigned projects.</div>
            ) : (
              <ul>
                {projects.map((p) => (
                  <li key={p.id}>
                    <div className="project-name">{p.name}</div>
                    <div className="project-date">Start: {p.start_date}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* TASKS */}
        <div className="section">
          <h2 style={{ color: "#15803d" }}>
            <svg viewBox="0 0 24 24"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zm4 0h4a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h4zM7 6h10v2H7V6zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/></svg>
            My Tasks
          </h2>
          <div className="card">
            {tasks.length === 0 ? (
              <div className="empty">You have no assigned tasks.</div>
            ) : (
              <ul>
                {tasks.map((t) => (
                  <li key={t.id}>
                    <div className="task-header">Project: {t.project_name || t.project}</div>
                    <div className="task-title">{t.title}</div>
                    <div className="task-desc">{t.description}</div>
                    <span className="task-status">{t.status}</span>

                    {/* update-status dropdown */}
                    <div className="dropdown">
                      <button
                        className="dropdown-toggle"
                        onClick={() => setOpenMenu(openMenu === t.id ? null : t.id)}
                      >
                        Update
                      </button>
                      {openMenu === t.id && (
                        <div className="dropdown-menu">
                          {["To-Do", "In-Progress", "Done"].map((s) => (
                            <div
                              key={s}
                              className="dropdown-item"
                              onClick={() => handleStatusChange(t.id, s)}
                            >
                              {s}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskAssign;