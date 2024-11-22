import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const PopupDialog = ({ open, onClose, title, actions, children, maxWidth = 'md', fullWidth = true }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
        >
            {title && <DialogTitle>{title}</DialogTitle>}
            <DialogContent>
                {children}
            </DialogContent>
            {actions && <DialogActions>{actions}</DialogActions>}
        </Dialog>
    );
};

export default PopupDialog;