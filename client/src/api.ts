// src/api.ts
const API_BASE = import.meta.env.VITE_API_URL;
// const API_BASE = import.meta.env.VITE_API_URL.replace(/\/$/, '');

// --------------------
// Add a new task
// --------------------
export const createTask = async (title: string, column: number, row: number) => {
  const response = await fetch(`${API_BASE}/api/ScrumBoard`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, column, row }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Create task API error:", errorText);
    throw new Error(`Failed to create task: ${response.status} ${response.statusText}`);
  }

  return await response.json(); // returns the created task with MongoDB _id as string
};

// --------------------
// Get a task by ID
// --------------------
export const getTask = async (id: string) => {
  const response = await fetch(`${API_BASE}/api/ScrumBoard/${id}`);
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Get task API error:", errorText);
    throw new Error(`Failed to fetch task: ${response.status} ${response.statusText}`);
  }
  return await response.json();
};

// --------------------
// Update a task
// --------------------
export const updateTask = async (task: {
  id: string;
  title: string;
  column: number;
  row: number;
  description?: string | null;
}) => {
  const response = await fetch(`${API_BASE}/api/ScrumBoard/${task.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Update task API error:", errorText);
    throw new Error(`Failed to update task: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

// --------------------
// Delete a task
// --------------------
export const deleteTask = async (id: string) => {
  const response = await fetch(`${API_BASE}/api/ScrumBoard/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Delete task API error:", errorText);
    throw new Error(`Failed to delete task: ${response.status} ${response.statusText}`);
  }

  return true;
};

// --------------------
// Update column order (move lists)
// --------------------
export const updateColumnsOrder = async (orderedListIds: string[]) => {
  const response = await fetch(`${API_BASE}/api/ScrumBoard/UpdateColumnsOrder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderedListIds }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Update columns order API error:", errorText);
    throw new Error(`Failed to update columns order: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

// --------------------
// Fetch all tasks
// --------------------
export const fetchTasks = async () => {
  const response = await fetch(`${API_BASE}/api/ScrumBoard`);
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Fetch tasks API error:", errorText);
    throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
  }

  return await response.json(); // array of tasks with string IDs
};
