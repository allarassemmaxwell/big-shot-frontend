
import Index from "views/Index.js";
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
        path: "",
        name: "Dashboard",
        icon: "ni ni-tv-2 text-primary",
        component: <Index />,
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
        path: "/",
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
