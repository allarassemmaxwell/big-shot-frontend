import React from 'react';
import { Badge, DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import formatDate from 'utils/formatDate';

const SmsTableColumns = ({ handleRowClick }) => {
  return [
    {
      name: 'Phone Number',
      selector: row => row.phone_number,
      sortable: true,
      cell: row => (
        <button
          style={{ textDecoration: 'underline', border: 'none', background: 'none' }}
          onClick={() => handleRowClick(row.message)}
        >
          {row.phone_number}
        </button>
      ),
    },
    {
        name: 'Status',
        selector: row => (
          <td>
            <Badge color="" className="badge-dot mr-4">
              <i
                className={
                  row.status === "Pending"
                    ? "bg-warning"  // For Pending (yellow)
                    : row.status === "Sent"
                    ? "bg-success"  // For Sent (green)
                    : "bg-danger"   // For Failed (red)
                }
              />
              {row.status}
            </Badge>
          </td>
        ),
        sortable: true
    },
    {
        name: 'Result',
            selector: row => (
                <td>
                    <Badge color="" className="badge-dot mr-4">
                        <i
                        className={
                            row.result === "Bet Lost"
                            ? "bg-yellow"
                            : row.result === "Bet Won"
                            ? "bg-success"
                            : "bg-danger"
                        }
                        />
                        {row.result}
                    </Badge>
                </td>
            ),
            sortable: true
    },
    { name: 'Created At', selector: row => formatDate(row.created_at), sortable: true },
    { name: 'Updated At', selector: row => formatDate(row.updated_at), sortable: true },
    {
      name: 'Actions',
      selector: row => row.id,
      cell: (row) => (
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
                onClick={() => handleRowClick(row.message)}
              >
                View Message
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </td>
      ),
    },
  ];
};

export default SmsTableColumns;
