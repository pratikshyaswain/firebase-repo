import React, { useState } from "react";
import { getDatabase, ref, set, push } from "firebase/database";
import { app } from "../firebase";

const Employee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    skills: "",
    availability: "",
    workload: "",
  });

  const handleInputChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getDatabase(app);
    const employeesRef = ref(db, "employees/");

    const skillsArray = employee.skills.split(",").map((skill) => skill.trim());

    try {
      const newEmployeeRef = await push(employeesRef, {
        name: employee.name,
        skills: skillsArray,
        availability: employee.availability,
        workload: employee.workload,
      });

      const employeeId = newEmployeeRef.key;
      await set(newEmployeeRef, {
        ...employee,
        id: employeeId,
        skills: skillsArray,
      });

      alert("Employee added successfully!");
      setEmployee({ name: "", skills: "", availability: "", workload: "" });
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="center">
      <div>
        <label>Employee Name</label>
        <input
          type="text"
          name="name"
          value={employee.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Skills (with comma)</label>
        <input
          type="text"
          name="skills"
          value={employee.skills}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Availability</label>
        <select
          name="availability"
          value={employee.availability}
          onChange={handleInputChange}
          required
        >
          <option value=""> Availability</option>
          <option value="full-time">Full-Time</option>
          <option value="part-time">Part-Time</option>
        </select>
      </div>
      <div>
        <label>Workload</label>
        <select
          name="workload"
          value={employee.workload}
          onChange={handleInputChange}
          required
        >
          <option value=""> Workload</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <button type="submit">Add Employee</button>
    </form>
  );
};

export default Employee;
