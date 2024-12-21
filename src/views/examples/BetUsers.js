/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// reactstrap components
import {
    Card,
    CardHeader,
    Table,
    Container,
    Row,
} from "reactstrap";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { BASE_URL, LOADING } from "constant";
import BetUserItem from "components/BetUsers/BetUserItem";
import BetUserNavBar from "components/BetUsers/BetUserNavBar";

  // core components
  
  const BetUsers = () => {
    const [betUsers, setBetUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for the counts
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalWon, setTotalWon] = useState(0);
    const [totalLoss, setTotalLoss] = useState(0);
    
    useEffect(() => {
        const fetchSms = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/bet-users/`);
                const betUserData = response.data;
                setBetUsers(betUserData);

                // Calculate totals
                const usersCount = betUserData.length;
                const won = betUserData.reduce((sum, user) => sum + user.total_won, 0);
                const loss = betUserData.reduce((sum, user) => sum + (user.total_stake - user.total_won), 0);

                setTotalUsers(usersCount);
                setTotalWon(won);
                setTotalLoss(loss);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSms();
    }, []);

    if (loading) return <p>{LOADING}</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <BetUserNavBar
                totalUsers={totalUsers}
                totalWon={totalWon}
                totalLoss={totalLoss}
            />

            {/* Page content */}
            <Container className="mt--7" fluid>
            {/* Table */}
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="bg-transparent border-0">
                                <h3 className="mb-0">Bet Users</h3>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Phone Number</th>
                                        <th scope="col">Total Stakes</th>
                                        <th scope="col">Total Won</th>
                                        <th scope="col">Created At</th>
                                        <th scope="col">Updated At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {betUsers.length > 0 ? (
                                            betUsers.map((item, index) => (
                                                <BetUserItem key={index} item={item} />
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: "center", fontSize: "1.2rem", padding: "20px" }}>
                                                    No SMS records available
                                                </td>
                                            </tr>
                                        )}
                                </tbody>
                            </Table>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
};
  
  export default BetUsers;
  