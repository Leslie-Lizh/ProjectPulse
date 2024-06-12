import debug from "debug";
import { useEffect, useState } from "react"; // eslint-disable-line no-unused-vars
import { Routes, Route, Navigate } from "react-router-dom"; // eslint-disable-line no-unused-vars
import { getUser } from "./utilities/users-service";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import SideBar from "./components/SideBar";
import AdminProjectPage from "./pages/AdminProjectPage";
import UserProjectPage from "./pages/UserProjectPage";
import AdminTaskPage from "./pages/AdminTaskPage";
import UserTaskPage from "./pages/UserTaskPage";
import AdminProfilePage from "./pages/AdminProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import './App.css'

const log = debug("mern:pages:App:App"); // eslint-disable-line no-unused-vars

function App() {

  const [user, setUser] = useState(getUser());

  // check the token maybe... every 5min?
  useEffect(() => {
    const interValid = setInterval(() => {
      const loggedIn = getUser();
      setUser(loggedIn)
    }, 300000);

    return () => clearInterval(interValid); 
  }, []);

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
      <main className="flex">
        <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
            <SideBar user={user} setUser={setUser}/>
        </div>
        <div className="relative ml-64">
        <Routes>
          <Route path="/:dept/admin/dashboard" element={<ProtectedRoute user={user} adminComponent={AdminDashboardPage} />} />
          <Route path="/:dept/:name/dashboard" element={<ProtectedRoute user={user} userComponent={UserDashboardPage} />} />
          <Route path="/:dept/admin/projects" element={<ProtectedRoute user={user} adminComponent={AdminProjectPage} />} />
          <Route path="/:dept/:name/projects" element={<ProtectedRoute user={user} userComponent={UserProjectPage} />} />
          <Route path="/:dept/admin/tasks" element={<ProtectedRoute user={user} adminComponent={AdminTaskPage} />} />
          <Route path="/:dept/:name/tasks" element={<ProtectedRoute user={user} userComponent={UserTaskPage} />} />
          <Route path="/:dept/admin/profile" element={<ProtectedRoute user={user} adminComponent={AdminProfilePage} />} />
          <Route path="/:dept/:name/profile" element={<ProtectedRoute user={user} userComponent={UserProfilePage} />} />
          {/* <Route path="*" element={<Navigate to="/" />} /> */}
        </Routes>
        </div>
      </main>
    </>
  )
}

export default App
