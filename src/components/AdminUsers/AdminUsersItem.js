import React from "react";
import {
    Badge,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
} from "reactstrap";
import formatDate from "utils/formatDate";

const AdminUsersItem = ({ item, handleStatusChange, handleDeleteUser }) => {
    return (
        <tr>
            <th scope="row">
                <Media className="align-items-center">
                    <a
                        className="avatar rounded-circle mr-3"
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                    >
                        <img
                            alt="..."
                            src={require("../../assets/img/brand/favicon.png")}
                        />
                    </a>
                    <Media>
                        {item.first_name && item.last_name ? (
                            <span className="mb-0 text-sm font-weight-bold">
                                {item.first_name} {item.last_name}
                            </span>
                        ) : (
                            <span className="mb-0 text-sm font-weight-bold">Name Missing</span>
                        )}
                    </Media>
                </Media>
            </th>
            <td>{item.email}</td>
            <td>
                <Badge color="" className="badge-dot mr-4">
                    {formatDate(item.created_at)}
                </Badge>
            </td>
            <td>
                <Badge color="" className="badge-dot mr-4">
                    {formatDate(item.updated_at)}
                </Badge>
            </td>
            <td>
                <Badge color="" className="badge-dot mr-4">
                    <i className={item.is_active ? "bg-success" : "bg-warning"} />
                    {item.is_active ? "Active" : "Inactive"}
                </Badge>
            </td>
            <td className="text-right">
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
                            onClick={() => handleStatusChange(item.id)}
                        >
                            {item.is_active ? "Inactive" : "Active"}
                        </DropdownItem>
                        <DropdownItem
                            href="#pablo"
                            onClick={() => handleDeleteUser(item.id)}
                        >
                            Delete
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </td>

        </tr>
    );
};

export default AdminUsersItem;
