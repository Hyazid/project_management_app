import { useEffect,useState } from "react";
import axios from 'axios'
function App() {
  const [tasks, setTasks] = useState([])
  useEffect(()=>{
    axios.get("http://127.0.0.1:8000/api/project/tasks/")
    .then(res=>setTasks(res.data))
    .catch(err => console.error(err));
  },[])
  return (
    <div className="App" style={{padding:'2rem'}}>
      <h1> Tasks</h1>
      <ul>
        {tasks.map(t=>(
          <li key={t.id}>
            {t.title} — {t.status}
          </li> 
        ))}
      </ul>
     
    </div>
  );
}

export default App;
