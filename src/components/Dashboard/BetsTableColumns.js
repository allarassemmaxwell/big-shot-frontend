// src/components/BetsTableColumns.js
import React from "react";
import { Badge } from "reactstrap";
import formatDate from "utils/formatDate";

const BetsTableColumns = () => {
  return [
    { name: 'Phone Number', selector: row => row.phone_number, sortable: true },
    { name: 'Service Code', selector: row => row.service_code, sortable: true },
    { name: 'Chosen Box', selector: row => row.chosen_box, sortable: true },
    { name: 'Stake', selector: row => `Ksh ${parseFloat(row.stake).toLocaleString()}`, sortable: true },
    { 
      name: 'Status', 
      selector: row => (
        <Badge color="" className="badge-dot mr-4">
          <i className={row.won ? "bg-success" : "bg-danger"} />
          {row.won ? "Won" : "Lost"}
        </Badge>
      ), 
      sortable: true 
    },
    { name: 'Won Amount', selector: row => `Ksh ${parseFloat(row.won_amount).toLocaleString()}`, sortable: true },
    { 
      name: 'Withdrawn', 
      selector: row => (
        <td>
          <Badge color="" className="badge-dot mr-4">
            <i
              className={
                row.withdrawal_status === "Pending" ? "bg-yellow" : 
                row.withdrawal_status === "Withdrawn" ? "bg-success" : "bg-danger"
              }
            />
            {row.withdrawal_status}
          </Badge>
        </td>
      ),
      sortable: true 
    },
    { name: 'Created At', selector: row => formatDate(row.created_at), sortable: true },
  ];
};

export default BetsTableColumns;
