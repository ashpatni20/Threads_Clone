import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('token');

  // console.log(children);

  return children;

  return token ? (
    children 
  ) : (
    <Navigate to="/" replace={true} />
  );
};

export default ProtectedRoute;
