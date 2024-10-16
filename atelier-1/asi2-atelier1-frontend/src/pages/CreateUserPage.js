import React, { useState } from 'react';
import { Container } from 'semantic-ui-react';
import Form from '../components/Form';
import FormField from '../components/FormField';
import Input from '../components/Input';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';
import Header from '../components/Header';

const CreateUserPage = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    password: '',
    repassword: '',
    acceptedTerms: false,
  });

  const handleChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e, { checked }) => {
    setFormData({ ...formData, acceptedTerms: checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('User created:', formData);
  };

  return (
    <>
      <Header title="Create User" subtitle="Please fill in the details" icon="user" />
      <Container>
        <Form onSubmit={handleSubmit}>
          <FormField label="First Name">
            <Input
              type="text"
              name="firstname"
              placeholder="First Name"
              onChange={handleChange}
            />
          </FormField>
          <FormField label="Last Name">
            <Input
              type="text"
              name="lastname"
              placeholder="Last Name"
              onChange={handleChange}
            />
          </FormField>
          <FormField label="Password">
            <Input
              type="password"
              name="password"
              placeholder="Your Password"
              onChange={handleChange}
            />
          </FormField>
          <FormField label="Re-Password">
            <Input
              type="password"
              name="repassword"
              placeholder="Your Password Again"
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Checkbox
              label="I accept the terms and conditions"
              checked={formData.acceptedTerms}
              onChange={handleCheckboxChange}
            />
          </FormField>
          <Button label="Submit" />
        </Form>
      </Container>
    </>
  );
};

export default CreateUserPage;