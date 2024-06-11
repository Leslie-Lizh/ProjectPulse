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
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <h1>Projects</h1>
      {projects.map((project) => (
        <div key={project.project_title} className='mt-20 mb-20'>
          <h2>{project.project_title}</h2>
          <p>{project.description}</p>
          <p><strong>Client:</strong> {project.client}</p>
          <p><strong>Created Date:</strong> {new Date(project.project_created_date).toLocaleDateString("en-SG")}</p>
          <p><strong>Members:</strong> {project.members.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminProjectPage;
