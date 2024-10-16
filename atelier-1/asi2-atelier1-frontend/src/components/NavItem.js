import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const NavItem = ({ name, path }) => {
    return (
        <Menu.Item as={Link} to={path}>
            {name}
        </Menu.Item>
    );
};

export default NavItem;