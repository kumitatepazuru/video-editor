import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import Root from "./root/App";
import "./main.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
      </Routes>
    </Router>
  );
}
