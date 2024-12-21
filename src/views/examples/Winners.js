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
import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    Table,
    Container,
    Row,
    Col
  } from "reactstrap";
  import axios from 'axios';
  import { BASE_URL, LOADING } from "constant";
import WinnerItem from "components/Winners/WinnerItem";
import WinnerNavBar from "components/Winners/WinnerNavBar";
  // core components
  
  const Winners = () => {
    const [winners, setWinners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for the counts of each SMS status
    const [uniqueWinners, setUniqueWinners] = useState(0);
    const [totalStakes, setTotalStakes] = useState(0);
    const [totalWonAmount, setTotalWonAmount] = useState(0);

    useEffect(() => {
        const fetchSms = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/bets/`);
                const betData = response.data;

                // Filter bets where won is true
                const wonBets = betData.filter((bet) => bet.won);

                // Calculate unique winners using a Set based on phone_number
                const uniqueWinnerNumbers = new Set(wonBets.map((bet) => bet.phone_number));

                // Calculate total values
                const totalStakesValue = wonBets.reduce(
                    (acc, bet) => acc + parseFloat(bet.stake),
                    0
                );
                const totalWonValue = wonBets.reduce(
                    (acc, bet) => acc + parseFloat(bet.won_amount),
                    0
                );

                // Update state
                setWinners(wonBets);
                setUniqueWinners(uniqueWinnerNumbers.size);
                setTotalStakes(totalStakesValue);
                setTotalWonAmount(totalWonValue);
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
            <WinnerNavBar 
            uniqueWinners={uniqueWinners}
            totalStakes={totalStakes}
            totalWonAmount={totalWonAmount}
            />
            {/* Page content */}
            <Container className="mt--7" fluid>
                {/* Table */}
                <Row>
                    <div className="col">
                    <Card className="shadow">
                        <CardHeader className="border-0">
                            <h3 className="mb-0">Winners</h3>
                        </CardHeader>
                        <Table className="align-items-center table-flush" responsive>
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Phone Number</th>
                                    <th scope="col">Chosen Box</th>
                                    <th scope="col">Stake</th>
                                    <th scope="col">Won Amount</th>
                                    <th scope="col">Created At</th>
                                    <th scope="col">Updated At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {winners.length > 0 ? (
                                    winners.map((item, index) => (
                                        <WinnerItem key={index} item={item} />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center", fontSize: "1.2rem", padding: "20px" }}>
                                            No Winner records available
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
  
  export default Winners;
  