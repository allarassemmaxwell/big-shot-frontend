import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Button,
} from "reactstrap";
import { toast } from 'react-toastify';
import axios from './../../utils/api';
import { BASE_URL } from "constant";
import LoadingSpinner from "components/LoadingSpinner/";
import UserHeader from "components/Headers/UserHeader.js";

const ChangePassword = () => {
    const [loading, setLoading] = useState(false); // State for loading
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const email = localStorage.getItem("email");
    const first_name = localStorage.getItem("first_name");
    const last_name = localStorage.getItem("last_name");
    const phone_number = localStorage.getItem("phone_number");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Form validation
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.error('All fields are required!');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('New password and confirm password do not match!');
      return;
    }

    setLoading(true);

    try {
      // Make API call to update the password (replace with actual endpoint and user ID)
      const response = await axios.post(`${BASE_URL}/change-password/`, {
        old_password: oldPassword,
        new_password: newPassword,
      });

      // Success response
      toast.success('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
        toast.error(err.response?.data?.detail || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

//   if (loading) return <LoadingSpinner />;

  return (
    <>
        <UserHeader
            email={email}
            first_name={first_name}
            last_name={last_name}
        />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={require("../../assets/img/theme/team-4-800x800.jpg")}
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                <div className="d-flex justify-content-between"></div>
              </CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5"></div>
                  </div>
                </Row>
                <div className="text-center">
                  <h3>{first_name || first_name? `${first_name} ${last_name}`: 'Name Missing'}</h3>
                  <h3>{email}</h3>
                  <div className="h5 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    Phone Number: {phone_number? phone_number: 'Missing'}
                  </div>
                  <hr className="my-4" />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Change Password</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleChangePassword}>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-old-password"
                          >
                            Old Password
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-old-password"
                            placeholder="Old Password"
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            style={{ marginBottom: '10px' }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-new-password"
                          >
                            New Password
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-new-password"
                            placeholder="New Password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            style={{ marginBottom: '10px' }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-confirm-password"
                          >
                            Confirm New Password
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-confirm-password"
                            placeholder="Confirm New Password"
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                            style={{ marginBottom: '10px' }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                  <hr className="my-4" />
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? <LoadingSpinner /> : 'Save Changes'}
                    </button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ChangePassword;
