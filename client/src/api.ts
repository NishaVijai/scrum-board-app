export const fetchTasks = async () => {
    const response = await fetch('/api/ScrumBoard');
    if (!response.ok) {
        throw new Error("API call failed");
    }
    return await response.json();
};