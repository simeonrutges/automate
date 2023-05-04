import React, {useContext} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import NavBar from '././components/navbar/NavBar';
import Profile from '././pages/Profile/Profile';
import Home from '././pages/home/Home';
import SignIn from '././pages/signIn/SignIn';
import SignUp from '././pages/signUp/SignUp';
import SignUpTest from "./pages/signUp/SignUpTest";
import {AuthContext} from './context/AuthContext';
import './App.css';
import Modal from "././context/modal/Modal";
import '././context/modal/modal.css';
import RidePage from "./pages/RidePage/RidePage";
import RidesOverview from "./pages/RideOverviewPage/RidesOverview";
import PrivateRoute from "./components/PrivateRoute";
import Special from "./components/special/Special";
import Footer from "./components/footer/Footer";
import ProfileTest from "./pages/Profile/ProfileTest";
import ProfileTest2 from "./pages/Profile/ProfileTest2";
import ProfileTest3 from "./pages/Profile/ProfileTest3";
import RideOverviewTest from "./pages/RideOverviewPage/RideOverviewTest";
import RidePageTest from "./pages/RidePage/RidePageTest";
import Confirmation from "./pages/Confirmation/Confirmation";
import MyMessages from "./pages/MyMessages/MyMessages";
import MyRides from "./pages/MyRides/MyRides";


function App() {
    const {isAuth} = useContext(AuthContext);

    return (
        <>
            <NavBar/>
            <div className="content">
                <Switch>

                    <Route exact path="/">
                        <Home/>
                    </Route>

                    {/*<Route path="/profile">*/}
                    {/*  {isAuth ? <Profile /> : <Redirect to="/signin" />}*/}
                    {/*</Route>*/}

                    <Route path="/profile">
                        <PrivateRoute auth={isAuth}>
                            <ProfileTest3/>
                        </PrivateRoute>
                    </Route>

                    <Route exact path="/signin">
                        <SignIn/>
                    </Route>

                    <Route exact path="/signup">
                        <SignUp/>
                        {/*  <SignUpTest/>*/}
                    </Route>

                    <Route exact path="/my-rides">
                        <MyRides/>
                    </Route>

                    <Route path="/my-messages">
                        <MyMessages/>
                    </Route>

                    <Route path="/ride/:id">
                        <RidePageTest/>
                    </Route>


                    <Route path="/confirmation/:type/:success" component={Confirmation}/>


                    {/*<Route path="/rides" >*/}
                    {/*  <RidesOverview />*/}
                    {/*</Route>*/}

                    {/*<Route path="/rides" render={(props) => <RidesOverview {...props} />} />*/}
                    <Route path="/rides" render={(props) => <RideOverviewTest {...props} />}/>


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
