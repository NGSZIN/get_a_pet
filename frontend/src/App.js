import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import NavBar from "./components/NavBar";
import Container from "./components/Container";
import { UserProvider } from "./context/UserContext"


function App() {
  return (
    <div className="App">
      <Router>
        <UserProvider>
          <NavBar />
          <Container>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/Login" element={<Login />} />
              <Route exact path="/user/profile" element={<Profile />} />
              <Route exact path="register" element={<Register />} />
            </Routes>
          </Container>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
