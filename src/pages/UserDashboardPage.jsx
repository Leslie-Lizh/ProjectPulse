import { useAtom } from "jotai";
import { tasksAtom } from "../utilities/ProjectsAtom";
import { Chart, defaults } from "chart.js/auto"; // eslint-disable-line no-unused-vars
import { Bar, Pie } from "react-chartjs-2";

export default function UserDashboardPage( {user} ) {
    const [tasksList] = useAtom(tasksAtom);
    // console.log(tasksList)

    const assigned = tasksList.filter((list) => list.assignment.some((data) => data.assignee === user.name))
    console.log(assigned)

    return (
        <>
        <div className="m-2 ml-24 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            {assigned.map((task) => (
                <div key={task.project_title} >
                <h1>{task.project_title}</h1>
                <div className="flex flex-row gap-36 ml-24">
                    <div className="w-350 h-350">
                    <Bar data={{
                    labels: task.assignment?.map((assigned) => assigned.assignee),
                    datasets: [{
                    label: 'Tasks taken',
                    data: task.assignment?.map((assigned) => assigned.num_of_task),
                    backgroundColor: ['rgba(43, 63, 229, 0.8)', 'rgba(250, 192, 19, 0.8)', 'rgba(253, 135, 135, 0.8)'],
                    borderColor: ['rgba(43, 63, 229, 0.8)', 'rgba(250, 192, 19, 0.8)', 'rgba(253, 135, 135, 0.8)'],
                    borderWidth: 1
                    }]
                    }} option={{
                    title: {
                        display: true,
                        text: 'Monthly Sales'
                    }
                    }}/>
                    </div>
                    <div className="w-350 h-350">
                    <Pie data={{
                    labels: ['Complete', 'Incomplete'],
                    datasets: [{
                    label: 'Project completion rate',
                    data: [task.completion?.complete, task.completion?.incomplete],
                    backgroundColor: ['#84cc16', '#ef4444'],
                    borderColor: ['#84cc16', '#ef4444'],
                    borderWidth: 1
                    }]
                    }} option={{
                    title: {
                        display: true,
                        text: 'Monthly Sales'
                    }
                    }}/>
                    </div>
                </div>
                </div>
            ))}
        </div>
        </>
    )
}