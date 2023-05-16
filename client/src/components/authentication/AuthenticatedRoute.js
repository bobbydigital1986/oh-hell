import React from "react";
import { Redirect, Route } from "react-router";
import SocketOrigin from "./SocketOrigin";

const AuthenticationCheck = ({ component: Component, inheritedSocket, user, ...rest }) => {
  if (user === undefined) {
    return <div>Loading...</div>
  }
  if (user !== null) {
    return (
      <SocketOrigin 
        user={user} 
        inheritedSocket={inheritedSocket}
        Component={Component} 
        {...rest} 
      />
    )
  }
  return <Redirect to="/user-sessions/new" />;
};

const AuthenticatedRoute = ({ component, user, ...rest }) => {
  const { location } = rest
  const inheritedSocket = location.socket ? location.socket : null

  return (
    <Route
    
      {...rest}
    >
      <AuthenticationCheck
        user={user}
        component={component}
        inheritedSocket={inheritedSocket}
        {...rest}
      />
    </Route>
  );
};

export default AuthenticatedRoute;