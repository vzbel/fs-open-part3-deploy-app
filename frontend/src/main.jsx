import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")).render(<App />);

// fetch("http://localhost:3001/notes")
//   .then((res) => (
//     res.json()
//   ))
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => console.log(err));