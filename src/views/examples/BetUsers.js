// pages/BetUsers.js

import React, { useEffect, useState } from "react";
import { Card, CardHeader, Container, Row } from "reactstrap";
import axios from './../../utils/api';
import { BASE_URL } from "constant";
import BetUserNavBar from "components/BetUsers/BetUserNavBar";
import LoadingSpinner from "components/LoadingSpinner/";
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';
import ExportToExcel from "components/ExportToExcel/ExportToExcel";
import BetUserTableColumns from "components/BetUsers/BetUserTableColumn";

const BetUsers = () => {
  const [betUsers, setBetUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for the counts
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalWon, setTotalWon] = useState(0);
  const [totalLoss, setTotalLoss] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);

    useEffect(() => {
        const fetchBetUsers = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/bet-users/`);
                const betUserData = response.data;
                setBetUsers(betUserData);

                // Calculate totals
                const usersCount = betUserData.length;
                const won = betUserData.reduce((sum, user) => sum + user.total_won, 0);
                const loss = betUserData.reduce((sum, user) => sum + (user.total_stake - user.total_won), 0);
                const withdrawn = betUserData.reduce((sum, user) => sum + parseFloat(user.total_withdrawn), 0);

                setTotalUsers(usersCount);
                setTotalWon(won);
                setTotalLoss(loss);
                setTotalWithdrawn(withdrawn);
            } catch (err) {
                toast.error(`Error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchBetUsers();
    }, []);

  // Handle row click for more details
  const handleRowClick = (phone_number) => {
    console.log(`View details for user with phone: ${phone_number}`);
    // Implement your logic for displaying user details or opening a modal
  };

  // BetUser Table Columns
  const columns = BetUserTableColumns();

  // if (loading) return <LoadingSpinner />;

  return (
    <>
      <BetUserNavBar
        totalUsers={totalUsers}
        totalWon={totalWon}
        totalLoss={totalLoss}
        totalWithdrawn={totalWithdrawn}
      />
      <Container className="mt--7" fluid>
        <Row>
            <div className="col">
                <Card className="shadow">
                    <CardHeader className="bg-transparent border-0">
                        <h3 className="mb-0">Transactions</h3>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <ExportToExcel data={betUsers} filename="bet-users.xlsx" />
                        </div>
                    </CardHeader>
                    <div>
                        <DataTable
                            title="Bet Users List"
                            columns={columns}
                            data={betUsers}
                            pagination
                            paginationPerPage={52}
                            paginationRowsPerPageOptions={[10, 25, 50, 100]}
                            highlightOnHover
                            searchable
                            fixedHeader
                        />
                    </div>
                </Card>
            </div>
        </Row>
      </Container>
    </>
  );
};

export default BetUsers;
