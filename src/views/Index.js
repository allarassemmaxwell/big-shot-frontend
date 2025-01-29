import React, { useEffect, useState } from "react";
import { Card, CardHeader, Container, Row, Input, Badge } from "reactstrap";
import axios from 'axios';
import { BASE_URL, LOADING } from "../constant";
import * as XLSX from 'xlsx';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import DashboardNavBar from "components/Dashboard/DashboardNavBar";
import DashboardItem from "components/Dashboard/DashboardItem";
import DataTable from 'react-data-table-component'; // Import DataTable component
import formatDate from "utils/formatDate";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Index = (props) => {
    const [bets, setBets] = useState([]);
    const [filteredBets, setFilteredBets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timePeriod, setTimePeriod] = useState('daily');

    // State for metrics
    const [uniqueWinners, setUniqueWinners] = useState(0);
    const [totalStakes, setTotalStakes] = useState(0);
    const [totalWonAmount, setTotalWonAmount] = useState(0);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

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

    // Function to aggregate bets by service_code
    const aggregateBetsByServiceCode = (data) => {
        const aggregated = data.reduce((acc, item) => {
            if (acc[item.service_code]) {
                acc[item.service_code].total_won += parseFloat(item.won_amount);
            } else {
                acc[item.service_code] = { service_code: item.service_code, total_won: parseFloat(item.won_amount) };
            }
            return acc;
        }, {});

        const chartData = Object.values(aggregated).map(item => ({
            service_code: item.service_code,
            total_won: item.total_won,
        }));

        return chartData;
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

                // Aggregate bets by service_code
                const aggregatedData = aggregateBetsByServiceCode(filteredData);

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

                setUniqueWinners(uniqueWinnerNumbers.size);
                setTotalStakes(totalStakesValue);
                setTotalWonAmount(totalWonValue);

                // Prepare chart data for total won amount by service_code
                setChartData({
                    labels: aggregatedData.map(item => item.service_code),
                    datasets: [
                        {
                            label: 'Total Won Amount per Service Code',
                            data: aggregatedData.map(item => item.total_won),
                            backgroundColor: ['#42a5f5', '#ffeb3b', '#f44336'],
                            borderColor: ['#1e88e5', '#fbc02d', '#d32f2f'],
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBets();
    }, [timePeriod]);

    if (loading) return <p>{LOADING}</p>;
    if (error) return <p>Error: {error}</p>;

    // Columns for the DataTable
    const columns = [
        { name: 'Phone Number', selector: row => row.phone_number, sortable: true },
        { name: 'Service Code', selector: row => row.service_code, sortable: true },
        { name: 'Chosen Box', selector: row => row.chosen_box, sortable: true },
        { name: 'Stake', selector: row => `Ksh ${parseFloat(row.stake).toLocaleString()}`, sortable: true },
        { name: 'Status', selector: row => (
            <Badge color="" className="badge-dot mr-4">
                <i className={row.won ? "bg-success" : "bg-danger"} />
                {row.won ? "Won" : "Lost"}
            </Badge>
        ), sortable: true },
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
        // { name: 'Updated At', selector: row => formatDate(row.updated_at), sortable: true },
    ];

    // Export to Excel functionality
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredBets);
        const wb = { Sheets: { 'Bets': ws }, SheetNames: ['Bets'] };
        const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        const buffer = new ArrayBuffer(excelFile.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < excelFile.length; i++) {
            view[i] = excelFile.charCodeAt(i) & 0xFF;
        }

        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bets.xlsx';
        a.click();
    };

    return (
        <>
            <DashboardNavBar
                uniqueWinners={uniqueWinners}
                totalStakes={totalStakes}
                totalWonAmount={totalWonAmount}
            />

            <Container className="mt--7" fluid>
                <Row>
                    {/* Graph Section */}
                    <div className="col-md-9">
                        <Card className="shadow">
                            <CardHeader className="bg-transparent border-0">
                                <h3 className="mb-0">Total Won Amount per Service Code</h3>
                            </CardHeader>
                            <div className="p-3">
                                <Bar
                                    data={chartData}
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

                    {/* Time Period Filter Section */}
                    <div className="col-md-3">
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

                {/* Data Table Section */}
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="bg-transparent border-0">
                                <h3 className="mb-0">Bets</h3>
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <button onClick={exportToExcel} className="btn btn-primary">Export to Excel</button>
                                </div>
                            </CardHeader>
                            <div>
                                <DataTable
                                    title="Bets List"
                                    columns={columns}
                                    data={filteredBets}
                                    pagination
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
