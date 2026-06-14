import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Chip,
} from "@mui/material";

import { useEffect, useState } from "react";

import api from "../api/axios";
import Navbar from "../components/Navbar";

type Task = {
  id: number;
  title: string;
  description?: string;
  status: string;
  dueDate?: string;

  category?: {
    id: number;
    name: string;
  };

  owner: {
    id: number;
    name: string;
    email: string;
  };
};

export default function AssignmentsPage() {
  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchAssignments =
    async () => {
      try {
        const response =
          await api.get(
            "/tasks/assigned"
          );

        setTasks(
          response.data
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

        useEffect(() => {
        const loadAssignments = async () => {
            await fetchAssignments();
        };

        void loadAssignments();
        }, []);
        
  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          background: "#F8F7FB",
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
          My Assignments
        </Typography>

        <Typography
          sx={{
            color: "#6F6A7D",
            mb: 4,
          }}
        >
          Tasks assigned to you
        </Typography>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent:
                "center",
              mt: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : tasks.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              border:
                "1px solid #ECE8F5",
              borderRadius: 3,
            }}
          >
            <Typography
              color="text.secondary"
            >
              No tasks assigned to you.
            </Typography>
          </Paper>
        ) : (
          tasks.map((task) => (
            <Paper
              key={task.id}
              elevation={0}
              sx={{
                p: 3,
                mb: 2,
                border:
                  "1px solid #ECE8F5",
                borderRadius: 3,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                {task.title}
              </Typography>

              {task.description && (
                <Typography
                  sx={{
                    mt: 1,
                    color:
                      "#6F6A7D",
                  }}
                >
                  {
                    task.description
                  }
                </Typography>
              )}

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    color:
                      "#8A849A",
                  }}
                >
                  Assigned by{" "}
                  {
                    task.owner
                      .name
                  }
                </Typography>

                <Chip
                  label={task.status}
                  size="small"
                />
              </Box>
            </Paper>
          ))
        )}
      </Box>
    </>
  );
}