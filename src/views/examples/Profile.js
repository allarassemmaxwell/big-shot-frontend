import React, { useState, useEffect } from "react";
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
} from "reactstrap";
import UserHeader from "components/Headers/UserHeader.js";
import { toast } from 'react-toastify';
import axios from './../../utils/api';

import LoadingSpinner from "components/LoadingSpinner/";
import { BASE_URL } from "constant";


const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [firstName, setFirstName] = useState(localStorage.getItem("first_name"));
  const [lastName, setLastName] = useState(localStorage.getItem("last_name"));
  const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem("phone_number"));
  
  // New state variables to manage the form inputs
  const [newFirstName, setNewFirstName] = useState(firstName);
  const [newLastName, setNewLastName] = useState(lastName);
  const [newPhoneNumber, setNewPhoneNumber] = useState(phoneNumber);
  
    // Handle Update Profile
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        if (!newFirstName || !newLastName) {
            toast.error('First Name and Last Name are required!');
            return;
        }

        try {
            const response = await axios.put(`${BASE_URL}/update-profile/`, {
                first_name: newFirstName,
                last_name: newLastName,
                phone_number: newPhoneNumber,
                email,
            });
    
            // Update localStorage with the new values
            localStorage.setItem("first_name", newFirstName);
            localStorage.setItem("last_name", newLastName);
            localStorage.setItem("phone_number", newPhoneNumber);
    
            // Update state values to reflect the changes immediately in the UI
            setFirstName(newFirstName);
            setLastName(newLastName);
            setPhoneNumber(newPhoneNumber);
    
            // Display success message
            toast.success('Profile updated successfully');
        } catch (error) {
            // Handle error
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };
    

  return (
    <>
      <UserHeader email={email} first_name={firstName} last_name={lastName} />
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
                    <h3>{firstName || lastName? `${firstName} ${lastName}`: 'Name Missing'}</h3> 
                    <h3>{email}</h3>
                    <div className="h5 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    Phone Number: {phoneNumber || 'Missing'}
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
                    <h3 className="mb-0">My account</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleUpdateProfile}>
                  <h6 className="heading-small text-muted mb-4">User information</h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-first-name">
                            First Name
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={newFirstName}
                            onChange={(e) => setNewFirstName(e.target.value)}
                            id="input-first-name"
                            placeholder="First name"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-last-name">
                            Last Name
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={newLastName}
                            onChange={(e) => setNewLastName(e.target.value)}
                            id="input-last-name"
                            placeholder="Last name"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-phone-number">
                            Phone Number
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={newPhoneNumber || ''}
                            onChange={(e) => setNewPhoneNumber(e.target.value)}
                            id="input-phone-number"
                            placeholder="Phone number"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-email">
                            Email Address
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="input-email"
                            placeholder="Email address"
                            type="email"
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                  <hr className="my-4" />
                  <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? <LoadingSpinner /> : 'Update Profile'}
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

export default Profile;
