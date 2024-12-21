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
import TransactionItem from "components/Transaction/TransactionItem";
import TransactionNavBar from "components/Transaction/TransactionNavBar";
import {
    Card,
    CardHeader,
    Table,
    Container,
    Row,
  } from "reactstrap";
import axios from 'axios';
import { BASE_URL, LOADING } from "constant";
  // core components
  
    const Transactions = () => {
        const [transactions, setTransactions] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        // State for the counts of each SMS status
        const [completedCount, setCompletedCount] = useState(0);
        const [pendingCount, setPendingCount] = useState(0);
        const [failedCount, setFailedCount] = useState(0);

        useEffect(() => {
            const fetchSms = async () => {
                try {
                    const response = await axios.get(`${BASE_URL}/transactions/`);
                    const transactionsData = response.data;
                    setTransactions(transactionsData);

                    // Count the transaction_status of SMS messages
                    const completed = transactionsData.filter((item) => item.transaction_status === "Completed").length;
                    const pending = transactionsData.filter((item) => item.transaction_status === "Pending").length;
                    const failed = transactionsData.filter((item) => item.transaction_status === "Failed").length;

                    // Update the state with the counts
                    setCompletedCount(completed);
                    setPendingCount(pending);
                    setFailedCount(failed);
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
            <TransactionNavBar
                completedCount={completedCount}
                pendingCount={pendingCount}
                failedCount={failedCount}
            />

            {/* Page content */}
            <Container className="mt--7" fluid>
            {/* Table */}
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="bg-transparent border-0">
                                <h3 className="mb-0">Transactions</h3>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                    <th scope="col">Phone Number</th>
                                    <th scope="col">Reference</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Amount</th>
                                        <th scope="col">Created At</th>
                                        <th scope="col">Updated At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.length > 0 ? (
                                        transactions.map((item, index) => (
                                            <TransactionItem key={index} item={item} />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: "center", fontSize: "1.2rem", padding: "20px" }}>
                                                No Transaction records available
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
  
  export default Transactions;
  