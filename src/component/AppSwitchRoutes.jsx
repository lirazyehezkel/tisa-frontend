import React from 'react';
import {Switch, Route} from "react-router-dom";
import {Routes} from '../constants/routes';
import {Redirect} from "react-router";
import Browse from "./Browse/Browse";

const AppSwitchRoutes = () => {
    return <Switch>
        <Route exact path="/">
            <Redirect to={Routes.BROWSE}/>
        </Route>
        <Route exact path={Routes.BROWSE}>
            <Browse/>
        </Route>
        <Route path={Routes.FLIGHT_DETAILS}>
            <div>
                flight details
            </div>
        </Route>
        <Route path={Routes.PROFILE}>
            <div>
                profile
            </div>
        </Route>
        <Route path={Routes.AIRLINE}>
            <div>
                airline
            </div>
        </Route>
        <Route path={Routes.SETTINGS}>
            <div>
                settings
            </div>
        </Route>
    </Switch>
}

export default AppSwitchRoutes;