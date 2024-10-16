import React from 'react';
import { Checkbox as SuiCheckbox } from 'semantic-ui-react';

const Checkbox = ({ label, checked, onChange }) => {
    return (
        <SuiCheckbox
            label={label}
            checked={checked}
            onChange={onChange}
        />
    );
};

export default Checkbox;