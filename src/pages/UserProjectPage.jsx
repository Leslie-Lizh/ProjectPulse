import { useEffect, useState } from 'react';
import { listUserProjects } from '../utilities/users-service';

function UserProjectPage({ user }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const userName = user.name;
      const encodedUserName = encodeURIComponent(userName);
      const data = await listUserProjects(encodedUserName); 

      setProjects(data);
    };

    fetchProjects();
  }, [user.name]);

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

export default UserProjectPage;
