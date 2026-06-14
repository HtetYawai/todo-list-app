import { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";

import api from "../api/axios";
import Navbar from "../components/Navbar";

type Collaborator = {
  id: number;

  collaborator: {
    id: number;
    name: string;
    email: string;
  };
};

export default function CollaboratorsPage() {
  const [email, setEmail] =
    useState("");

  const [
    collaborators,
    setCollaborators,
  ] = useState<
    Collaborator[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const fetchCollaborators =
    async () => {
      try {
        const response =
          await api.get(
            "/collaborators"
          );

        setCollaborators(
          response.data
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const addCollaborator =
    async () => {
      if (!email.trim()) {
        return;
      }

      try {
        await api.post(
          "/collaborators",
          {
            email,
          }
        );

        setEmail("");

        fetchCollaborators();
      } catch (error) {
        console.error(error);

        alert(
          "Unable to add collaborator. The user doesn't exist."
        );
      }
    };

  const removeCollaborator =
    async (id: number) => {
      try {
        await api.delete(
          `/collaborators/${id}`
        );

        fetchCollaborators();
      } catch (error) {
        console.error(error);
      }
    };

useEffect(() => {
  const loadCollaborators = async () => {
    await fetchCollaborators();
  };

  void loadCollaborators();
}, []);

  if (loading) {
    return (
      <>
        <Navbar />

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "center",
            mt: 10,
          }}
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          background:
            "#F8F7FB",
          p: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 0.5,
          }}
        >
          Collaborators
        </Typography>

        <Typography
          sx={{
            color: "#6F6A7D",
            mb: 4,
          }}
        >
          Add people you want
          to assign tasks to
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            border:
              "1px solid #ECE8F5",
            borderRadius: 3,
          }}
        >
          <Typography
            sx={{
              mb: 2,
              fontWeight: 600,
            }}
          >
            Add Collaborator
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <Button
              variant="contained"
              onClick={
                addCollaborator
              }
            >
              Add
            </Button>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            border:
              "1px solid #ECE8F5",
            borderRadius: 3,
          }}
        >
          <Typography
            sx={{
              mb: 2,
              fontWeight: 600,
            }}
          >
            Your Collaborators
          </Typography>

          {collaborators.length ===
          0 ? (
            <Typography
              color="text.secondary"
            >
              No collaborators
              added yet.
            </Typography>
          ) : (
            collaborators.map(
              (
                collaborator
              ) => (
                <Box
                  key={
                    collaborator.id
                  }
                  sx={{
                    py: 1.5,

                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",

                    borderBottom:
                      "1px solid #F1EEF7",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {
                        collaborator
                          .collaborator
                          .name
                      }
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {
                        collaborator
                          .collaborator
                          .email
                      }
                    </Typography>
                  </Box>

                  <IconButton
                    onClick={() =>
                      removeCollaborator(
                        collaborator.id
                      )
                    }
                    sx={{
                      color:
                        "#E57373",
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              )
            )
          )}
        </Paper>
      </Box>
    </>
  );
}