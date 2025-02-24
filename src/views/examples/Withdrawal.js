import React, { useEffect, useState } from "react";
import { Card, CardHeader, Container, Row, Input } from "reactstrap";
import axios from './../../utils/api';
import { BASE_URL } from "constant";
import WithdrawalNavBar from "components/Withdrawal/WithdrawalNavBar";
import DataTable from 'react-data-table-component';
import ExportToExcel from "components/ExportToExcel/ExportToExcel";
// import LoadingSpinner from "components/LoadingSpinner/";
import WithdrawnTableColumn from "components/Withdrawal/WithdrawnTableColumn";
import { toast } from 'react-toastify';
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
    const [timePeriod, setTimePeriod] = useState('daily'); // New state for time filter
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    }); // Ensure chartData is always initialized

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
                toast.error(`Error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchWithdrawals();
    }, [timePeriod]); // Re-run useEffect when the timePeriod changes

    // if (loading) return <LoadingSpinner />;

    const columns = WithdrawnTableColumn();

    // Calculate total number of unique users and total amount
    const totalUsers = new Set(filteredWithdrawals.map(item => item.phone_number)).size;
    const totalAmount = filteredWithdrawals.reduce((acc, item) => acc + parseFloat(item.amount), 0);

    return (
        <>
            <WithdrawalNavBar
                totalUsers={totalUsers}
                totalAmount={totalAmount}
            />

            {/* Page content */}
            <Container className="mt--7" fluid>
                <Row className="mb-5">
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
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <ExportToExcel data={filteredWithdrawals} filename="withdraw.xlsx" />
                                </div>
                            </CardHeader>
                            <div>
                                <DataTable
                                    title="Withdrawals List"
                                    columns={columns}
                                    data={filteredWithdrawals}
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

export default Withdrawal;
