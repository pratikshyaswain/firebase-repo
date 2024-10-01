import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="nav">
      <Link to="/">Task Creation</Link>
      <Link to="/tasks">Your Tasks</Link>
      <Link to="/admin">Admin Dashboard</Link>
      <Link to="/employee">Add Employee</Link>
    </nav>
  );
};

export default Navbar;
