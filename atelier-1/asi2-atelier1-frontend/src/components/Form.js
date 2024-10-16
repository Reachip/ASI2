import React from 'react';
import { Form as SUIForm } from 'semantic-ui-react';

const Form = ({ children, onSubmit, className }) => (
    <SUIForm className={className} onSubmit={onSubmit}>
        {children}
    </SUIForm>
);

export default Form;