// src/api.ts

const API_BASE = import.meta.env.VITE_API_URL.replace(/\/$/, '');
const BASE_URL = `${API_BASE}/api/ScrumBoard`;

// --------------------
// Shared request helper
// --------------------
const request = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API error:', errorText);
    throw new Error(`${response.status} ${response.statusText}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
};

// --------------------
// Task DTO
// --------------------
export interface TaskDto {
  id: string;
  title: string;
  column: number;
  row: number;
  description?: string | null;
}

// --------------------
// Create a new task
// --------------------
export const createTask = async (
  title: string,
  column: number,
  row: number
): Promise<TaskDto> =>
  request<TaskDto>(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, column, row }),
  });

// --------------------
// Get a task by ID
// --------------------
export const getTask = async (id: string): Promise<TaskDto> =>
  request<TaskDto>(`${BASE_URL}/${id}`);

// --------------------
// Fetch all tasks
// --------------------
export const fetchTasks = async (): Promise<TaskDto[]> =>
  request<TaskDto[]>(BASE_URL);

// --------------------
// Update a task
// --------------------
export const updateTask = async (task: TaskDto): Promise<void> =>
  request<void>(`${BASE_URL}/${task.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });

// --------------------
// Delete a task
// --------------------
export const deleteTask = async (id: string): Promise<void> =>
  request<void>(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

// --------------------
// Update column order
// --------------------
export const updateColumnsOrder = async (
  orderedListIds: string[]
): Promise<void> =>
  request<void>(`${BASE_URL}/UpdateColumnsOrder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderedListIds }),
  });

// --------------------
// Ping health endpoint (wake backend)
// --------------------
export const pingHealth = async (): Promise<void> => {
  // Intentionally fire-and-forget:
  // - Render backend wakes up
  // - CORS blocks response access (expected)
  // - No logging to avoid noisy dev console
  try {
    await fetch(`${API_BASE}/api/health`, { mode: 'no-cors' });
  } catch {
    // intentionally ignored
  }
};
