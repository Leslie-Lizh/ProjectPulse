import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, adminComponent: AdminComponent, userComponent: UserComponent, ...rest }) => {
  if (!user) {
    // If user is not authenticated, redirect to login page
    return <Navigate to="/" replace />;
  }

  if (user.is_admin) {
    return <AdminComponent user={user} {...rest} />;
  }

  return <UserComponent user={user} {...rest} />;
};

export default ProtectedRoute;
