// SmsItem.js
import React from "react";
import { Badge, Media } from "reactstrap";
import formatDate from "utils/formatDate";

const WithdrawalItem = ({ item }) => {
    return (
        <>
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
                        <span className="mb-0 text-sm">{item.phone_number}</span>
                    </Media>
                    </Media>
                </th>
                <td>
                    {item.transaction_id}
                </td>
                <td>
                    {item.service_code}
                </td>
                <td>
                    KSH {item.bet_stake}
                </td>
                <td>
                    KSH {item.amount}
                </td>
                <td>
                    <Badge color="" className="badge-dot mr-4">
                    <i
                        className={
                        item.status === "Pending" ? "bg-yellow" : 
                        item.status === "Completed" ? "bg-success" : "bg-danger"
                        }
                    />
                    {item.status}
                    </Badge>
                </td>
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
            </tr>
        </>
    )
}

export default WithdrawalItem
