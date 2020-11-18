import React from 'react';

import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ authorized, redirect, ...props }) => {
    if (authorized) {
        return <Route {...props} />;
    } else {
        return <Redirect tp={redirect} />;
    }
};

export default ProtectedRoute;