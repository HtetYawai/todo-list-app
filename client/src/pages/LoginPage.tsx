import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";

import api from "../api/axios";
import { useAuthStore } from "../store/authStore";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function LoginPage() {
  const navigate = useNavigate();

  const setAuth = useAuthStore(
    (state) => state.setAuth
  );

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
  useState(false);

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response =
        await api.post(
          "/auth/login",
          {
            email,
            password,
          }
        );

      setAuth(
        response.data.user,
        response.data.token
      );

      navigate("/dashboard");
    } catch (error) {
      alert("Invalid email or password");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #f7f7ff, #fff6fb)",
        p: 2,
      }}
    >
      <Paper
        component="form" onSubmit={(e) => {
            e.preventDefault();
            handleLogin()
        }} 
        elevation={0}
        sx={{
          width: 420,
          p: 5,
          borderRadius: 5,
          border: "1px solid #ECE8F5",
          boxShadow: "0 10px 30px rgba(0,0,0,0.04)"
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Welcome Back!
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mb: 4,
          }}
        >
          Sign in to manage your tasks
        </Typography>

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <TextField
          fullWidth
          label="Password"
          type={
            showPassword
            ? "text"
            : "password"
          }

          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          slotProps={{
            input: {
            endAdornment: (
                <InputAdornment position="end">
                <IconButton
                    onClick={() =>
                    setShowPassword(
                        !showPassword
                    )
                    }
                    edge="end"
                >
                    {showPassword ? (
                    <VisibilityOff />
                    ) : (
                    <Visibility />
                    )}
                </IconButton>
                </InputAdornment>
            ),
            },
        }}
        />

        <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
                mt: 3,
                py: 1.6,

                borderRadius: 3,

                background: "#8B7CF6",

                textTransform: "none",

                fontWeight: 600,

                boxShadow: "none",

                "&:hover": {
                background: "#7567E8",
                boxShadow: "none",
                },
            }}
            >
            {loading ? (
                <CircularProgress
                size={24}
                color="inherit"
                />
            ) : (
                "Sign In"
            )}
        </Button>   

        <Typography
          sx={{
            mt: 3,
            textAlign: "center",
          }}
        >
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}