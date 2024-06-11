import { useEffect, useState } from 'react';
import { listUserProjects } from '../utilities/users-service';

function UserProjectPage({ user }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
        try {
            const userName = user.name;
            const encodedUserName = encodeURIComponent(userName);
            const data = await listUserProjects(encodedUserName); 

            setProjects(data);
        } catch (error) {
            console.log("Error fetching user projects: ", error);
        }
    };

    fetchProjects();
  }, [user.name]);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl w-800">
      <h1 className='text-3xl'>Projects that you are a member</h1>
      {projects.map((project) => (
        <div key={project.project_title} className='mt-16 mb-20 border-2 rounded-br-3xl'>
          <h2 className='text-xl'>{project.project_title}</h2>
          <p className='text-base py-2.5 italic'>{project.description}</p>
          <p><strong>Client:</strong> {project.client}</p>
          <p><strong>Created Date:</strong> {new Date(project.project_created_date).toLocaleDateString("en-SG")}</p>
          <p><strong>Assigned to:</strong> {project.name}</p>
        </div>
      ))}
    </div>
  );
}

export default UserProjectPage;
