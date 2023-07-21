import React from 'react';
import {Redirect, Route} from "react-router-dom";

function PrivateRoute({auth, children, ...rest }) {
    if (!auth) {
        return <Redirect to="/signin"/>
    }
    return children;
}
export default PrivateRoute;