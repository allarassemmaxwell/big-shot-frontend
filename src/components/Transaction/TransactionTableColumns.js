import React from 'react';
import { Badge } from 'reactstrap';
import formatDate from 'utils/formatDate';

const TransactionTableColumns = () => {
    return [
        { name: 'Phone Number', selector: row => row.phone_number, sortable: true },
        { name: 'Service Code', selector: row => row.service_code, sortable: true },
        { name: 'Reference', selector: row => row.receipt_number, sortable: true },
        {
        name: 'Status',
            selector: row => (
                <td>
                    <Badge color="" className="badge-dot mr-4">
                        <i
                        className={
                            row.transaction_status === "Pending"
                            ? "bg-yellow"
                            : row.transaction_status === "Completed"
                            ? "bg-success"
                            : "bg-danger"
                        }
                        />
                        {row.transaction_status}
                    </Badge>
                </td>
            ),
            sortable: true
        },
        { name: 'Amount', selector: row => `Ksh ${parseFloat(row.amount).toLocaleString()}`, sortable: true },
        { name: 'Created At', selector: row => formatDate(row.created_at), sortable: true },
        { name: 'Updated At', selector: row => formatDate(row.updated_at), sortable: true },
    ];
};

export default TransactionTableColumns;
