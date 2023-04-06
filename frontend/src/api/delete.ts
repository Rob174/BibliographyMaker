import { API_URL } from "../data";
export type CallBackClean = (msg: string) => void;
export function clean(callback: CallBackClean = () => {}) {
  fetch(`${API_URL}/clean/`, {
    method: "DELETE",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      callback("Deleted all papers");
    })
    .catch((error) => {
      console.error("Error:", error);
      // If error show error message in frontend during 5 seconds
      callback("Error: " + error);
    });
}
