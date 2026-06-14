import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { useState } from "react";

import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const navigate = useNavigate();

  const [openLogout, setOpenLogout] =
    useState(false);

  const logout = useAuthStore(
    (state) => state.logout
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "#FCFBFE",
          borderBottom:
            "1px solid #ECE8F5",
        }}
      >
        <Toolbar
            sx={{
                flexDirection: {
                xs: "column",
                sm: "row",
                },
                py: {
                xs: 1,
                sm: 0,
                },
                gap: {
                xs: 1,
                sm: 0,
                },
            }}
            >
            <Box
                sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                }}
                onClick={() =>
                navigate("/dashboard")
                }
            >
                <AssignmentOutlinedIcon
                sx={{
                    color: "#8B7CF6",
                }}
                />

                <Typography
                sx={{
                    fontWeight: 700,
                    color: "#23212B",
                }}
                >
                MyTasks
                </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Box
                sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 1,
                width: {
                    xs: "100%",
                    sm: "auto",
                },
                }}
            >
                <Button
                onClick={() =>
                    navigate("/dashboard")
                }
                sx={{
                    color: "#23212B",
                }}
                >
                Dashboard
                </Button>

                <Button
                onClick={() =>
                    navigate("/tasks")
                }
                sx={{
                    color: "#23212B",
                }}
                >
                Tasks
                </Button>

                <Button
                onClick={() =>
                    navigate("/assignments")
                }
                sx={{
                    color: "#23212B",
                }}
                >
                Assignments
                </Button>

                <Button
                onClick={() =>
                    navigate("/collaborators")
                }
                sx={{
                    color: "#23212B",
                }}
                >
                Collaborators
                </Button>

                <Button
                onClick={() =>
                    setOpenLogout(true)
                }
                sx={{
                    color: "#E57373",
                }}
                >
                Logout
                </Button>
            </Box>
            </Toolbar>
      </AppBar>

      <Dialog
        open={openLogout}
        onClose={() =>
          setOpenLogout(false)
        }
      >
        <DialogTitle>
          Sign out?
        </DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to sign out
            of your account?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setOpenLogout(false)
            }
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}