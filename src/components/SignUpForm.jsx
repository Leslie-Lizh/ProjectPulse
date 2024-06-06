/* eslint-disable react/display-name */
import { Component } from "react";
import { signUp } from "../utilities/users-service";
import debug from "debug";
import { useNavigate, Link } from "react-router-dom";

const log = debug("pern:components:SignUpForm");

const withRouter = WrappedComponent => props => {
    const navigate = useNavigate();
    // Other hooks can be added here if needed
    return <WrappedComponent {...props} navigate={navigate} />;
};

class SignUpForm extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        confirm: '',
        dept: '',
        role: '',
        is_admin: false,
        message: ''
    };

    // you can only use arrow function for class component, without the "const"
    handleChange = (evt) => {
        this.setState({
            ...this.state,
            [evt.target.name]: evt.target.value,
        });
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        // alert(JSON.stringify(this.state));
        
        try {
            const formData = {...this.state};
            log("formData: %o", formData);
            delete formData.confirm;
            const user = await signUp(formData);
            log("user: %o", user);
            const { navigate } = this.props;
            navigate('/')
        } catch(err) {
            log(err);
            this.setState({message: "Registration Failed. Please try Again"})
        }
    };

    render() {
        const disable = this.state.password !== this.state.confirm;
        return (
            <div className="mt-12">
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img
                            className="mx-auto h-10 w-auto"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                            alt="Your Company"
                        />
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Welcome, register with ProjectPulse today!
                        </h2>
                    </div>
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" autoComplete="off" onSubmit={this.handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Name</label>
                                <div className="mt-2">
                                    <input id="name" type="text" name="name" value={this.state.name} onChange={this.handleChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="dept" className="block text-sm font-medium leading-6 text-gray-900">Department</label>
                                <div className="mt-2">
                                    <input id="dept" type="text" name="dept" required value={this.state.dept} onChange={this.handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                </div>
                            </div>                           
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">Role / Title</label>
                                <div className="mt-2">
                                    <input id="role" type="text" name="role" required value={this.state.role} onChange={this.handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                </div>
                            </div>                            
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                                <div className="mt-2">
                                    <input id="email" type="email" name="email" value={this.state.email} onChange={this.handleChange} required pattern="\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                </div>
                            </div>                           
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                                <div className="mt-2">
                                    <input id="password" type="password" name="password" minLength="3" value={this.state.password} onChange={this.handleChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                </div>
                            </div>                            
                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
                                <div className="mt-2">
                                    <input id="confirm-password" type="password" name="confirm" value={this.state.confirm} onChange={this.handleChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                </div>
                            </div>
                            <div>
                                <button type="submit" disabled={disable} className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Register</button>
                            </div>
                        </form>
                        <p className="mt-10 text-center text-sm text-gray-500">
                            Already have an account?
                            <Link to="/" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Return to Login Page</Link>
                        </p>
                        <br/>
                        <p className="message">&nbsp;{this.state.message}</p>
                    </div>
                </div>
            </div>
        )
    }
}

// eslint-disable-next-line react-refresh/only-export-components
export default withRouter(SignUpForm)