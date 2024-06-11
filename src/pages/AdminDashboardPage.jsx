import { useEffect } from "react";
import { Chart, defaults } from "chart.js/auto"; // eslint-disable-line no-unused-vars
import { Bar, Pie } from "react-chartjs-2";
import { useAtom } from "jotai";
import { tasksAtom } from "../utilities/ProjectsAtom"
import { listAllTasks } from "../utilities/users-service";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

export default function AdminDashboardPage() {
    const [allTasks, setAllTasks] = useAtom(tasksAtom)

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await listAllTasks();
                console.log("all tasks:", data)

                const groupedData = data.reduce((acc, task) => {
                    const { project_title, assignee, status } = task;
                  
                    if (!acc[project_title]) {
                      acc[project_title] = {
                        project_title,
                        assignment: [],
                        completion: { complete: 0, incomplete: 0 }
                      };
                    }
                  
                    const assigneeIndex = acc[project_title].assignment.findIndex(a => a.assignee === assignee);
  
                    if (assigneeIndex === -1) {
                        acc[project_title].assignment.push({ assignee, num_of_task: 1 });
                    } else {
                        acc[project_title].assignment[assigneeIndex].num_of_task += 1;
                    }
                  
                    if (status) {
                      acc[project_title].completion.complete += 1;
                    } else {
                      acc[project_title].completion.incomplete += 1;
                    }
                  
                    return acc;
                  }, {});
                  
                  const result = Object.values(groupedData).map(project => ({
                    project_title: project.project_title,
                    assignment: project.assignment,
                    completion: project.completion
                  }));

                  console.log("final result: ", result)
                  setAllTasks(result)

            } catch (error) {
                console.log("Error fetching tasks", error);
            }      
        };

        fetchTasks();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    console.log(allTasks)

    return (
        <>
        <div className="m-2 ml-24 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            {allTasks.map((task) => (
                <div className="mb-8" key={task.project_title} >
                <h1 style={{fontWeight: "bold"}}>{task.project_title}</h1>
                <div className="flex flex-row gap-36 ml-24 mt-4">
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
                        text: 'Task KPI'
                    }
                    }}/>
                    </div>
                    <div className="w-350 h-350">
                    <Pie data={{
                    labels: ['Complete', 'Incomplete'],
                    datasets: [{
                    label: 'Project completion rate',
                    data: [task.completion?.complete, task.completion.incomplete],
                    backgroundColor: ['#84cc16', '#ef4444'],
                    borderColor: ['#84cc16', '#ef4444'],
                    borderWidth: 1
                    }]
                    }} option={{
                    title: {
                        display: true,
                        text: 'Project KPI'
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