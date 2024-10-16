import React, { useState } from 'react';
import { Container } from 'semantic-ui-react';
import Form from '../components/Form';
import FormField from '../components/FormField';
import Input from '../components/Input';
import Button from '../components/Button';
import Header from '../components/Header'; // Assurez-vous d'importer le Header

const LoginPage = () => {
    const [loginDetails, setLoginDetails] = useState({});

    const handleInputChange = (e) => {
        setLoginDetails({
            ...loginDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(loginDetails);
    };

    return (
        <>
            <Header title="Login" subtitle="Please enter your credentials" icon="user" />
            <Container>
                <h1>Login</h1>
                <Form onSubmit={handleSubmit}>
                    <FormField label="Username">
                        <Input type="text" name="username" onChange={handleInputChange} />
                    </FormField>
                    <FormField label="Password">
                        <Input type="password" name="password" onChange={handleInputChange} />
                    </FormField>
                    <Button label="Login" />
                </Form>
            </Container>
        </>
    );
};

export default LoginPage;