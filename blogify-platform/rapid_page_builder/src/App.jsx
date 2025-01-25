import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Landing from "./components/Landing";
import Listing from "./components/Listing";
import Editpage from "./components/Editpage";
import Preview from "./components/Preview";
import { EditorProvider } from "./components/EditorContext";
import { app } from "./components/firebase"

function App() {
  return (
    <EditorProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/listing" element={<Listing />} />
          <Route path="/editpage" element={<Editpage />} />
          <Route path="/editpage/:id" element={<Editpage />} />
          <Route path="/preview" element={<Preview />} />
        </Routes>
      </Router>
    </EditorProvider>
  );
}

export default App;
