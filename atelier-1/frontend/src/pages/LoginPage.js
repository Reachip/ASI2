import React, { useState } from 'react';
import { Container, TextField, Button } from '@mui/material';
import Header from '../components/Header';

const LoginPage = () => {
    const [loginDetails, setLoginDetails] = useState({});

    const handleInputChange = (e) => {
        setLoginDetails({
            ...loginDetails,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(loginDetails);
    };

    return (
        <>
            <Header title="Login" subtitle="Please authentificate" icon="user" />
            <Container>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        name="username"
                        value={loginDetails.username || ''}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={loginDetails.password || ''}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Login
                    </Button>
                </form>
            </Container>
        </>
    );
};

export default LoginPage;