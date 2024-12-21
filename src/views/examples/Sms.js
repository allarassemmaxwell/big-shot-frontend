import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
} from "reactstrap";
import axios from 'axios';
import { BASE_URL, LOADING } from "constant";
import SmsItem from "components/Sms/SmsItem";
import SmsNavBar from "components/Sms/SmsNavBar";

const Sms = () => {
    const [sms, setSms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for the counts of each SMS status
    const [sentCount, setSentCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [failedCount, setFailedCount] = useState(0);

    useEffect(() => {
        const fetchSms = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/sms/`);
                const smsData = response.data;
                setSms(smsData);

                // Count the status of SMS messages
                const sent = smsData.filter((item) => item.status === "Sent").length;
                const pending = smsData.filter((item) => item.status === "Pending").length;
                const failed = smsData.filter((item) => item.status === "Failed").length;

                // Update the state with the counts
                setSentCount(sent);
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
            <SmsNavBar
                sentCount={sentCount}
                pendingCount={pendingCount}
                failedCount={failedCount}
            />

        {/* Page content */}
        <Container className="mt--7" fluid>
            {/* Table */}
            <Row>
                <div className="col">
                    <Card className="shadow">
                        <CardHeader className="border-0">
                            <h3 className="mb-0">Sms</h3>
                        </CardHeader>
                    <Table className="align-items-center table-flush" responsive>
                        <thead className="thead-light">
                        <tr>
                            <th scope="col">Phone Number</th>
                            <th scope="col">Status</th>
                            <th scope="col">Created At</th>
                            <th scope="col">Updated At</th>
                        </tr>
                        </thead>
                        <tbody>
                            {sms.length > 0 ? (
                                sms.map((item, index) => (
                                    <SmsItem key={index} item={item} />
                                ))
                            ) : (
                                <tr>
                                <td colSpan="4" style={{ textAlign: "center", fontSize: "1.2rem", padding: "20px" }}>
                                    No SMS records available
                                </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    <CardFooter className="py-4">
                        <nav aria-label="...">
                        <Pagination
                            className="pagination justify-content-end mb-0"
                            listClassName="justify-content-end mb-0"
                        >
                            <PaginationItem className="disabled">
                            <PaginationLink
                                href="#pablo"
                                onClick={(e) => e.preventDefault()}
                                tabIndex="-1"
                            >
                                <i className="fas fa-angle-left" />
                                <span className="sr-only">Previous</span>
                            </PaginationLink>
                            </PaginationItem>
                            <PaginationItem className="active">
                            <PaginationLink
                                href="#pablo"
                                onClick={(e) => e.preventDefault()}
                            >
                                1
                            </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                            <PaginationLink
                                href="#pablo"
                                onClick={(e) => e.preventDefault()}
                            >
                                2 <span className="sr-only">(current)</span>
                            </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                            <PaginationLink
                                href="#pablo"
                                onClick={(e) => e.preventDefault()}
                            >
                                3
                            </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                            <PaginationLink
                                href="#pablo"
                                onClick={(e) => e.preventDefault()}
                            >
                                <i className="fas fa-angle-right" />
                                <span className="sr-only">Next</span>
                            </PaginationLink>
                            </PaginationItem>
                        </Pagination>
                        </nav>
                    </CardFooter>
                    </Card>
                </div>
            </Row>
        </Container>
        </>
    );
};

export default Sms;
