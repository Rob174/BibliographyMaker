import { API_URL } from "../data";
export const getTags = async () => {
  // Get tags with fetch request
  const r = await (
    await fetch(`${API_URL}/tags/`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json();
  return r;
};
export const getPapers = async () => {
  // Get papers with fetch request
  const r = await fetch(`${API_URL}/papers/`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return r.json();
};
export const serverRunning = async () => {
  try {
    const serverStatus = await fetch(`${API_URL}/`);
    return true;
  } catch (error) {
    console.error("Error visualize:", error);
    return false;
  }
};
