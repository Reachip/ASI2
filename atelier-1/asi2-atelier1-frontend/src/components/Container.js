import React from 'react';
import { Container as SUIContainer } from 'semantic-ui-react';

const Container = ({ children, className }) => (
    <SUIContainer className={className}>
        {children}
    </SUIContainer>
);

export default Container;