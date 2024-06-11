import { useState } from "react";
import { updateUserPassword } from "../utilities/users-service";

export default function UserProfilePage( {user} ) {
    const [newPassword, setNewPassword] = useState({
        password: "",
        confirm: ""
    })
    const [message, setMessage] = useState("")

    const disable = newPassword.password !== newPassword.confirm;

    const handleChange = (evt) => {
        setNewPassword({...newPassword, [evt.target.name]: evt.target.value})
    }

    const handlePasswordUpdate = async (evt) => {
        evt.preventDefault();
        const updatedPassword = newPassword;
        console.log(updatedPassword);
        delete updatedPassword.confirm;
        try {
            const updatedUser = await updateUserPassword(user.id, updatedPassword)
            console.log("updated user: ", updatedUser.updated)
            setMessage(`Password successfully updated for user ${user.name}, please logout and login again to reflect changes.`)
            setNewPassword({
                password: "",
                confirm: ""
            })
        } catch(error) {
            console.log('Error changing password:', error)
        }
    }

    return (
        <>
        <div className="m-2 ml-24 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl w-1000">
            <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-gray-900">Hi, SenseTime folk</h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and information.</p>
            </div>
            <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Full name</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.name}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Department</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.dept}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Role</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.role}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Email address</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{user.email}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">About</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {user.is_admin ? "Administrator of ProjectPulse" : "Member of ProjectPulse"}
                    </dd>
                </div>
                </dl>
            </div>
            <div className="form-container mt-10" style={{ maxWidth: "400px" }}>
                <form autoComplete="off" onSubmit={handlePasswordUpdate}>
                    <div>
                        <label htmlFor="new-password">New password:</label>
                        <input className="input-box h-8" type="password" id="new-password" name="password" value={newPassword.password} required onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="confirm-password">Confirm new password:</label>
                        <input className="input-box h-8" type="password" id="confirm-password" name="confirm" value={newPassword.confirm} required onChange={handleChange} />
                    </div>
                    <div className="mt-4 ml-32">
                        <button type="submit" className="update-btn" disabled={disable}>Update</button>
                    </div>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
        </>
    )
}