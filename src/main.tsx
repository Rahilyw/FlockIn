import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initFirebaseAnalytics } from "@/firebase/app";

initFirebaseAnalytics();

createRoot(document.getElementById("root")!).render(<App />);
