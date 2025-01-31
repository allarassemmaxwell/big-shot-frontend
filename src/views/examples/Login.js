/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import React, { useState } from "react";
import { Button, Card, CardHeader, CardBody, FormGroup, Form, Input, InputGroupAddon, InputGroupText, InputGroup, Col } from "reactstrap";
import axios from './../../utils/api';
import { BASE_URL, LOADING } from "constant";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); 

    const navigate = useNavigate(); // Use navigate for redirect
    const location = useLocation(); // Get the current location
    

    const handleLogin = async (e) => {
        e.preventDefault();
        
        setLoading(true);

        try {
            const response = await axios.post(`${BASE_URL}/login/`, {
                email,
                password,
            });
    
            // Store tokens and user data in localStorage
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("first_name", response.data.first_name);
            localStorage.setItem("last_name", response.data.last_name);

            // Force a re-render to pick up localStorage changes
            const redirectTo = location.state?.from?.pathname || "/admin/index";
            console.log("Redirecting to:", redirectTo);
            navigate(redirectTo, { replace: true });
        } catch (error) {
            toast.error('Invalid credentials or something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Col lg="5" md="7">
            <Card className="bg-secondary shadow border-0">
                <CardHeader className="bg-transparent pb-5">
                <div className="text-muted text-center mt-2 mb-3">
                    <small>Sign in to the dashboard</small>
                </div>
                </CardHeader>
                <CardBody className="px-lg-5 py-lg-5">
                <Form role="form" onSubmit={handleLogin}>
                    {/* Email and Password Inputs */}
                    <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <i className="ni ni-email-83" />
                        </InputGroupText>
                        </InputGroupAddon>
                        <Input
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />
                    </InputGroup>
                    </FormGroup>

                    <FormGroup>
                    <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                        </InputGroupAddon>
                        <Input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                    </InputGroup>
                    </FormGroup>

                    {/* Submit Button */}
                    <div className="text-center">
                    <Button
                        className="my-4"
                        color="primary"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? LOADING : "Sign in"}
                    </Button>
                    </div>
                </Form>
                </CardBody>
            </Card>
        </Col>
    );
};

export default Login;
