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
import Notification from "./pages/Notifications/Notification";

// function App() {
//     const {isAuth} = useContext(AuthContext);
//
//     return (
//         <>
//             <NavBar/>
//             <div className="content">
//                 <Switch>
//                     <Route exact path="/">
//                         <Home/>
//                     </Route>
//
//                     <Route exact path="/profile">
//                         <PrivateRoute auth={isAuth}>
//                             <Profile/>
//                         </PrivateRoute>
//                     </Route>
//
//                     <Route exact path="/profile/:username">
//                         <PrivateRoute auth={isAuth}>
//                             <Profile/>
//                         </PrivateRoute>
//                     </Route>
//
//
//                     <Route exact path="/signin">
//                         <SignIn/>
//                     </Route>
//
//                     <Route exact path="/signup">
//                         <SignUp/>
//                     </Route>
//
//                     <Route exact path="/my-rides">
//                         <MyRides/>
//                     </Route>
//
//                     {/*///*/}
//                     <Route exact path="/my-rides/:rideId">
//                         <RideDetails/>
//                     </Route>
//                     {/*///*/}
//
//                     <Route exact path="/my-messages/:username">
//                         <MessageDetail/>
//                     </Route>
//
//                     <Route path="/my-messages">
//                         <MyMessages/>
//                     </Route>
//
//                     <Route path="/ride/:id">
//                         <RidePageTest/>
//                     </Route>
//
//                     {/*hier een ride s achtergzet*/}
//                     <Route exact path="/rides/:id">
//                     <RidePageTest/>
//                 </Route>
//
//                     {/*<Route path="/confirmation/:type/:success" component={Confirmation}/>*/}
//                     <Route path="/confirmation/:type/:success">
//                         <Confirmation />
//                     </Route>
//
//
//
//
//                     {/*<Route path="/rides">*/}
//                     {/*    <RidesOverview/>*/}
//                     {/*</Route>*/}
//                     <Route path="/rides" render={(props) => <RidesOverview {...props} />}/>
//
//                     {/*<Route path="/rides" render={(props) => <RideOverviewTest {...props} />}/>*/}
//
//                     {/*<Route path="/rides" >*/}
//                     {/*    <RideOverviewTest/>}/>*/}
//                     {/*</Route>*/}
//
//                     {/*<Route exact path="/my-notifications/:id">*/}
//                     {/*    <PrivateRoute auth={isAuth}>*/}
//                     {/*        <Notification/>*/}
//                     {/*    </PrivateRoute>*/}
//                     {/*</Route>*/}
//                     <Route exact path="/my-notifications/:id" component={Notification} />
//
//
//
//                 </Switch>
//             </div>
//             <Footer/>
//         </>
//     );
// }
//
// export default App;
// hierboven was het tot 16/6
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

                    {/*///*/}
                    <Route exact path="/my-rides/:rideId">
                        <PrivateRoute auth={isAuth}>
                            <RideDetails/>
                        </PrivateRoute>
                    </Route>
                    {/*///*/}

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
                            <RidePageTest/>
                        </PrivateRoute>
                    </Route>

                    {/*hier een ride s achtergzet*/}
                    <Route exact path="/rides/:id">
                        <PrivateRoute auth={isAuth}>
                            <RidePageTest/>
                        </PrivateRoute>
                    </Route>

                    {/*<Route path="/confirmation/:type/:success" component={Confirmation}/>*/}
                    <Route path="/confirmation/:type/:success">
                        <PrivateRoute auth={isAuth}>
                            <Confirmation/>
                        </PrivateRoute>
                    </Route>

                    <Route path="/rides" render={(props) => <RidesOverview {...props} />}/>

                    <Route exact path="/my-notifications/:id" component={Notification}/>

                    {/*TESTEN! 15/6*/}
                    {/*<PrivateRoute exact path="/my-notifications/:id" auth={isAuth}>*/}
                    {/*    {props => <Notification {...props} />}*/}
                    {/*</PrivateRoute>*/}

                </Switch>
            </div>
            <Footer/>
        </>
    );
}

export default App;
