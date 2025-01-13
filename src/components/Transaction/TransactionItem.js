// SmsItem.js
import React from "react";
import { Badge, Media } from "reactstrap";
import formatDate from "utils/formatDate";

const TransactionItem = ({ item }) => {
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
                    {item.receipt_number}
                </td>
                <td>
                    <Badge color="" className="badge-dot mr-4">
                    <i
                        className={
                        item.transaction_status === "Pending" ? "bg-yellow" : 
                        item.transaction_status === "Completed" ? "bg-success" : "bg-danger"
                        }
                    />
                    {item.transaction_status}
                    </Badge>
                </td>
                <td>
                    KSH {item.amount}
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

export default TransactionItem
