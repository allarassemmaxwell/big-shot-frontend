import React, { useEffect, useState, useRef } from "react";
import { Card, CardHeader, Container, Row, Badge, Button, Input } from "reactstrap";
import axios from 'axios';
import { BASE_URL, LOADING } from "constant";
import WithdrawalNavBar from "components/Withdrawal/WithdrawalNavBar";
import formatDate from "utils/formatDate";
import DataTable from 'react-data-table-component';
import * as XLSX from 'xlsx';

// Chart.js imports
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Withdrawal = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timePeriod, setTimePeriod] = useState('daily'); // New state for time filter
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    }); // Ensure chartData is always initialized

    // State for the counts of each SMS status
    const [completedCount, setCompletedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [failedCount, setFailedCount] = useState(0);

    const tableRef = useRef();

    // Function to filter based on time period
    const filterByTimePeriod = (data, period) => {
        const now = new Date();
        return data.filter((item) => {
            const createdAt = new Date(item.created_at);
            const diffTime = now - createdAt;

            switch (period) {
                case 'daily':
                    return diffTime <= 24 * 60 * 60 * 1000; // 1 day
                case 'weekly':
                    return diffTime <= 7 * 24 * 60 * 60 * 1000; // 1 week
                case 'monthly':
                    return diffTime <= 30 * 24 * 60 * 60 * 1000; // 1 month
                case 'annually':
                    return diffTime <= 365 * 24 * 60 * 60 * 1000; // 1 year
                default:
                    return true;
            }
        });
    };

    // Function to group the data by service_code and calculate the total amount
    const aggregateDataByServiceCode = (data) => {
        return data.reduce((acc, item) => {
            if (!acc[item.service_code]) {
                acc[item.service_code] = 0;
            }
            acc[item.service_code] += parseFloat(item.amount); // Aggregate won amount
            return acc;
        }, {});
    };

    // Fetch data and update state
    useEffect(() => {
        const fetchWithdrawals = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/withdrawals/`);
                const withdrawalsData = response.data;
                setWithdrawals(withdrawalsData);

                // Filter data based on the selected time period
                const filteredData = filterByTimePeriod(withdrawalsData, timePeriod);
                setFilteredWithdrawals(filteredData);

                // Group by service_code and calculate the total amount
                const aggregatedData = aggregateDataByServiceCode(filteredData);

                // Create chart data
                const chartLabels = Object.keys(aggregatedData);
                const chartValues = Object.values(aggregatedData);

                // Update state for the graph data
                setChartData({
                    labels: chartLabels,
                    datasets: [
                        {
                            label: 'Total Withdrawn Amount',
                            data: chartValues,
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
        fetchWithdrawals();
    }, [timePeriod]); // Re-run useEffect when the timePeriod changes

    if (loading) return <p>{LOADING}</p>;
    if (error) return <p>Error: {error}</p>;

    // Columns configuration for DataTable
    const columns = [
        { name: 'Phone Number', selector: row => row.phone_number, sortable: true },
        { name: 'Service Code', selector: row => row.service_code, sortable: true },
        { name: 'Reference', selector: row => row.transaction_id, sortable: true },
        { name: 'Stake', selector: row => `Ksh ${parseFloat(row.bet_stake).toLocaleString()}`, sortable: true },
        { name: 'Won Amount', selector: row => `Ksh ${parseFloat(row.amount).toLocaleString()}`, sortable: true },
        { 
            name: 'Status', 
            selector: row => (
                <td>
                    <Badge color="" className="badge-dot mr-4">
                        <i
                            className={
                                row.status === "Pending" ? "bg-yellow" : 
                                row.status === "Completed" ? "bg-success" : "bg-danger"
                            }
                        />
                        {row.status}
                    </Badge>
                </td>
            ),
            sortable: true 
        },
        { name: 'Created At', selector: row => formatDate(row.created_at), sortable: true },
        { name: 'Updated At', selector: row => formatDate(row.updated_at), sortable: true },
    ];

    // Export to Excel
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(withdrawals);
        const wb = { Sheets: { 'Withdrawals': ws }, SheetNames: ['Withdrawals'] };
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
        a.download = 'withdrawals.xlsx';
        a.click();
    };
    return (
        <>
            <WithdrawalNavBar
                completedCount={completedCount}
                pendingCount={pendingCount}
                failedCount={failedCount}
            />

            {/* Page content */}
            <Container className="mt--7" fluid>
                <Row>
                    {/* Graph */}
                    <div className="col-md-9">
                        <Card className="shadow">
                            <CardHeader className="bg-transparent border-0">
                                <h3 className="mb-0">Withdrawals by Service Code</h3>
                            </CardHeader>
                            <div className="p-3">
                                <Bar
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Total Withdrawn Amount by Service Code',
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
                    
                    {/* Time Period Filter */}
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

                {/* Data Table */}
                <Row>
                    <div className="col">
                        <Card className="shadow">
                        <CardHeader className="bg-transparent border-0">
                                <h3 className="mb-0">Withdrawals</h3>
                                {/* Add Export buttons */}
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <button onClick={exportToExcel} className="btn btn-primary">Export to Excel</button>
                                </div>
                            </CardHeader>
                            <div ref={tableRef}>
                                <DataTable
                                    title="Withdrawals List"
                                    columns={columns}
                                    data={filteredWithdrawals}
                                    pagination
                                    highlightOnHover
                                    searchable={true}
                                    fixedHeader
                                />
                            </div>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
}

export default Withdrawal;
