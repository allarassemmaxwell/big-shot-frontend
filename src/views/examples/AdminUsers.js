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
// reactstrap components
import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    Table,
    Container,
    Row
} from "reactstrap";
import axios from 'axios';
import { BASE_URL, LOADING } from "constant";
import AdminUsersItem from "components/AdminUsers/AdminUsersItem";
import AdminUsersNavbar from "components/AdminUsers/AdminUsersNavbar";

import { toast } from 'react-toastify';

import Swal from 'sweetalert2';


const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [totalUsers, setTotalUsers] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);
    const [inactiveUsers, setInactiveUsers] = useState(0);

    const handleStatusChange = async (userId) => {
        try {
            const user = users.find(user => user.id === userId);
            if (user) {
                const updatedUser = { ...user, is_active: !user.is_active };
                await axios.put(`${BASE_URL}/users/${userId}/`, updatedUser);
                setUsers(prevUsers => prevUsers.map(u => u.id === userId ? updatedUser : u));
                const activeUsersCount = users.filter(user => user.is_active).length;
                const inactiveUsersCount = users.length - activeUsersCount;
                setActiveUsers(activeUsersCount);
                setInactiveUsers(inactiveUsersCount);
                toast.success('User status change successfully.');
            }
        } catch (err) {
            console.error('Failed to update user status', err);
            toast.error('Failed to update user status');
        }
    };

    const handleDeleteUser = async (userId) => {
        const user = users.find(user => user.id === userId);
        if (!user) return;

        Swal.fire({
            title: `Are you sure you want to delete ${user.first_name} ${user.last_name}?`,
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    axios.delete(`${BASE_URL}/users/${userId}/`);
                    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    
                    // Update counts after deletion
                    const activeUsersCount = users.filter(user => user.is_active).length;
                    const inactiveUsersCount = users.length - activeUsersCount;
                    setActiveUsers(activeUsersCount);
                    setInactiveUsers(inactiveUsersCount);
    
                    // Display success message
                    Swal.fire('Deleted!', 'User has been deleted.', 'success');
                } catch (err) {
                    console.error('Failed to delete user', err);
                    Swal.fire('Error!', 'Failed to delete user.', 'error');
                }
            }
        });
    };
    
    

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/users/`);
                const userData = response.data;
                setUsers(userData);

                // Calculate total users, active users, and inactive users
                const totalUsers = userData.length;
                const activeUsers = userData.filter(user => user.is_active).length;
                const inactiveUsers = totalUsers - activeUsers;

                // Update the state with calculated values
                setTotalUsers(totalUsers);
                setActiveUsers(activeUsers);
                setInactiveUsers(inactiveUsers);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <p>{LOADING}</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <AdminUsersNavbar
                totalUsers={totalUsers}
                activeUsers={activeUsers}
                inactiveUsers={inactiveUsers}
            />
            <Container className="mt--7" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="bg-transparent border-0">
                                <h3 className="mb-0">Users</h3>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Created At</th>
                                        <th scope="col">Updated At</th>
                                        <th scope="col">Status</th>
                                        <th scope="col" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? (
                                        users.map((item) => (
                                            <AdminUsersItem key={item.id} item={item} handleStatusChange={handleStatusChange} handleDeleteUser={handleDeleteUser} />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: "center", fontSize: "1.2rem", padding: "20px" }}>
                                                No Admin records available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
};

export default AdminUsers;
