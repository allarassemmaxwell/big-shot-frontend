import React, { useEffect, useState } from "react";
import { Card, CardHeader, Container, Row, Modal, ModalHeader, ModalBody, ModalFooter, Button, Input } from "reactstrap";
import axios from './../../utils/api';
import { BASE_URL } from "constant";
import AdminUsersNavbar from "components/AdminUsers/AdminUsersNavbar";
// import LoadingSpinner from "components/LoadingSpinner/";
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import AdminUserTableColumns from "components/AdminUsers/AdminUsersTableColumn";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalUsers, setTotalUsers] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);
    const [inactiveUsers, setInactiveUsers] = useState(0);
    
    // Modal state for updating user info
    const [updateModal, setUpdateModal] = useState(false);
    const [userToUpdate, setUserToUpdate] = useState(null);
    const [updatedUserData, setUpdatedUserData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: ""
    });

    const handleStatusChange = async (userId) => {
        const user = users.find(user => user.id === userId);
        if (!user) return;

        const fullName = user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`
            : "Unknown User";

        Swal.fire({
            title: `Are you sure you want to change the status of ${fullName}?`,
            text: "This action is reversible.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const updatedUser = { ...user, is_active: !user.is_active };
                    await axios.put(`${BASE_URL}/admin-users/${userId}/`, updatedUser);
                    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? updatedUser : u));

                    const activeUsersCount = users.filter(user => user.is_active).length;
                    const inactiveUsersCount = users.length - activeUsersCount;
                    setActiveUsers(activeUsersCount);
                    setInactiveUsers(inactiveUsersCount);

                    toast.success(`${fullName}'s status has been changed successfully.`);
                } catch (err) {
                    toast.error('Failed to change the status');
                }
            }
        });
    };

    const handleDeleteUser = async (userId) => {
        const user = users.find(user => user.id === userId);
        if (!user) return;

        const fullName = user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`
            : "Unknown User";

        Swal.fire({
            title: `Are you sure you want to delete ${fullName}?`,
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${BASE_URL}/admin-users/${userId}/`);
                    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));

                    const activeUsersCount = users.filter(user => user.is_active).length;
                    const inactiveUsersCount = users.length - activeUsersCount;
                    setActiveUsers(activeUsersCount);
                    setInactiveUsers(inactiveUsersCount);

                    toast.success(`${fullName} has been deleted successfully.`);
                } catch (err) {
                    toast.error('Failed to delete user.');
                }
            }
        });
    };

    // Function to handle updating the user
    const handleUpdateUser = (user) => {
        setUserToUpdate(user);
        setUpdatedUserData({
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
            phone_number: user.phone_number || ""
        });
        setUpdateModal(true);
    };

    const handleSaveUpdatedUser = async () => {
        // Validate form data
        const { first_name, last_name } = updatedUserData;
        const { email } = updatedUserData;
        if (!first_name || !last_name) {
            toast.error('First Name and Last Name are required!');
            return;
        }
        if (!email) {
            toast.error('Email is required!');
            return;
        }
        // Check if the email format is valid
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address!');
            return;
        }
        try {
            const updatedUser = { ...userToUpdate, ...updatedUserData };
            await axios.put(`${BASE_URL}/admin-users/${userToUpdate.id}/`, updatedUser);
            setUsers(prevUsers => prevUsers.map(u => u.id === userToUpdate.id ? updatedUser : u));
            setUpdateModal(false);
            toast.success('User updated successfully.');
        } catch (err) {
            toast.error('Failed to update user.');
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/admin-users/`);
                const userData = response.data;
                setUsers(userData);

                const totalUsers = userData.length;
                const activeUsers = userData.filter(user => user.is_active).length;
                const inactiveUsers = totalUsers - activeUsers;

                setTotalUsers(totalUsers);
                setActiveUsers(activeUsers);
                setInactiveUsers(inactiveUsers);
            } catch (err) {
                toast.error(`Error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const columns = AdminUserTableColumns({ handleStatusChange, handleDeleteUser, handleUpdateUser });

    // if (loading) return <LoadingSpinner />;

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
                                <h3 className="mb-0">Admin Users</h3>
                            </CardHeader>
                            <DataTable
                                title="Admin Users List"
                                columns={columns}
                                data={users}
                                pagination
                                paginationPerPage={20}
                                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                highlightOnHover
                                fixedHeader
                                responsive
                            />
                        </Card>
                    </div>
                </Row>
            </Container>

            {/* Modal for updating user */}
            <Modal isOpen={updateModal} toggle={() => setUpdateModal(false)}>
                <ModalHeader toggle={() => setUpdateModal(false)}>Update User</ModalHeader>
                <ModalBody>
                    <Input
                        type="text"
                        value={updatedUserData.first_name}
                        onChange={(e) => setUpdatedUserData({ ...updatedUserData, first_name: e.target.value })}
                        placeholder="First Name"
                        style={{ marginBottom: '10px' }}
                    />
                    <Input
                        type="text"
                        value={updatedUserData.last_name}
                        onChange={(e) => setUpdatedUserData({ ...updatedUserData, last_name: e.target.value })}
                        placeholder="Last Name"
                        style={{ marginBottom: '10px' }}
                    />
                    <Input
                        type="email"
                        value={updatedUserData.email}
                        onChange={(e) => setUpdatedUserData({ ...updatedUserData, email: e.target.value })}
                        placeholder="Email"
                        style={{ marginBottom: '10px' }}
                    />
                    <Input
                        type="text"
                        value={updatedUserData.phone_number}
                        onChange={(e) => setUpdatedUserData({ ...updatedUserData, phone_number: e.target.value })}
                        placeholder="Phone Number"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => setUpdateModal(false)}>Cancel</Button>
                    <Button color="primary" onClick={handleSaveUpdatedUser}>Save Changes</Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default AdminUsers;
