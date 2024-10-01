import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Task from "./components/Task";
import Employee from "./components/Employee";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Task />} />
        <Route path="/employee" element={<Employee />} />

        {/* Default route to Task Creation */}
        {/* <Route path="/tasks/:id" element={<TaskDashboard />} />{" "} */}
        {/* Replace with dynamic userId */}
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
