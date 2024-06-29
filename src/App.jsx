import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import FileManagement from "./pages/FileManagement.jsx"; // Import the new FileManagement page
import { useEffect, useState } from "react"; // Import useEffect and useState

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Router>
      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        </button>
      </div>
    
      <Routes>
        <Route exact path="/" element={<Index />} />
      <Route path="/file-management" element={<FileManagement />} /> {/* Add the new route */}
      </Routes>
    </Router>
  );
}

export default App;
