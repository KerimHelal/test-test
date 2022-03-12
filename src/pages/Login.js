import { useCallback, useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useAuth0 } from "../react-auth0-spa";
import OtpInput from 'react-otp-input';
import history from "../utils/history";

export default function Login() {

    const { loading, otpSent, handleAuth, handleVerifyToken, otpError, email, setEmail, isAuthenticated } = useAuth0();
    const [otp, setOtp] = useState();

    useEffect(() => {
        if (isAuthenticated) {
            history.push('/dashboard');
        }
    }, [isAuthenticated])

    const handleSubmit = () => {
        if (email) {
            handleAuth(email);
        }
    }

    const handleVerifyOtp = () => {
        if (otp && otp.length === 6) {
            handleVerifyToken(email, otp);
        } else {

        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h3" variant="h3" sx={{ marginBottom: 5 }}>
                    Sign in
                </Typography>
                {!otpSent && (
                    <Box sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleSubmit}
                        >
                            Sign In
                        </Button>
                    </Box>
                )}
                {otpSent && (
                    <Box sx={{ mt: 1 }}>
                        <OtpInput
                            onChange={value => setOtp(value)}
                            numInputs={6}
                            separator="-"
                            inputStyle="otpInputStyle"
                            value={otp}
                            hasErrored={otpError}
                        />
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleVerifyOtp}
                        >
                            Verify OTP
                        </Button>
                    </Box>
                )}
            </Box>
        </Container>
    );
}