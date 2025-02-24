import React, { useEffect, useState } from "react";
import { Card, CardHeader, Container, Row, Input } from "reactstrap";
import axios from './../utils/api';
import { BASE_URL } from "../constant";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import DashboardNavBar from "components/Dashboard/DashboardNavBar";
import DataTable from 'react-data-table-component'; 
// import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import BetsTableColumns from "components/Dashboard/BetsTableColumns";
import ExportToExcel from "components/ExportToExcel/ExportToExcel";
import { toast } from 'react-toastify';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Index = (props) => {
    const [filteredBets, setFilteredBets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timePeriod, setTimePeriod] = useState('daily');

    // State for metrics
    const [uniqueWinners, setUniqueWinners] = useState(0);
    const [totalStakes, setTotalStakes] = useState(0);
    const [totalWonAmount, setTotalWonAmount] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);

    // Define columns using the BetsTableColumns component
    const columns = BetsTableColumns();
    
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [chartData2, setChartData2] = useState({ labels: [], datasets: [] });

    // Function to filter data by selected time period
    const filterByTimePeriod = (data, period) => {
        const now = new Date();
        return data.filter((item) => {
            const createdAt = new Date(item.created_at);
            const diffTime = now - createdAt;
            switch (period) {
                case 'daily':
                    return diffTime <= 24 * 60 * 60 * 1000;
                case 'weekly':
                    return diffTime <= 7 * 24 * 60 * 60 * 1000;
                case 'monthly':
                    return diffTime <= 30 * 24 * 60 * 60 * 1000;
                case 'annually':
                    return diffTime <= 365 * 24 * 60 * 60 * 1000;
                default:
                    return true;
            }
        });
    };

    // Function to aggregate bets by service_code for total stake (lost bets)
    const aggregateBetsByServiceCode = (data) => {
        const aggregated = data.reduce((acc, item) => {
            if (!item.won) { // Consider only lost bets
                if (acc[item.service_code]) {
                    acc[item.service_code].total_stake += parseFloat(item.stake); // Add stake for lost bets
                } else {
                    acc[item.service_code] = { service_code: item.service_code, total_stake: parseFloat(item.stake) };
                }
            }
            return acc;
        }, {});

        const chartData = Object.values(aggregated).map(item => ({
            service_code: item.service_code,
            total_stake: item.total_stake,
        }));

        return chartData;
    };

    // Function to aggregate bets by service_code for total won amount (won bets)
    const aggregateWonAmountByServiceCode = (data) => {
        const aggregated = data.reduce((acc, item) => {
            if (item.won) { // Consider only won bets
                if (acc[item.service_code]) {
                    acc[item.service_code].total_won_amount += parseFloat(item.won_amount); // Add won_amount for won bets
                } else {
                    acc[item.service_code] = { service_code: item.service_code, total_won_amount: parseFloat(item.won_amount) };
                }
            }
            return acc;
        }, {});

        const chartData = Object.values(aggregated).map(item => ({
            service_code: item.service_code,
            total_won_amount: item.total_won_amount,
        }));

        return chartData;
    };

    // Function to calculate the Total Profit (Total stake where won is false)
    const calculateTotalProfit = (data) => {
        return data
            .filter((item) => !item.won) // Filter only lost bets
            .reduce((acc, item) => acc + parseFloat(item.stake), 0); // Sum up the stakes
    };

    // Fetch bets and filter by selected time period
    useEffect(() => {
        const fetchBets = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/bets/`);
                const betData = response.data;

                // Filter bets based on time period
                const filteredData = filterByTimePeriod(betData, timePeriod);
                setFilteredBets(filteredData);

                // Aggregate bets by service_code (only lost bets)
                const aggregatedData = aggregateBetsByServiceCode(filteredData);
                
                // Aggregate won amount by service_code (only won bets)
                const aggregatedWonAmountData = aggregateWonAmountByServiceCode(filteredData);

                // Calculate metrics
                const wonBets = filteredData.filter((bet) => bet.won);
                const uniqueWinnerNumbers = new Set(wonBets.map((bet) => bet.phone_number));
                const totalStakesValue = betData.reduce(
                    (acc, bet) => acc + parseFloat(bet.stake),
                    0
                );
                const totalWonValue = wonBets.reduce(
                    (acc, bet) => acc + parseFloat(bet.won_amount),
                    0
                );

                const totalProfitValue = calculateTotalProfit(filteredData); // Calculate Total Profit (lost bets stake)

                setUniqueWinners(uniqueWinnerNumbers.size);
                setTotalStakes(totalStakesValue);
                setTotalWonAmount(totalWonValue);

                // Set Total Profit value
                setTotalProfit(totalProfitValue);

                // Prepare chart data for total stake for lost bets by service_code
                setChartData({
                    labels: aggregatedData.map(item => item.service_code),
                    datasets: [
                        {
                            label: 'Total Profit per Service Code',
                            data: aggregatedData.map(item => item.total_stake),
                            backgroundColor: ['#42a5f5', '#ffeb3b', '#f44336'],
                            borderColor: ['#1e88e5', '#fbc02d', '#d32f2f'],
                            borderWidth: 1,
                        },
                    ],
                });

                // Prepare chart data for total won amount for won bets by service_code
                setChartData2({
                    labels: aggregatedWonAmountData.map(item => item.service_code),
                    datasets: [
                        {
                            label: 'Total Won Amount per Service Code',
                            data: aggregatedWonAmountData.map(item => item.total_won_amount),
                            backgroundColor: ['#42a5f5', '#ffeb3b', '#f44336'],
                            borderColor: ['#1e88e5', '#fbc02d', '#d32f2f'],
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (err) {
                toast.error(`Error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchBets();
    }, [timePeriod]);

    // if (loading) return <LoadingSpinner />;

    return (
        <>
            <DashboardNavBar
                uniqueWinners={uniqueWinners}
                totalStakes={totalStakes}
                totalWonAmount={totalWonAmount}
                totalProfit={totalProfit}
            />

            <Container className="mt--7" fluid>
                <Row  className="mb-5">
                    {/* Time Period Filter Section */}
                    <div className="col-md-3 ml-auto">
                        <Card className="shadow">
                            <CardHeader className="bg-transparent border-0">
                                <h3 className="mb-0">Filter by Time Period</h3>
                            </CardHeader>
                            <div className="p-3">
                                <Input 
                                    type="select"
                                    value={timePeriod}
                                    onChange={(e) => setTimePeriod(e.target.value)}
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="annually">Annually</option>
                                </Input>
                            </div>
                        </Card>
                    </div>
                </Row>
                <Row className="mb-5">
                    {/* Total Profit per Service Code Graph */}
                    <div className="col-md-6">
                        <Card className="shadow">
                            <CardHeader className="bg-transparent border-0">
                                <h3 className="mb-0">Total Profit per Service Code</h3>
                            </CardHeader>
                            <div className="p-3">
                                <Bar
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Total Profit per Service Code',
                                            },
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Total Won Amount per Service Code Graph */}
                    <div className="col-md-6">
                        <Card className="shadow">
                            <CardHeader className="bg-transparent border-0">
                                <h3 className="mb-0">Total Won Amount per Service Code</h3>
                            </CardHeader>
                            <div className="p-3">
                                <Bar
                                    data={chartData2}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Total Won Amount per Service Code',
                                            },
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </Card>
                    </div>
                </Row>

                
                {/* Data Table Section */}
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="bg-transparent border-0">
                                <h3 className="mb-0">Bets</h3>
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <ExportToExcel data={filteredBets} filename="bets.xlsx" />
                                </div>
                            </CardHeader>
                            <div>
                                <DataTable
                                    title="Bets List"
                                    columns={columns}
                                    data={filteredBets}
                                    pagination
                                    paginationPerPage={50}
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

export default Index;
