import React from 'react';
import { Container, Menu, Header as SuiHeader } from 'semantic-ui-react';
import NavItem from './NavItem';
import UserInfo from './UserInfo';
import { Icon } from 'semantic-ui-react';

const Header = ({ title, subtitle, icon }) => {
    return (
        <Menu>
            <Container>
                <Menu.Item position="left">
                    <SuiHeader as='h2' style={{ margin: 0 }}>
                        {icon && <Icon name={icon} />}
                        {title}
                        <SuiHeader.Subheader>{subtitle}</SuiHeader.Subheader>
                    </SuiHeader>
                </Menu.Item>
                <NavItem name="Home" path="/" />
                <NavItem name="Buy" path="/buy" />
                <NavItem name="Sell" path="/sell" />
                <NavItem name="User Form" path="/create-user" />
                <Menu.Item position="right">
                    <UserInfo />
                </Menu.Item>
            </Container>
        </Menu>
    );
};

export default Header;