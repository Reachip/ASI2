import React from 'react';
import { Typography } from '@mui/material';

const FormField = ({ label, children }) => (
    <div>
        <Typography variant="body1">{label}</Typography>
        {children}
    </div>
);

export default FormField;