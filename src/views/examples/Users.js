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
import {
    Badge,
    Card,
    CardHeader,
    CardFooter,
    CardBody,
    CardTitle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    Pagination,
    PaginationItem,
    PaginationLink,
    Table,
    Container,
    Row,
    Col
  } from "reactstrap";
  // core components
  
  const Users = () => {
    return (
      <>
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
            <Container fluid>
                <div className="header-body">
                    <Row>
                        <Col lg="6" xl="4">
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
                                            350,897
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
                        <Col lg="6" xl="4">
                            <Card className="card-stats mb-4 mb-xl-0">
                                <CardBody>
                                    <Row>
                                        <div className="col">
                                            <CardTitle
                                            tag="h5"
                                            className="text-uppercase text-muted mb-0"
                                            >
                                            Active Users
                                            </CardTitle>
                                            <span className="h2 font-weight-bold mb-0">2,356</span>
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
                        <Col lg="6" xl="4">
                            <Card className="card-stats mb-4 mb-xl-0">
                                <CardBody>
                                    <Row>
                                        <div className="col">
                                            <CardTitle
                                            tag="h5"
                                            className="text-uppercase text-muted mb-0"
                                            >
                                            Inactive Users
                                            </CardTitle>
                                            <span className="h2 font-weight-bold mb-0">924</span>
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
                    </Row>
                </div>
            </Container>
        </div>

        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="bg-transparent border-0">
                  <h3 className="mb-0">Users</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Username</th>
                      <th scope="col">Phone Number</th>
                      <th scope="col">Status</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">
                        <Media className="align-items-center">
                          <a
                            className="avatar rounded-circle mr-3"
                            href="#pablo"
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              src={require("../../assets/img/theme/profile-cover.jpg")}
                            />
                          </a>
                          <Media>
                            <span className="mb-0 text-sm">
                              Argon Design System
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>Argon</td>
                      <td>
                        <Badge color="" className="badge-dot mr-4">
                          0704205757
                        </Badge>
                      </td>
                      <td>
                        <Badge color="" className="badge-dot mr-4">
                          <i className="bg-warning" />
                          Inactive
                        </Badge>
                      </td>
                      <td className="text-right">
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#pablo"
                            role="button"
                            size="sm"
                            color=""
                            onClick={(e) => e.preventDefault()}
                          >
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Active
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <Media className="align-items-center">
                          <a
                            className="avatar rounded-circle mr-3"
                            href="#pablo"
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              src={require("../../assets/img/theme/profile-cover.jpg")}
                            />
                          </a>
                          <Media>
                            <span className="mb-0 text-sm">
                              Argon Design System
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>Argon</td>
                      <td>
                        <Badge color="" className="badge-dot mr-4">
                          0704205757
                        </Badge>
                      </td>
                      <td>
                        <Badge color="" className="badge-dot mr-4">
                          <i className="bg-success" />
                          Active
                        </Badge>
                      </td>
                      <td className="text-right">
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#pablo"
                            role="button"
                            size="sm"
                            color=""
                            onClick={(e) => e.preventDefault()}
                          >
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Inaction
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
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
  
  export default Users;
  