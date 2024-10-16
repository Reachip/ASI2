import React from 'react';
import { Dropdown, Icon } from 'semantic-ui-react';

const UserInfo = () => {
  const handleLogout = () => {
    console.log('TODO: handle logout');
  };

  return (
    <Dropdown item trigger={<Icon name="user circle" size="large" style={{ cursor: 'pointer' }} />}>
      <Dropdown.Menu>
        <Dropdown.Item text="Profile" />
        <Dropdown.Item text="Logout" onClick={handleLogout} />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserInfo;
