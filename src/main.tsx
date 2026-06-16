import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { loadSavedTheme } from "./pages/admin/AdminSettings";

loadSavedTheme();

createRoot(document.getElementById("root")!).render(<App />);
