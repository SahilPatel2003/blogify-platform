import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BlogList  from "./components/BlogList"
import BlogDetail from "./components/BlogDetail";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<BlogList/>} />
          <Route path="/blogs/:slug" element={<BlogDetail/>} />
        </Routes>
      </Router>
  );
}

export default App;
