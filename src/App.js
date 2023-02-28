import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import NavBar from '././components/navbar/NavBar';
import Profile from '././pages/Profile/Profile';
import Home from '././pages/home/Home';
import SignIn from '././pages/signIn/SignIn';
import SignUp from '././pages/signUp/SignUp';
import { AuthContext } from './context/AuthContext';
import './App.css';
import Modal from "././context/modal/Modal";
import '././context/modal/modal.css';
import RidePage from "./pages/RidePage/RidePage";
import RidesOverview from "./pages/RideOverviewPage/RidesOverview";

function App() {
  const { isAuth } = useContext(AuthContext);

  return (
      <>
        <NavBar />
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/profile">
              {isAuth ? <Profile /> : <Redirect to="/" />}
            </Route>
            <Route exact path="/signin">
              <SignIn />
            </Route>

            <Route exact path="/signup">
              <SignUp />
            </Route>

            <Route path="/ride/:id">
              <RidePage />
            </Route>

            <Route path="/rides">
              <RidesOverview />
            </Route>

          </Switch>
        </div>
          <Modal message="test bericht!"/>
      </>
  );
}

export default App;
