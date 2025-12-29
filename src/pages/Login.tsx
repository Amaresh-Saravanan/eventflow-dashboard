import { Navigate } from "react-router-dom";

// Backwards-compatible route: keep /login working, but the real auth UI lives at /auth.
const Login = () => {
  return <Navigate to="/auth" replace />;
};

export default Login;

