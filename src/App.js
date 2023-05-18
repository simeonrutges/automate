import React, {useContext} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import NavBar from '././components/navbar/NavBar';
import Profile from '././pages/Profile/Profile';
import Home from '././pages/home/Home';
import SignIn from '././pages/signIn/SignIn';
import SignUp from '././pages/signUp/SignUp';
import {AuthContext} from './context/AuthContext';
import './App.css';
import '././context/modal/modal.css';
import RidePage from "./pages/RidePage/RidePage";
import RidesOverview from "./pages/RideOverviewPage/RidesOverview";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/footer/Footer";
import RideOverviewTest from "./pages/RideOverviewPage/RideOverviewTest";
import RidePageTest from "./pages/RidePage/RidePageTest";
import Confirmation from "./pages/Confirmation/Confirmation";
import MyMessages from "./pages/MyMessages/MyMessages";
import MyRides from "./pages/MyRides/MyRides";
import RideDetails from "./pages/RideDetails/RideDetails";
import MessageDetail from "./pages/MessageDetail/MessageDetail";


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

                    {/*11/5exact erbij*/}
                    <Route exact path="/profile">
                        <PrivateRoute auth={isAuth}>
                            <Profile/>
                        </PrivateRoute>
                    </Route>

                    //////// test 11/5. morgen misschien aparte pag maken

                    <Route exact path="/profile/:username">
                        <PrivateRoute auth={isAuth}>
                            <Profile/>
                        </PrivateRoute>
                    </Route>

                    //////


                    <Route exact path="/signin">
                        <SignIn/>
                    </Route>

                    <Route exact path="/signup">
                        <SignUp/>
                    </Route>

                    <Route exact path="/my-rides">
                        <MyRides/>
                    </Route>

                    {/*///*/}
                    <Route exact path="/my-rides/:rideId">
                        <RideDetails/>
                    </Route>
                    {/*///*/}

                    <Route exact path="/my-messages/:username">
                        <MessageDetail/>
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
            <Footer/>
        </>
    );
}

export default App;
