import React, {useContext} from 'react';
import {Switch, Route} from 'react-router-dom';
import NavBar from '././components/navbar/NavBar';
import Profile from '././pages/Profile/Profile';
import Home from '././pages/home/Home';
import SignIn from '././pages/signIn/SignIn';
import SignUp from '././pages/signUp/SignUp';
import {AuthContext} from './context/AuthContext';
import RidePage from "./pages/RidePage/RidePage";
import RidesOverview from "./pages/RideOverviewPage/RidesOverview";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/footer/Footer";
import Confirmation from "./pages/Confirmation/Confirmation";
import MyMessages from "./pages/MyMessages/MyMessages";
import MyRides from "./pages/MyRides/MyRides";
import RideDetails from "./pages/RideDetails/RideDetails";
import MessageDetail from "./pages/MessageDetail/MessageDetail";
import Notification from "./pages/Notifications/Notification";

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

                    <Route exact path="/profile">
                        <PrivateRoute auth={isAuth}>
                            <Profile/>
                        </PrivateRoute>
                    </Route>

                    <Route exact path="/profile/:username">
                        <PrivateRoute auth={isAuth}>
                            <Profile/>
                        </PrivateRoute>
                    </Route>

                    <Route exact path="/signin">
                        <SignIn/>
                    </Route>

                    <Route exact path="/signup">
                        <SignUp/>
                    </Route>

                    <Route exact path="/my-rides">
                        <PrivateRoute auth={isAuth}>
                            <MyRides/>
                        </PrivateRoute>
                    </Route>

                    <Route exact path="/my-rides/:rideId">
                        <PrivateRoute auth={isAuth}>
                            <RideDetails/>
                        </PrivateRoute>
                    </Route>

                    <Route exact path="/my-messages/:username">
                        <PrivateRoute auth={isAuth}>
                            <MessageDetail/>
                        </PrivateRoute>
                    </Route>

                    <Route path="/my-messages">
                        <PrivateRoute auth={isAuth}>
                            <MyMessages/>
                        </PrivateRoute>
                    </Route>

                    <Route path="/ride/:id">
                        <PrivateRoute auth={isAuth}>
                            <RidePage/>
                        </PrivateRoute>
                    </Route>

                    <Route exact path="/rides/:id">
                        <PrivateRoute auth={isAuth}>
                            <RidePage/>
                        </PrivateRoute>
                    </Route>

                    <Route path="/confirmation/:type/:success">
                        <PrivateRoute auth={isAuth}>
                            <Confirmation/>
                        </PrivateRoute>
                    </Route>

                    <Route path="/rides" render={(props) => <RidesOverview {...props} />}/>

                    <Route exact path="/my-notifications/:id" component={Notification}/>

                </Switch>
            </div>
            <Footer/>
        </>
    );
}

export default App;
