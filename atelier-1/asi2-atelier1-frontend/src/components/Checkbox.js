import React from 'react';
import { Checkbox as MUICheckbox, FormControlLabel } from '@mui/material';

const Checkbox = ({ label, checked, onChange }) => (
    <FormControlLabel
        control={<MUICheckbox checked={checked} onChange={onChange} />}
        label={label}
    />
);

export default Checkbox;