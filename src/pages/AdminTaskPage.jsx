import { useEffect, useState } from "react";
import debug from "debug";
import { listAllTasks } from "../utilities/users-service";
import { editSingleTask } from "../utilities/users-service";
import { deleteSingleTask } from "../utilities/users-service";
import { createSingleTask } from "../utilities/users-service";
import { useAtom } from "jotai";
import { projectsAtom } from "../utilities/ProjectsAtom";

// eslint-disable-next-line no-unused-vars
const log = debug('pern:pages:AdminTaskPage');

export default function AdminTaskPage( {user} ) {
    const [taskList, setTaskList] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredTask, setFilteredTask] = useState([]);
    const [displayEditForm, setDisplayEditForm] = useState(false);
    const [displayNewForm, setDisplayNewForm] = useState(false);
    const [taskData, setTaskData] = useState({});
    const [newTask, setNewTask] = useState({
        project_title: "",
        task_title: "",
        target_timeline: "",
        assignee: ""
    });

    const [projectsList] = useAtom(projectsAtom);
    
    const [selectedProject, setSelectedProject] = useState("");
    
    const selectedProjectMembers = projectsList.find((project) => project.project_title === selectedProject)?.members || []

    console.log(projectsList)
    
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await listAllTasks();
                setTaskList(data);
                setFilteredTask(data)
            } catch (error) {
                console.log("Error fetching tasks", error);
            }      
        };

        fetchTasks();
    }, [])

    const handleSearch = () => {
        if (search) {
          const searchData = taskList.filter((task) => task.project_title.includes(search)
          || task.task_title.includes(search)
          || task.assignee.includes(search)
          || JSON.stringify(task.status).includes(search));
          setFilteredTask(searchData);
        } else {
          setFilteredTask(taskList);
        }
    };

    const handleEdit = (task) => {
        setTaskData(task);
        setDisplayEditForm(!displayEditForm);
    }

    const handleEditChange = (evt) => {
        const { name, value } = evt.target;
        setTaskData({ ...taskData, [name]: value })
    }

    const handleEditSave = async () => {
        try {
            const data = taskData;
            // console.log(data)
            const response = await editSingleTask(data);
            console.log(response);
            setTaskList(taskList.map((task) => {
                if (task.task_id === response.task_id) {
                    return response;
                }
                return task;
            }));
            setFilteredTask(filteredTask.map((task) => {
                if (task.task_id === response.task_id) {
                    return response;
                }
                return task;
            }));
            setDisplayEditForm(false);
        } catch(error) {
            console.log('Error saving task:', error)
        }    
    }

    const handleDelete = async (taskId) => {
        try {
            const deletedTask = await deleteSingleTask(taskId);
            console.log(deletedTask.deleted);
            setTaskList(taskList.filter((task) => task.task_id !== taskId));
            setFilteredTask(filteredTask.filter((task) => task.task_id !== taskId))
        } catch (error) {
            console.log("Error deleting task:", error)
        }
    }

    const handleSelection = (evt) => {
        setSelectedProject(evt.target.value);
        setNewTask({
            ...newTask,
            [evt.target.name]: evt.target.value
        })
    }

    const handleNewChange = (evt) => {
        setNewTask({
            ...newTask,
            [evt.target.name]: evt.target.value
        })
    }

    const handleNewSubmit = async (evt) => {
        evt.preventDefault();
        const formdata = newTask;
        formdata.task_created_date = new Date().toISOString().slice(0, 10)
        formdata.status = false;
        console.log(formdata);
        try {
            const taskCreated = await createSingleTask(formdata);
            console.log("task created: ", taskCreated);
            setTaskList([taskCreated, ...taskList])
            setFilteredTask([taskCreated, ...filteredTask])
            setNewTask({
                project_title: "",
                task_title: "",
                target_timeline: "",
                assignee: ""
            })
        } catch (error) {
            console.log("Error creating task:", error)
        }
    }

    return (
        <>
        <div className="m-2 ml-24 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <h1 className="text-lg">Welcome, <strong>{user.name}</strong>, here is a list of tasks created</h1>
            <div className="flex flex-row gap-10 mb-10 mt-6" style={{ background:"#cacaca", borderRadius:"15px", width:"30%", paddingTop:"10px", paddingBottom:"10px", translate:"10px"}} >
                <div>
                    <input className="rounded-l-lg" type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div>
                    <button className="rounded-full text-white bg-rose-500 w-16" onClick={handleSearch}>Search</button>
                </div>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Project Name</th>
                            <th>Task Title</th>
                            <th>Date Created</th>
                            <th>Target Timeline</th>
                            <th>Assigned To</th>
                            <th>Status</th>
                            <th>Date Completed</th>
                            <th>Edit</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTask.map((task) => (
                            <tr key={task.task_title}>
                                <td className="text-center">{task.project_title}</td>
                                {displayEditForm === true && taskData.task_id === task.task_id? (<td><input className="w-full input-box" type="text" name="task_title" value={taskData.task_title} onChange={handleEditChange}/></td>) : (<td>{task.task_title}</td>)}
                                <td className="text-center">{new Date(task.task_created_date).toLocaleDateString("en-SG")}</td>
                                <td className="text-center">{new Date(task.target_timeline).toLocaleDateString("en-SG")}</td>
                                <td className="text-center">{task.assignee}</td>
                                <td>
                                    <div className="w-full h-full flex flex-row gap-2">
                                        <div className="h-2 w-2 rounded-full mt-2.5" style={{backgroundColor: task.status ? "green" : Date.parse(new Date()) <= Date.parse(task.target_timeline) ? "yellow" : "red"}}></div>
                                        {task.status ? (<span>complete</span>) : Date.parse(new Date()) <= Date.parse(task.target_timeline) ? (<span>in-progress</span>) : (<span>overdue</span>)}
                                    </div>
                                </td>
                                {task.task_completed_date ? (<td className="text-center">{new Date(task.task_completed_date).toLocaleDateString("en-SG")}</td>) : (<td className="text-center">null</td>)}
                                <td><button className="edit-btn" onClick={() => handleEdit(task)}>🖊</button></td>
                                {displayEditForm === true && taskData.task_id === task.task_id ? (<td><button className="save-btn" style={{ backgroundColor: "#a3e635" }} onClick={handleEditSave}>✔</button></td>) : (<td><button className="delete-btn" onClick={() => handleDelete(task.task_id)}>❌</button></td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-10">
                <button className="rounded-full bg-indigo-400 h-8 w-8 text-white" onClick={() => setDisplayNewForm(!displayNewForm)}>+</button>
            </div>
            {displayNewForm && (
            <div className="form-container" style={{ maxWidth: "400px", marginTop: "20px" }}>
                <form autoComplete="off" onSubmit={handleNewSubmit}>
                    <div>
                    <label htmlFor="project">Select project:</label>
                    <select id="project" name="project_title" required onChange={handleSelection}>
                        <option value="">--Please choose a project--</option>
                        {projectsList.map((project) => (
                            <option key={project.project_title} value={project.project_title}>{project.project_title}</option>
                        ))}
                    </select>
                    </div>
                    <div>
                    <label htmlFor="task">Task title:</label>
                    <input type='text' id="task" name='task_title' value={newTask.task_title} onChange={handleNewChange} required/>
                    </div>
                    <div>
                        <label htmlFor="timeline">Target timeline:</label>
                        <input type="date" id="timeline" name="target_timeline" value={newTask.target_timeline} min="2024-06-13" onChange={handleNewChange} required/>
                    </div>
                    <div>
                    <label htmlFor="user">Assign to:</label>
                    <select id="user" name="assignee" onChange={handleNewChange} required>
                        <option value="">--Please choose a member--</option>
                        {selectedProjectMembers.map((member, index) => (
                            <option key={index || member}>{member}</option>
                        ))}
                    </select>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="create-btn">Create</button>
                    </div>
                </form>
            </div>
        )}
        </div>
        </>
    )
}