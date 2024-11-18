import React from "react";
import Avatar from "@mui/material/Avatar";

const UserAvatar = ({ username }) => {
    const avatarUrl = `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(username)}`;

    return (
        <Avatar
            sx={{ mr: 1 }}
            alt={username}
            src={avatarUrl}
        >
            {username.charAt(0).toUpperCase()}
        </Avatar>
    );
};

export default UserAvatar;