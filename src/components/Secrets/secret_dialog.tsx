import { observer } from "mobx-react-lite";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useTranslation } from "react-i18next";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';

const SecretDialog = ({ open, onClose, onUnlock }) => {
    const { t }: { t: any } = useTranslation();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Введите пароль</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    style={{ marginTop: 10 }}
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={togglePasswordVisibility}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    color="error"
                    variant="text"
                    size="large"
                    sx={{
                        mx: 1,
                    }}
                    onClick={onClose}
                >
                    {t("back")}
                </Button>
                <Button
                    color="primary"
                    onClick={() => onUnlock(password)}
                    size="large"
                    sx={{
                        mx: 1,
                        px: 3,
                    }}
                    variant="contained"
                >
                    {t("open")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default observer(SecretDialog);
