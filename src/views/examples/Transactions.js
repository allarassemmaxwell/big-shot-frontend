import React, { useEffect, useState } from "react";
import TransactionNavBar from "components/Transaction/TransactionNavBar";
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

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timePeriod, setTimePeriod] = useState('daily');
    const [completedCount, setCompletedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [failedCount, setFailedCount] = useState(0);
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

    // Function to aggregate total amounts by service_code
    const aggregateTransactionsByServiceCode = (data) => {
        const aggregated = data.reduce((acc, item) => {
            if (acc[item.service_code]) {
                acc[item.service_code].amount += parseFloat(item.amount);
            } else {
                acc[item.service_code] = { service_code: item.service_code, amount: parseFloat(item.amount) };
            }
            return acc;
        }, {});

        // Convert the aggregated data into an array suitable for the chart
        const chartData = Object.values(aggregated).map(item => ({
            service_code: item.service_code,
            total_amount: item.amount,
        }));

        return chartData;
    };

    // Fetch the transactions and filter them based on time period
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/transactions/`);
                const transactionsData = response.data;
                setTransactions(transactionsData);

                // Filter data based on selected time period
                const filteredData = filterByTimePeriod(transactionsData, timePeriod);
                setFilteredTransactions(filteredData);

                // Aggregate transactions by service_code
                const aggregatedData = aggregateTransactionsByServiceCode(filteredData);

                // Update the counts for each status
                const completed = filteredData.filter((item) => item.transaction_status === "Completed").length;
                const pending = filteredData.filter((item) => item.transaction_status === "Pending").length;
                const failed = filteredData.filter((item) => item.transaction_status === "Failed").length;

                setCompletedCount(completed);
                setPendingCount(pending);
                setFailedCount(failed);

                // Prepare chart data for total amounts by service_code
                setChartData({
                    labels: aggregatedData.map(item => item.service_code),
                    datasets: [
                        {
                            label: 'Total Amount per Service Code',
                            data: aggregatedData.map(item => item.total_amount),
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

        fetchTransactions();
    }, [timePeriod]);

    // Handle loading, error states
    if (loading) return <p>{LOADING}</p>;
    if (error) return <p>Error: {error}</p>;

    // Columns for the DataTable
    const columns = [
        { name: 'Phone Number', selector: row => row.phone_number, sortable: true },
        { name: 'Service Code', selector: row => row.service_code, sortable: true },
        { name: 'Reference', selector: row => row.receipt_number, sortable: true },
        { 
            name: 'Status', 
            selector: row => (
                <td>
                    <Badge color="" className="badge-dot mr-4">
                        <i
                            className={
                                row.transaction_status === "Pending" ? "bg-yellow" : 
                                row.transaction_status === "Completed" ? "bg-success" : "bg-danger"
                            }
                        />
                        {row.transaction_status}
                    </Badge>
                </td>
            ),
            sortable: true 
        },
        { name: 'Amount', selector: row => `Ksh ${parseFloat(row.amount).toLocaleString()}`, sortable: true },
        { name: 'Created At', selector: row => formatDate(row.created_at), sortable: true },
        { name: 'Updated At', selector: row => formatDate(row.updated_at), sortable: true },
    ];

    // Export to Excel functionality
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredTransactions);
        const wb = { Sheets: { 'Transactions': ws }, SheetNames: ['Transactions'] };
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
        a.download = 'transactions.xlsx';
        a.click();
    };

    return (
        <>
            <TransactionNavBar
                completedCount={completedCount}
                pendingCount={pendingCount}
                failedCount={failedCount}
            />

            <Container className="mt--7" fluid>
                <Row>
                    {/* Graph Section */}
                    <div className="col-md-9">
                        <Card className="shadow">
                            <CardHeader className="bg-transparent border-0">
                                <h3 className="mb-0">Total Amount per Service Code</h3>
                            </CardHeader>
                            <div className="p-3">
                                <Bar
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Total Amount per Service Code',
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
                                <h3 className="mb-0">Transactions</h3>
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <button onClick={exportToExcel} className="btn btn-primary">Export to Excel</button>
                                </div>
                            </CardHeader>
                            <div>
                                <DataTable
                                    title="Transactions List"
                                    columns={columns}
                                    data={filteredTransactions}
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

export default Transactions;
