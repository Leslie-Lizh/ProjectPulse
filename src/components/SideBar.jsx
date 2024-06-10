import { NavLink } from "react-router-dom"
import * as userService from "../utilities/users-service"

export default function SideBar({ user, setUser }) {

    const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-white  text-md m-2';
    const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';
    
    function handleLogOut() {
        // Delegate to the users-service
        userService.logOut();
        // Update state will also cause a re-render
        setUser(null);
      }

    return (
        <>
        <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
            <div className="mt-10 ">
                {user.is_admin ? 
                (<div>
                <NavLink to={`/${user.dept}/admin/dashboard`} style={({ isActive }) => ({
                      backgroundColor: isActive ? '#03C9D7' : '',
                    })} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                    Dashboard
                </NavLink>
                <NavLink to={`/${user.dept}/admin/projects`} style={({ isActive }) => ({
                      backgroundColor: isActive ? '#03C9D7' : '',
                    })} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                    Project
                </NavLink>
                <NavLink to={`/${user.dept}/admin/tasks`} style={({ isActive }) => ({
                      backgroundColor: isActive ? '#03C9D7' : '',
                    })} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                    Task
                </NavLink>
                <NavLink to={`/${user.dept}/admin/profile`} style={({ isActive }) => ({
                      backgroundColor: isActive ? '#03C9D7' : '',
                    })} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                    Profile
                </NavLink>
                <NavLink to="" onClick={handleLogOut} className={normalLink}>
                    Log Out
                </NavLink>
                </div>) : 
                (<div>
                <NavLink to={`/${user.dept}/${user.name}/dashboard`} style={({ isActive }) => ({
                      backgroundColor: isActive ? '#03C9D7' : '',
                    })} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                    Dashboard
                </NavLink>
                <NavLink to={`/${user.dept}/${user.name}/projects`} style={({ isActive }) => ({
                      backgroundColor: isActive ? '#03C9D7' : '',
                    })} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                    Project
                </NavLink>
                <NavLink to={`/${user.dept}/${user.name}/tasks`} style={({ isActive }) => ({
                      backgroundColor: isActive ? '#03C9D7' : '',
                    })} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                    Task
                </NavLink>
                <NavLink to={`/${user.dept}/${user.name}/profile`} style={({ isActive }) => ({
                      backgroundColor: isActive ? '#03C9D7' : '',
                    })} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                    Profile
                </NavLink>
                <NavLink to="" onClick={handleLogOut} className={normalLink}>
                    Log Out
                </NavLink>
                </div>)}
            </div>
        </div>      
        </>
    )
}