import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import FileManagement from "./pages/FileManagement.jsx"; // Import the new FileManagement page

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Index />} />
      <Route path="/file-management" element={<FileManagement />} /> {/* Add the new route */}
      </Routes>
    </Router>
  );
}

export default App;
