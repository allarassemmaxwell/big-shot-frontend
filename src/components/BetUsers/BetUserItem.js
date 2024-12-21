// SmsItem.js
import React from "react";
import { Badge, Media } from "reactstrap";
import formatDate from "utils/formatDate";

const BetUserItem = ({ item }) => {
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
                    src={require("../../assets/img/theme/profile-cover.jpg")}
                    />
                </a>
                <Media>
                    <span className="mb-0 text-sm">{item.phone_number}</span>
                </Media>
                </Media>
            </th>
            <td>
                KSH {item.total_stake}
            </td>
            <td>
                KSH {item.total_won}
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
    );
};

export default BetUserItem;
