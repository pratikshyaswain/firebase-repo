import { getDatabase, ref, push, get } from "firebase/database";
import { app } from "../firebase";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";

const apiKey = "AIzaSyAp9wGqtuXd_TY01Semg-wdnQZDkem0IwQ";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Fetch employees
async function fetchEmployees() {
  const db = getDatabase(app);
  const employeesRef = ref(db, "employees/");

  try {
    const snapshot = await get(employeesRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.error("No employees found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching employees:", error);
    return null;
  }
}

// Function to assign a task using Gemini API and employee data
async function assignTask(task) {
  try {
    const employees = await fetchEmployees();
    if (!employees) {
      console.error("No employees available for task assignment.");
      alert("No employees available for task assignment.");

      return null;
    }

    const prompt = `Task description: ${task.description}, 
                      Required skills: ${task.skills}, 
                      Deadline: ${task.deadline}. 
                      Available employees: ${JSON.stringify(employees)}.
                      Suggest the best team member for this task.`;

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    // Send task prompt to the Gemini API
    const result = await chatSession.sendMessage(prompt);
    const responseText = await result.response.text();
    console.log("Gemini API Response:", responseText);

    // Extract assigned member info from Gemini's response
    const assignedTo = parseAssignment(responseText);
    if (!assignedTo) {
      console.error("Failed to parse assignment from response:", responseText);
      return null;
    }

    return assignedTo;
  } catch (error) {
    console.error("Error assigning task with Gemini AI:", error);
    return null;
  }
}

function parseAssignment(responseText) {
  const match = responseText.match(/\*\*(.+?)\s*\(id?:?\s*([^)]+)\)\*\*/i);

  if (match) {
    console.log("Parsed Assignment:", match[1], match[2]);
    return {
      name: match[1].trim(),
      id: match[2].trim(),
    };
  }

  console.error("Failed to parse assignment.");
  //   alert("Failed to assign task. Please check the response for details.");

  return {
    name: "Unknown",
    id: "Unknown",
    rawResponse: responseText,
  };
}

// Task creation and submission
const Task = () => {
  const [task, setTask] = useState({
    description: "",
    skills: "",
    deadline: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Assign the task using Google Generative AI (Gemini) first
      const assignedTo = await assignTask({ ...task });

      if (assignedTo && assignedTo.name !== "Unknown") {
        const db = getDatabase(app);
        const tasksRef = ref(db, "tasks/");

        const newTaskRef = await push(tasksRef, {
          ...task,
          status: "assigned",
          assignedTo: assignedTo.name,
          assignedToId: assignedTo.id,
        });

        const taskId = newTaskRef.key;

        // Create a separate collection for assigned tasks
        const assignedTasksRef = ref(db, "assignedTasks/");
        await push(assignedTasksRef, {
          taskId: taskId,
          assignedTo: assignedTo.name,
          assignedToId: assignedTo.id,
          status: "assigned",
          description: task.description,
          skills: task.skills,
          deadline: task.deadline,
        });

        alert("Task created and assigned successfully.");
      } else {
        alert("Task assignment failed. Task was not created.");
      }
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("An error occurred while assigning the task.");
    } finally {
      setLoading(false);
      setTask({ description: "", skills: "", deadline: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="center">
      <div>
        <label>Task Description</label>
        <input
          type="text"
          name="description"
          value={task.description}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Skills Required</label>
        <input
          type="text"
          name="skills"
          value={task.skills}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Deadline</label>
        <input
          type="date"
          name="deadline"
          value={task.deadline}
          onChange={handleInputChange}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Assigning Task..." : "Create and Assign Task"}
      </button>
    </form>
  );
};

export default Task;
