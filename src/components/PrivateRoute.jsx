import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children, userLoggedIn }) => {
  if (!userLoggedIn) {
    // Redirect them to the login page if not logged in
    return <Navigate to="/login" />;
  }

  return children;
};
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  userLoggedIn: PropTypes.bool.isRequired,
};

export default PrivateRoute;

