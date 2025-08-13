// const API_BASE = import.meta.env.VITE_API_URL;
const API_BASE = import.meta.env.VITE_API_URL.replace(/\/$/, '');

// addCard
export const createTask = async (title: string, column: number, row: number) => {
  const response = await fetch(`${API_BASE}/api/ScrumBoard/Create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      column,
      row,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Create task API error:", errorText);
    throw new Error(`Failed to create task: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

// getTask
export const getTask = async (id: number) => {
  const response = await fetch(`${API_BASE}/api/ScrumBoard/Get?id=${id}`);
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Get task API error:", errorText);
    throw new Error(`Failed to fetch task: ${response.status} ${response.statusText}`);
  }
  return await response.json();
};

// moveCard
export const updateTask = async (task: {
  id: number;
  title: string;
  column: number;
  row: number;
  description?: string | null;
}) => {
  const response = await fetch(`${API_BASE}/api/ScrumBoard/Update`, {
    method: 'POST',
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

// removeCard
export const deleteTask = async (id: number) => {
  const response = await fetch(`${API_BASE}/api/ScrumBoard?id=${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Delete task API error:", errorText);
    throw new Error(`Failed to delete task: ${response.status} ${response.statusText}`);
  }

  return true;
};

// moveList
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

// loadTasksFromBackend
export const fetchTasks = async () => {
  const response = await fetch(`${API_BASE}/api/ScrumBoard/GetAll`);
  if (!response.ok) {
    const errorText = await response.text();
    console.error("API error response:", errorText);
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }
  try {
    return await response.json();
  } catch (jsonError) {
    const text = await response.text();
    console.error("Invalid JSON from API:", text);
    throw jsonError;
  }
};
