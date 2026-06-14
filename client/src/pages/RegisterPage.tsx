import { useState } from "react";

import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import api from "../api/axios";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleRegister =
    async () => {
      try {
        setLoading(true);

        await api.post(
          "/auth/register",
          {
            name,
            email,
            password,
          }
        );

        alert(
          "Account created successfully!"
        );

        navigate("/login");
      } catch (error) {
        console.error(error);

        alert(
          "Registration failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
        background:
          "#F8F7FB",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 420,
          p: 5,
          borderRadius: 5,
          border:
            "1px solid #ECE8F5",
          boxShadow:
            "0 8px 24px rgba(120,100,180,0.08)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: "#23212B",
          }}
        >
          Create Account
        </Typography>

        <Typography
          sx={{
            color: "#6F6A7D",
            mb: 4,
          }}
        >
          Start organizing your tasks today
        </Typography>

        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
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
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
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
              py: 1.5,
              borderRadius: 3,
            }}
          >
            {loading ? (
              <CircularProgress
                size={22}
                color="inherit"
              />
            ) : (
              "Create Account"
            )}
          </Button>
        </Box>

        <Typography
          sx={{
            mt: 3,
            textAlign:
              "center",
          }}
        >
          Already have an
          account?{" "}
          <Link to="/login">
            Sign In
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}