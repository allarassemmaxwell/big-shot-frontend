// components/BetUsers/BetUserTableColumns.js

import React from 'react';
import formatDate from 'utils/formatDate';

const BetUserTableColumns = () => {
  return [
    { name: 'Phone Number', selector: row => row.phone_number, sortable: true,},
    { name: 'Total Stakes', selector: row => `Ksh ${parseFloat(row.total_stake).toLocaleString()}`, sortable: true },
    { name: 'Total Won', selector: row => `Ksh ${parseFloat(row.total_won).toLocaleString()}`, sortable: true },
    { name: 'Total Withdrawals', selector: row => `Ksh ${parseFloat(row.total_withdrawn).toLocaleString()}`, sortable: true },
    { name: 'Created At', selector: row => formatDate(row.created_at), sortable: true },
    { name: 'Updated At', selector: row => formatDate(row.created_at), sortable: true },
  ];
};

export default BetUserTableColumns;
