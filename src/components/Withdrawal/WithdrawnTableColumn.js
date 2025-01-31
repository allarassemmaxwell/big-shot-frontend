import React from 'react';
import formatDate from 'utils/formatDate';

const WithdrawnTableColumn = () => {
    return [
        { name: 'Phone Number', selector: row => row.phone_number, sortable: true },
        { name: 'Service Code', selector: row => row.service_code, sortable: true },
        { name: 'Reference', selector: row => row.transaction_id, sortable: true },
        { name: 'Stake', selector: row => `Ksh ${parseFloat(row.bet_stake).toLocaleString()}`, sortable: true },
        { name: 'Won Amount', selector: row => `Ksh ${parseFloat(row.amount).toLocaleString()}`, sortable: true },
        { name: 'Created At', selector: row => formatDate(row.created_at), sortable: true },
        { name: 'Updated At', selector: row => formatDate(row.updated_at), sortable: true },
    ];
};

export default WithdrawnTableColumn;
