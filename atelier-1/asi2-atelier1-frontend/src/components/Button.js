import React from 'react';
import { Button as MUIButton } from '@mui/material';

const Button = ({ label, onClick, className }) => (
    <MUIButton variant="contained" color="primary" onClick={onClick} className={className}>
        {label}
    </MUIButton>
);

export default Button;