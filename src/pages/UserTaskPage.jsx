import { useState, useEffect } from "react"
import { listUserTasks } from "../utilities/users-service";
import { completeSingleTask } from "../utilities/users-service";

export default function UserTaskPage({ user }) {
    const [taskList, setTaskList] = useState([])

    useEffect(() => {
        const fetchTasks = async () => {
            try {
          const userName = user.name;
          const encodedUserName = encodeURIComponent(userName);
          const data = await listUserTasks(encodedUserName); 
    
          setTaskList(data);
            } catch (error) {
                console.log("Error fetching user tasks: ", error)
            }
        };
    
        fetchTasks();
      }, [user.name]);

    const handleComplete = async (taskId) => {
        try {
            const dateCompleted = new Date().toISOString().slice(0, 10);
            const payload = { status: true, task_completed_date: dateCompleted }
            const completedTask = await completeSingleTask(taskId, payload);
            console.log("completed task: ", completedTask);
            
            setTaskList(taskList.map((task) => {
                if (task.task_id === taskId) {
                    return completedTask;
                }
                return task;
            }))
        } catch (error) {
            console.log("Error completing task: ", error)
        }
    }

    const taskComplete = taskList.filter((task) => task.status === true);
    const taskIncomplete = taskList.filter((task) => task.status === false);
    
    return (
        <>
        <div className="m-2 ml-24 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <h1>Welcome, {user.name}, here is a list of tasks you are involved in</h1>
            <div>
                <h2>Tasks you have yet complete, keep up!</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Project Name</th>
                            <th>Task Title</th>
                            <th>Date Created</th>
                            <th>Target Timeline</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {taskIncomplete.map((task) => (
                            <tr key={task.task_title}>
                                <td>{task.project_title}</td>
                                <td>{task.task_title}</td>
                                <td>{new Date(task.task_created_date).toLocaleDateString("en-SG")}</td>
                                <td>{new Date(task.target_timeline).toLocaleDateString("en-SG")}</td>
                                <td>
                                    <div className="w-full h-full flex flex-row item-center gap-2">
                                        <div className="h-2 w-2 rounded-full" style={{backgroundColor: task.status ? "green" : Date.parse(new Date()) <= Date.parse(task.target_timeline) ? "yellow" : "red"}}></div>
                                        {task.status ? (<span>complete</span>) : Date.parse(new Date()) <= Date.parse(task.target_timeline) ? (<span>in-progress</span>) : (<span>overdue</span>)}
                                    </div>
                                </td>
                                <td><button className="complete-btn" onClick={() => handleComplete(task.task_id)}>Mark Done</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <h2>Tasks you have already complete, congratz!</h2>
                {taskComplete.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Project Name</th>
                            <th>Task Title</th>
                            <th>Date Created</th>
                            <th>Target Timeline</th>
                            <th>Status</th>
                            <th>Date Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {taskComplete.map((task) => (
                            <tr key={task.task_title}>
                                <td>{task.project_title}</td>
                                <td>{task.task_title}</td>
                                <td>{new Date(task.task_created_date).toLocaleDateString("en-SG")}</td>
                                <td>{new Date(task.target_timeline).toLocaleDateString("en-SG")}</td>
                                <td>
                                    <div className="w-full h-full flex flex-row item-center gap-2">
                                        <div className="h-2 w-2 rounded-full" style={{backgroundColor: task.status ? "green" : Date.parse(new Date()) <= Date.parse(task.target_timeline) ? "yellow" : "red"}}></div>
                                        {task.status ? (<span>complete</span>) : Date.parse(new Date()) <= Date.parse(task.target_timeline) ? (<span>in-progress</span>) : (<span>overdue</span>)}
                                    </div>
                                </td>
                                <td>{new Date(task.task_completed_date).toLocaleDateString("en-SG")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
            </div>
        </div>
        </>
    )
}