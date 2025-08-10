const API_BASE = import.meta.env.VITE_API_URL;
// const API_BASE = "https://scrum-board-app-backend-api.onrender.com/api";

export const fetchTasks = async () => {
  const response = await fetch(`${API_BASE}/ScrumBoard/GetAll`);
  if (!response.ok) {
    throw new Error("API call failed");
  }
  return await response.json();
};
