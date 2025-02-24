// src/components/LoadingSpinner.js
import { LOADING } from 'constant';
import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const index = () => (
    <>
        <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
        />
        <span className="ml-2">{LOADING}</span>
    </>
);

export default index;