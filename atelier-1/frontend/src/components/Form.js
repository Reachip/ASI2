import React from 'react';

const Form = ({ children, onSubmit, className }) => (
    <form onSubmit={onSubmit} className={className}>
        {children}
    </form>
);

export default Form;