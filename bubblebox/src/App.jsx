import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Register from "./pages/Login/Register";
import ProtectedRoute from "./components/misc/ProtectedRoute";
import UserPage from "./pages/misc2/UserPage";
import GuestRoute from "./components/misc/GuestRoute";
import Dashboard from "./pages/Dashboard/Dashboard";



function App() {
  return (
    <Router>
      <Routes>
        <Route element ={<GuestRoute/>}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Home" element={<Home />} />

        
        <Route path="/login" element={<Login />} />
        <Route path="/Login" element={<Login />} />

        <Route path="/Register" element={<Register />} />
        <Route path="/register" element={<Register />} />
        </Route>


        <Route element ={<ProtectedRoute/>}>
        <Route path="/settings" element={<UserPage/>} />
         { <Route path="/dashboard" element={<Dashboard/>}/> }

        </Route>


      </Routes>
    </Router>
  );
}

export default App;
