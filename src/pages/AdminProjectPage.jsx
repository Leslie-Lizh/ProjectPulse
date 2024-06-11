import { useEffect } from 'react';
import { listAllProjects } from '../utilities/users-service';
import { useAtom } from 'jotai';
import { projectsAtom } from '../utilities/ProjectsAtom';

function AdminProjectPage() {
  const [projects, setProjects] = useAtom(projectsAtom);

  useEffect(() => {
    const fetchProjects = async () => {
        try {
      const data = await listAllProjects(); 

      const groupedData = data.reduce((acc, project) => {
        const { project_title, project_id, description, client, project_created_date, name } = project;

        if (!acc[project_title]) {
          acc[project_title] = {
            project_id,
            project_title,
            description,
            client,
            project_created_date,
            members: []
          };
        }

        acc[project_title].members.push(name);

        return acc;
      }, {});

      setProjects(Object.values(groupedData));

        } catch (error) {
            console.log("Error fetching projects: ", error)
        }
    };

    fetchProjects();
  }, [setProjects]); 

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl w-800">
      <h1 className='text-3xl'>ALL PROJECTS</h1>
      {projects.map((project) => (
        <div key={project.project_title} className='mt-16 mb-20 border-2 rounded-br-3xl'>
          <h2 className='text-xl'>{project.project_title}</h2>
          <p className='text-base py-2.5 italic'>{project.description}</p>
          <p><strong>Client:</strong> {project.client}</p>
          <p><strong>Created Date:</strong> {new Date(project.project_created_date).toLocaleDateString("en-SG")}</p>
          <p><strong>Members:</strong> {project.members.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminProjectPage;
