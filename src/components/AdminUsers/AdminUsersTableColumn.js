// components/AdminUsers/AdminUserTableColumns.js

import React from 'react';
import { Badge, Media, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import formatDate from 'utils/formatDate';

const AdminUserTableColumns = ({ handleStatusChange, handleDeleteUser, handleUpdateUser }) => {
    return [
        {
        name: 'Name',
        selector: row => (
            <Media className="align-items-center">
                <a
                    className="avatar rounded-circle mr-3"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                >
                    <img
                        alt={row.first_name && row.last_name?row.first_name && row.last_name: 'Name Missing'}
                        src={require("../../assets/img/brand/favicon.png")}
                    />
                </a>
                <Media>
                    {row.first_name && row.last_name ? (
                        <span className="mb-0 text-sm font-weight-bold">
                            {row.first_name} {row.last_name}
                        </span>
                    ) : (
                        <span className="mb-0 text-sm font-weight-bold">Name Missing</span>
                    )}
                </Media>
            </Media>
        ),
        sortable: true,
        },
        {name: 'Email', selector: row => row.email, sortable: true },
        {
            name: 'Phone Number',
            selector: row => row.phone_number,
            sortable: true,
            cell: row => (
            row.phone_number ? (
                <span className="text-sm">{row.phone_number}</span>
            ) : (
                <span className="text-sm text-muted">Missing</span>
            )
            ),
        },      
        {
            name: 'Status',
            selector: row => (
            <Badge color='' className="badge-dot mr-4">
                <i className={row.is_active ? "bg-success" : "bg-warning"} />
                {row.is_active ? "Active" : "Inactive"}
            </Badge>
            ),
            sortable: true,
        },
        { name: 'Created At', selector: row => formatDate(row.created_at), sortable: true },
        {
            name: 'Actions',
            button: true,
            cell: row => (
                <>
                    <UncontrolledDropdown>
                        <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#pablo"
                            role="button"
                            size="sm"
                            color=""
                            onClick={(e) => e.preventDefault()}
                        >
                            <i className="fas fa-ellipsis-v" />
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem
                                href="#pablo"
                                onClick={() => handleStatusChange(row.id)}
                            >
                                {row.is_active ? "Inactive" : "Active"}
                            </DropdownItem>
                            <DropdownItem
                                href="#pablo"
                                onClick={() => handleDeleteUser(row.id)}
                            >
                                Delete
                            </DropdownItem>
                            <DropdownItem
                                href="#pablo"
                                onClick={() => handleUpdateUser(row)}
                            >
                                Update
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </>
            ),
        }
    ];
};

export default AdminUserTableColumns;
