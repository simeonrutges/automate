import React from 'react';
import {Redirect, Route} from "react-router-dom";

function PrivateRoute({auth, children, ...rest }) {
    if (!auth) {
        return <Redirect to="/signin"/>
    }
    return children;
    //     <Route {...rest}>
    //         {auth === true ? {children} : <Redirect to="/signin"/>}
    //     </Route>
    // );

}
export default PrivateRoute;