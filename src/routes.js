/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
import Winners from "views/examples/Winners.js";
import Users from "views/examples/Users.js";
import Login from "views/examples/Login.js";
import Profile from "views/examples/Profile.js";

var routes = [
    {
        path: "/index",
        name: "Dashboard",
        icon: "ni ni-tv-2 text-primary",
        component: <Index />,
        layout: "/admin",
    },
    {
        path: "/winners",
        name: "Winners",
        icon: "ni ni-trophy text-success",
        component: <Winners />,
        layout: "/admin",
    },
    {
        path: "/users",
        name: "Users",
        icon: "ni ni-single-02 text-yellow",
        component: <Users />,
        layout: "/admin",
    },
    {
        path: "/profile",
        name: "Profile",
        icon: "ni ni-single-02 text-primary",
        component: <Profile />,
        layout: "/admin",
    },
    {
        path: "/login",
        name: "Log Out",
        icon: "ni ni-user-run text-red",
        component: <Login />,
        layout: "/auth",
    },
];
export default routes;
