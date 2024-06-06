import debug from "debug";
import { useEffect, useState } from "react"; // eslint-disable-line no-unused-vars
import { Routes, Route } from "react-router-dom";
import { getUser } from "./utilities/users-service";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import SideBar from "./components/SideBar";
import './App.css'

const log = debug("mern:pages:App:App"); // eslint-disable-line no-unused-vars

function App() {

  const [user, setUser] = useState(getUser());

  // useEffect(() => {
  //   const interValid = setInterval(() => {
  //     const loggedIn = getUser();
  //     if (loggedIn) {
  //       setUser(loggedIn)
  //     }
  //   }, 60000);

  //   return () => clearInterval(interValid); 
  // }, []);

  if (!user) {
    return (
      <>
        <main className="App">
          <AuthPage setUser={setUser} />
        </main>
      </>
    );
  } 

  return (
    <>
      <main className="App">
        <div className="w-64 fixed sidebar dark:bg-secondary-dark-bg bg-white">
            <SideBar user={user} />
        </div>
        <Routes>
          <Route path="/:dept/admin/dashboard" element={<ProtectedRoute user={user} adminComponent={AdminDashboardPage} />} />
          <Route path="/:dept/:name/dashboard" element={<ProtectedRoute user={user} userComponent={UserDashboardPage} />} />
        </Routes>
      </main>
    </>
  )
}

export default App
