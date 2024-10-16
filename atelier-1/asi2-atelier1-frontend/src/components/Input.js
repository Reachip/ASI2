import React from 'react';
import { Input as SUIInput } from 'semantic-ui-react';

const Input = ({ placeholder, type, value, onChange, className }) => (
    <SUIInput
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        className={className}
    />
);

export default Input;