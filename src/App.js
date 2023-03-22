import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import NavBar from '././components/navbar/NavBar';
import Profile from '././pages/Profile/Profile';
import Home from '././pages/home/Home';
import SignIn from '././pages/signIn/SignIn';
import SignUp from '././pages/signUp/SignUp';
import SignUpTest from "./pages/signUp/SignUpTest";
import { AuthContext } from './context/AuthContext';
import './App.css';
import Modal from "././context/modal/Modal";
import '././context/modal/modal.css';
import RidePage from "./pages/RidePage/RidePage";
import RidesOverview from "./pages/RideOverviewPage/RidesOverview";
import PrivateRoute from "./components/PrivateRoute";
import Special from "./components/special/Special";
import Footer from "./components/footer/Footer";


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
            {/*<Route path="/profile">*/}
            {/*  {isAuth ? <Profile /> : <Redirect to="/signin" />}*/}
            {/*</Route>*/}
            /////
              <Route path="/profile">
            <PrivateRoute auth={isAuth}>
                          <Profile/>
            </PrivateRoute>
              </Route>
            //////
            <Route exact path="/signin">
              <SignIn />
            </Route>

            <Route exact path="/signup">
              {/*<SignUp />*/}
                <SignUpTest/>
            </Route>

            <Route path="/ride/:id">
              <RidePage />
            </Route>

            {/*<Route path="/rides" >*/}
            {/*  <RidesOverview />*/}
            {/*</Route>*/}

              <Route path="/rides" render={(props) => <RidesOverview {...props} />} />


          </Switch>
        </div>
        {/*  <Modal message="test bericht!"/>*/}
        {/*<Special title="banaan">*/}
        {/*  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consequatur dolore facilis in*/}
        {/*    ipsa. At, beatae blanditiis, commodi corporis, eos fuga incidunt iste labore modi officia*/}
        {/*    sunt ullam voluptatem voluptatum!</p>*/}
        {/*</Special>*/}

        <Footer/>
      </>
  );
}

export default App;
