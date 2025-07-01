import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Render app directly without HTML overlay
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
