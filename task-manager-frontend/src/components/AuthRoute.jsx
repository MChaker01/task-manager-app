import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const AuthRoute = ({ children }) => {
  // récupérer l'utilisateur depuis Redux
  const { user } = useSelector((state) => state.auth);

  return user ? <Navigate to="/" /> : children;

  //   if (user) {
  //     return <Navigate to="/" />;
  //   } else {
  //     return children;
  //   }
};

export default AuthRoute;
