import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { hot } from "react-hot-loader/root";

import getCurrentUser from "../services/getCurrentUser";
import "../assets/scss/main.scss";
import RegistrationForm from "./registration/RegistrationForm";
import SignInForm from "./authentication/SignInForm";
import TopBar from "./layout/TopBar";
import WelcomePage from "./WelcomePage";
import GameNew from "./game/GameNew";
import Game from "./game/Game";
import Chat from "./Chat"
import AuthenticatedRoute from "./authentication/AuthenticatedRoute";

const App = (props) => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser()
      setCurrentUser(user)
    } catch(err) {
      setCurrentUser(null)
    }
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  return (
    <Router>
      <TopBar user={currentUser} />
      <Switch>
        <AuthenticatedRoute
          exact path="/game/new"
          component={GameNew}
          user={currentUser}
          {...props}/>
        <AuthenticatedRoute 
          exact path="/game/:gameId" 
          component={Game} 
          user={currentUser}
          {...props}
        />
        <Route exact path="/chat" component={Chat}/>
        <Route exact path="/users/new" component={RegistrationForm} />
        <Route exact path="/user-sessions/new" component={SignInForm} />
        <Route exact path="/" component={WelcomePage}/>
      </Switch>
    </Router>
  );
};

export default hot(App);
