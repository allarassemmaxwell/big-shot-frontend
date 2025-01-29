import React, { useEffect, useState } from "react";
import WinnerNavBar from "components/Winners/WinnerNavBar";
import { Card, CardHeader, Container, Row, Input, Badge } from "reactstrap";
import axios from 'axios';
import { BASE_URL, LOADING } from "constant";
import * as XLSX from 'xlsx';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import DataTable from 'react-data-table-component';
import formatDate from "utils/formatDate";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Winners = () => {
    const [winners, setWinners] = useState([]);
    const [filteredWinners, setFilteredWinners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timePeriod, setTimePeriod] = useState('daily');
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

    // Function to aggregate winners by service_code
    const aggregateWinnersByServiceCode = (data) => {
        const aggregated = data.reduce((acc, item) => {
            if (acc[item.service_code]) {
                acc[item.service_code].total_won += parseFloat(item.won_amount);
            } else {
                acc[item.service_code] = { service_code: item.service_code, total_won: parseFloat(item.won_amount) };
            }
            return acc;
        }, {});

        // Convert the aggregated data into an array suitable for the chart
        const chartData = Object.values(aggregated).map(item => ({
            service_code: item.service_code,
            total_won: item.total_won,
        }));

        return chartData;
    };

    // Fetch winners and filter by selected time period
    useEffect(() => {
        const fetchWinners = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/bets/`);
                const winnersData = response.data;

                // Filter data based on selected time period
                const filteredData = filterByTimePeriod(winnersData, timePeriod);
                setFilteredWinners(filteredData);

                // Aggregate winners by service_code
                const aggregatedData = aggregateWinnersByServiceCode(filteredData);

                // Update totals and counts
                const uniqueWinnerNumbers = new Set(filteredData.map((bet) => bet.phone_number));
                const totalStakesValue = filteredData.reduce(
                    (acc, bet) => acc + parseFloat(bet.stake),
                    0
                );
                const totalWonValue = filteredData.reduce(
                    (acc, bet) => acc + parseFloat(bet.won_amount),
                    0
                );

                setWinners(filteredData);
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

        fetchWinners();
    }, [timePeriod]);

    if (loading) return <p>{LOADING}</p>;
    if (error) return <p>Error: {error}</p>;

    // Columns for the DataTable
    const columns = [
        { name: 'Phone Number', selector: row => row.phone_number, sortable: true },
        { name: 'Service Code', selector: row => row.service_code, sortable: true },
        { name: 'Chosen Box', selector: row => row.chosen_box, sortable: true },
        { name: 'Stake', selector: row => `Ksh ${parseFloat(row.stake).toLocaleString()}`, sortable: true },
        { name: 'Won Amount', selector: row => `Ksh ${parseFloat(row.won_amount).toLocaleString()}`, sortable: true },
        { name: 'Created At', selector: row => formatDate(row.created_at), sortable: true },
        { name: 'Updated At', selector: row => formatDate(row.updated_at), sortable: true },
    ];

    // Export to Excel functionality
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredWinners);
        const wb = { Sheets: { 'Winners': ws }, SheetNames: ['Winners'] };
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
        a.download = 'winners.xlsx';
        a.click();
    };

    return (
        <>
            <WinnerNavBar
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
                                <h3 className="mb-0">Winners</h3>
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <button onClick={exportToExcel} className="btn btn-primary">Export to Excel</button>
                                </div>
                            </CardHeader>
                            <div>
                                <DataTable
                                    title="Winners List"
                                    columns={columns}
                                    data={filteredWinners}
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

export default Winners;
