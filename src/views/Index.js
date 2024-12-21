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
import React, { useEffect, useState } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
} from "reactstrap";
import axios from 'axios';
import { BASE_URL, LOADING } from "../constant";
// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import DashboardNavBar from "components/Dashboard/DashboardNavBar";
import DashboardItem from "components/Dashboard/DashboardItem";

const Index = (props) => {
    const [activeNav, setActiveNav] = useState(1);
    const [chartExample1Data, setChartExample1Data] = useState("data1");

    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for metrics
    const [uniqueWinners, setUniqueWinners] = useState(0);
    const [totalStakes, setTotalStakes] = useState(0);
    const [totalWonAmount, setTotalWonAmount] = useState(0);

    useEffect(() => {
        const fetchSms = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/bets/`);
                const betData = response.data;

                // Store all bets
                setBets(betData);

                // Filter bets where won is true
                const wonBets = betData.filter((bet) => bet.won);

                // Calculate unique winners using a Set based on phone_number
                const uniqueWinnerNumbers = new Set(wonBets.map((bet) => bet.phone_number));

                // Calculate total stakes for all bets
                const totalStakesValue = betData.reduce(
                    (acc, bet) => acc + parseFloat(bet.stake),
                    0
                );

                // Calculate total won amount for bets where won is true
                const totalWonValue = wonBets.reduce(
                    (acc, bet) => acc + parseFloat(bet.won_amount),
                    0
                );

                // Update state
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



  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

    const toggleNavs = (e, index) => {
        e.preventDefault();
        setActiveNav(index);
        setChartExample1Data("data" + index);
    };
    return (
        <>
           <DashboardNavBar
           uniqueWinners={uniqueWinners}
           totalStakes={totalStakes}
           totalWonAmount={totalWonAmount}
           />

            {/* Page content */}
            <Container className="mt--7" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">Bets</h3>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                    <th scope="col">Phone Number</th>
                                    <th scope="col">Chosen Box</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Stake</th>
                                    <th scope="col">Won Amount</th>
                                    <th scope="col">Created At</th>
                                    <th scope="col">Updated At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bets.length > 0 ? (
                                        bets.map((item, index) => (
                                            <DashboardItem key={index} item={item} />
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

export default Index;
