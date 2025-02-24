import React, { useEffect, useState } from "react";
import { Card, CardHeader, Container, Row, Input } from "reactstrap";
import { BASE_URL } from "constant";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import DataTable from 'react-data-table-component';
import axios from './../../utils/api';
// import LoadingSpinner from "components/LoadingSpinner/";
import ExportToExcel from "components/ExportToExcel/ExportToExcel";
import TransactionNavBar from "components/Transaction/TransactionNavBar";
import TransactionTableColumns from "components/Transaction/TransactionTableColumns";
import { toast } from 'react-toastify';
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timePeriod, setTimePeriod] = useState('daily');
    const [totalUsers, setTotalUsers] = useState(0); // For the total number of unique users (phone numbers)
    const [totalAmount, setTotalAmount] = useState(0); // For the total amount sum
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

    // Fetch transactions and filter by time period
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/transactions/`);
                const transactionsData = response.data;
                setTransactions(transactionsData);

                // Filter data based on selected time period
                const filteredData = filterByTimePeriod(transactionsData, timePeriod);
                setFilteredTransactions(filteredData);

                // Calculate total users (unique phone numbers)
                const uniqueUsers = new Set(filteredData.map((item) => item.phone_number)).size;
                const totalAmountValue = filteredData.reduce((acc, item) => acc + parseFloat(item.amount), 0);

                // Aggregate transactions by service_code for chart data
                const aggregatedData = filteredData.reduce((acc, item) => {
                    if (acc[item.service_code]) {
                        acc[item.service_code].amount += parseFloat(item.amount);
                    } else {
                        acc[item.service_code] = { service_code: item.service_code, amount: parseFloat(item.amount) };
                    }
                    return acc;
                }, {});

                setTotalUsers(uniqueUsers);
                setTotalAmount(totalAmountValue);

                // Prepare chart data
                setChartData({
                    labels: Object.keys(aggregatedData),
                    datasets: [
                        {
                            label: 'Total Amount per Service Code',
                            data: Object.values(aggregatedData).map(item => item.amount),
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

        fetchTransactions();
    }, [timePeriod]);

    // if (loading) return <LoadingSpinner />;

    const columns = TransactionTableColumns();

    return (
        <>
            <TransactionNavBar 
                totalUsers={totalUsers}
                totalAmount={totalAmount}
            />

            <Container className="mt--7" fluid>
                <Row className="mb-5">
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

                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="bg-transparent border-0">
                                <h3 className="mb-0">Transactions</h3>
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <ExportToExcel data={filteredTransactions} filename="transactions.xlsx" />
                                </div>
                            </CardHeader>
                            <div>
                                <DataTable
                                    title="Transactions List"
                                    columns={columns}
                                    data={filteredTransactions}
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

export default Transactions;
