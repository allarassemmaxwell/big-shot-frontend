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
import AdminUsers from "views/examples/AdminUsers.js";
import Login from "views/examples/Login.js";
import Logout from "views/examples/Logout";
import Profile from "views/examples/Profile.js";
import BetUsers from "views/examples/BetUsers";
import Transactions from "views/examples/Transactions";
import Sms from "views/examples/Sms";
import Withdrawal from "views/examples/Withdrawal";
import ChangePassword from "views/examples/ChangePassword";

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
        path: "/transactions",
        name: "Transactions",
        icon: "ni ni-money-coins text-success",
        component: <Transactions />,
        layout: "/admin",
    },
    {
        path: "/withdrawals",
        name: "Withdrawals",
        icon: "ni ni-money-coins text-success",
        component: <Withdrawal />,
        layout: "/admin",
    },
    {
        path: "/sms",
        name: "Sms",
        icon: "ni ni-send text-success",
        component: <Sms />,
        layout: "/admin",
    },
    {
        path: "/bet-users",
        name: "Bet Users",
        icon: "ni ni-single-02 text-yellow",
        component: <BetUsers />,
        layout: "/admin",
    },
    {
        path: "/admin-users",
        name: "Admin Users",
        icon: "ni ni-single-02 text-yellow",
        component: <AdminUsers />,
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
        path: "/change-password",
        name: "Change Password",
        icon: "ni ni-key-25 text-primary",
        component: <ChangePassword />,
        layout: "/admin",
    },
    {
        path: "/login",
        name: "Log In",
        icon: "ni ni-user-run text-red",
        component: <Login />,
        layout: "/auth",
    },
    {
        path: "/logout",
        name: "Log Out",
        icon: "ni ni-user-run text-red",
        component: <Logout />,
        layout: "/auth",
    },
];
export default routes;
