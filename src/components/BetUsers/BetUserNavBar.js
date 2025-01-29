import React from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';

const BetUserNavBar = ({totalUsers, totalWon, totalLoss, totalWithdrawn}) => {
    return (
        <>
            <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
                <Container fluid>
                    <div className="header-body">
                        <Row>
                            <Col lg="6" xl="3">
                                <Card className="card-stats mb-4 mb-xl-0">
                                    <CardBody>
                                        <Row>
                                            <div className="col">
                                                <CardTitle
                                                tag="h5"
                                                className="text-uppercase text-muted mb-0"
                                                >
                                                Total Users
                                                </CardTitle>
                                                <span className="h2 font-weight-bold mb-0">
                                                {totalUsers}
                                                </span>
                                            </div>
                                            <Col className="col-auto">
                                                <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                                <i className="fas fa-chart-bar" />
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg="6" xl="3">
                                <Card className="card-stats mb-4 mb-xl-0">
                                    <CardBody>
                                        <Row>
                                            <div className="col">
                                                <CardTitle
                                                tag="h5"
                                                className="text-uppercase text-muted mb-0"
                                                >
                                                Total Loss
                                                </CardTitle>
                                                <span className="h2 font-weight-bold mb-0">KSH {totalLoss.toFixed(2)}</span>
                                            </div>
                                            <Col className="col-auto">
                                                <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                                                <i className="fas fa-chart-pie" />
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg="6" xl="3">
                                <Card className="card-stats mb-4 mb-xl-0">
                                    <CardBody>
                                        <Row>
                                            <div className="col">
                                                <CardTitle
                                                tag="h5"
                                                className="text-uppercase text-muted mb-0"
                                                >
                                                Total Won
                                                </CardTitle>
                                                <span className="h2 font-weight-bold mb-0">KSH {totalWon.toFixed(2)}</span>
                                            </div>
                                            <Col className="col-auto">
                                                <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                                                <i className="fas fa-users" />
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg="6" xl="3">
                                <Card className="card-stats mb-4 mb-xl-0">
                                    <CardBody>
                                        <Row>
                                            <div className="col">
                                                <CardTitle
                                                tag="h5"
                                                className="text-uppercase text-muted mb-0"
                                                >
                                                Total Withdrawals
                                                </CardTitle>
                                                <span className="h2 font-weight-bold mb-0">
                                                KSH {totalWithdrawn.toFixed(2)}
                                                </span>
                                            </div>
                                            <Col className="col-auto">
                                                <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                                <i className="fas fa-chart-bar" />
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>
        </>
    )
}

export default BetUserNavBar
