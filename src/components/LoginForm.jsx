import { useState } from "react";
import * as usersService from "../utilities/users-service";
import { useNavigate, Link } from "react-router-dom";
import debug from "debug";
import projectPulse from "../assets/projectPulse.jpeg"

const log = debug("pern:components:LoginForm");

export default function LoginForm({ setUser }) {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  function handleChange(evt) {
    setCredentials({ ...credentials, [evt.target.name]: evt.target.value });
    setError("");
  }

  // cronjob function -> string -> usersService.createUrl(string); -> url -> database

  async function handleSubmit(evt) {
    // Prevent form from being submitted to the server
    evt.preventDefault();
    try {
      // The promise returned by the signUp service method
      // will resolve to the user object included in the
      // payload of the JSON Web Token (JWT)
      const user = await usersService.login(credentials)
      setUser(user);
      log(user);
      if (user.is_admin === true) {
        navigate(`/${user.dept.replace(/\s+/g, "")}/admin/dashboard`);
      } else {
        navigate(`/${user.dept.replace(/\s+/g, "")}/${user.name.replace(/\s+/g, "")}/dashboard`);
      }
    } catch {
      setError("Log In Failed. Please try Again");
    }
  }

  return (
    <div className="mt-32">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
                className="mx-auto h-36 w-auto"
                src={projectPulse}
                alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Welcome back, SenseTime folks.
            </h2>
          </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" autoComplete="off" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>               
                </div>
                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        <div className="text-sm">
                            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                Forgot password?
                            </a>
                        </div>
                    </div>
                    <div className="mt-2">
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                <div>
                    <button className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" type="submit">LOG IN</button>
                </div>         
            </form>
            <p className="mt-10 text-center text-sm text-gray-500">
                Does not have an account?
                <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Sign Up here!</Link>
            </p>
            <br/>
            <p className="error-message">&nbsp;{error}</p>
        </div>
      </div>
    </div>
  );
}
