import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import NavBar from './components/NavBar';
import Profile from './pages/Profile';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { AuthContext } from './context/AuthContext';
import './App.css';
import Modal from "./context/Modal";
import './modal.css';
import RidePage from "./pages/RidePage";
import RidesOverview from "./pages/RidesOverview";

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
