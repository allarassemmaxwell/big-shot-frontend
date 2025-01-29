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
  // core components
  import UserHeader from "components/Headers/UserHeader.js";

const ChangePassword = () => {
  return (
        <>
        <UserHeader />
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
                    <div className="d-flex justify-content-between">
                    
                    </div>
                </CardHeader>
                <CardBody className="pt-0 pt-md-4">
                    <Row>
                    <div className="col">
                        <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                        
                        </div>
                    </div>
                    </Row>
                    <div className="text-center">
                    <h3>
                        Jessica Jones
                    </h3>
                    <div className="h5 font-weight-300">
                        <i className="ni location_pin mr-2" />
                        a@gmail.com
                    </div>
                    <div className="h5 mt-4">
                        <i className="ni business_briefcase-24 mr-2" />
                        Phone Number: 254700000000
                    </div>
                    <div>
                        <i className="ni education_hat mr-2" />
                        Created at: 10/10/2025
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
                    <Form>
                    <div className="pl-lg-4">
                        
                        <Row>
                        <Col lg="12">
                            <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-first-name"
                            >
                                Old Password
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-first-name"
                                placeholder=""
                                type="password"
                            />
                            </FormGroup>
                        </Col>
                        </Row>
                        <Row>
                            <Col lg="12">
                                <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="input-username"
                                >
                                    New Password
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="input-username"
                                    placeholder=""
                                    type="password"
                                />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="12">
                                <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="input-username"
                                >
                                    Confirm New Password
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="input-username"
                                    type="password"
                                />
                                </FormGroup>
                            </Col>
                        </Row>
                    </div>

                    <hr className="my-4" />
                    
                    </Form>
                </CardBody>
                </Card>
            </Col>
            </Row>
        </Container>
        </>
  )
}

export default ChangePassword
