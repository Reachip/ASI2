import React from 'react';
import { Button as SUIButton } from 'semantic-ui-react';

const Button = ({ label, onClick, className }) => (
    <SUIButton className={className} onClick={onClick}>
        {label}
    </SUIButton>
);

export default Button;