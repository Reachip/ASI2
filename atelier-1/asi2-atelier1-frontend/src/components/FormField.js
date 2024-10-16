import React from 'react';
import { Form as SUIForm } from 'semantic-ui-react';

const FormField = ({ label, children }) => (
    <SUIForm.Field>
        <label>{label}</label>
        {children}
    </SUIForm.Field>
);

export default FormField;