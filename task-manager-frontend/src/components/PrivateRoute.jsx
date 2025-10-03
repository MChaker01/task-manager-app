import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const PrivateRoute = ({ children }) => {
  // 1. Récupère le user depuis Redux
  const { user } = useSelector((state) => state.auth);

  // 2. Si user existe, affiche le composant enfant (children)
  // 3. Sinon, redirige vers /login

  return user ? children : <Navigate to="/login" />;

  //   if (user) {
  //     return children;
  //   } else {
  //     return <Navigate to="/login" />;
  //   }
};

export default PrivateRoute;
