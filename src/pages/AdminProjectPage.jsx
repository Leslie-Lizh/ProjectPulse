import { useEffect, useState } from 'react';
import { listAllProjects } from '../utilities/users-service';

function AdminProjectPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await listAllProjects(); 

      const groupedData = data.reduce((acc, project) => {
        const { project_title, description, client, project_created_date, name } = project;

        if (!acc[project_title]) {
          acc[project_title] = {
            project_title,
            description,
            client,
            project_created_date,
            users: []
          };
        }

        acc[project_title].users.push(name);

        return acc;
      }, {});

      setProjects(Object.values(groupedData));
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <h1>Projects</h1>
      {projects.map((project) => (
        <div key={project.project_title}>
          <h2>{project.project_title}</h2>
          <p>{project.description}</p>
          <p><strong>Client:</strong> {project.client}</p>
          <p><strong>Created Date:</strong> {new Date(project.project_created_date).toLocaleDateString("en-SG")}</p>
          <p><strong>Users:</strong> {project.users.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminProjectPage;
