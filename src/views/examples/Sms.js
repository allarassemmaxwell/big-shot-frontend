import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import axios from './../../utils/api';
import { BASE_URL } from "constant";
import SmsNavBar from "components/Sms/SmsNavBar";
// import LoadingSpinner from "components/LoadingSpinner/";
import DataTable from 'react-data-table-component';
import SmsTableColumns from "components/Sms/SmsTableColumns";
import { toast } from 'react-toastify';


const Sms = () => {
  const [sms, setSms] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for the counts of each SMS status
  const [sentCount, setSentCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");

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
            toast.error(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
        };
        fetchSms();
    }, []);

  const handleRowClick = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  // Pass the handleRowClick function to SmsTableColumns
  const columns = SmsTableColumns({ handleRowClick });

  // if (loading) return <LoadingSpinner />;

  return (
    <>
      <SmsNavBar
        sentCount={sentCount}
        pendingCount={pendingCount}
        failedCount={failedCount}
      />

      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">SMS Records</h3>
              </CardHeader>
              <DataTable
                title="SMS List"
                columns={columns}
                data={sms}
                pagination
                paginationPerPage={25}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                highlightOnHover
                searchable
                fixedHeader
                responsive
              />
              <CardFooter className="py-4"></CardFooter>
            </Card>
          </div>
        </Row>
      </Container>

      {/* Modal for displaying the SMS message */}
      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)}>
        <ModalHeader toggle={() => setIsModalOpen(false)}>SMS Message</ModalHeader>
        <ModalBody>
          <p>{selectedMessage}</p>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
            Close
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Sms;
