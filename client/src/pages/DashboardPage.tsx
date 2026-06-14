import {
  Box,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";

import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function DashboardPage() {
    type Reminder = {
    id: number;

    title: string;

    reminderAt?: string;
    };

    const [
        reminders,
        setReminders,
        ] = useState<Reminder[]>(
        []
        );

    const navigate = useNavigate();


    const fetchReminders =
        async () => {
            try {
            const response =
                await api.get(
                "/tasks/reminders"
                );

            setReminders(
                response.data
            );
            } catch (error) {
            console.error(error);
            }
        };
            
    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        pendingTasks: 0,
        completionRate: 0
        });

        type Task = {
            id: number;
            title: string;
            status: string;

            category?: {
                name: string;
        };
        };
    
    const [recentTasks, setRecentTasks] = useState<Task[]>([]);
    

        useEffect(() => {
            const fetchDashboardData =
                async () => {
                try {
                    const [
                    statsResponse,
                    recentResponse,
                    remindersResponse,
                    ] = await Promise.all([
                    api.get(
                        "/tasks/dashboard"
                    ),

                    api.get(
                        "/tasks/recent"
                    ),

                    api.get(
                        "/tasks/reminders"
                    ),
                    ]);
                    console.log("Reminder API:",
                        remindersResponse.data
                    );

                    setStats(
                    statsResponse.data
                    );

                    setRecentTasks(
                    recentResponse.data
                    );

                    setReminders(
                    remindersResponse.data
                    );
                } catch (error) {
                    console.error(error);
                }
                };

            fetchDashboardData();
            }, []);

      const cardStyle = {
  p: 2.5,
  bgcolor: "#FCFBFE",
  border: "1px solid #ECE8F5",
  borderRadius: 3,
  boxShadow:
    "0 4px 12px rgba(120,100,180,0.06)",
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow:
      "0 8px 18px rgba(120,100,180,0.10)",
  },
};  




  return (
    <>
    <Navbar/>
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
          color: "#23212B",
          letterSpacing: "-0.02em",
          mb: 0.5,
        }}
      >
        Welcome back!
      </Typography>

      <Typography 
      sx={{
        color: "#6F6A7D",
        mb: 4
        }}>
        Today's progress at a glance
      </Typography>

      <Grid container spacing={2}>
        {/* Total Tasks */}
        <Grid size={{ xs: 6 }}>
          <Paper
  elevation={0}
  onClick={() =>
    navigate("/tasks")
  }
  sx={cardStyle}
>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box>
                <Typography color="text.secondary">
                  Total Tasks
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    mt: 1,
                    fontWeight: 700,
                    color: "#2D2A38",
                  }}
                >
                  {stats.totalTasks}
                </Typography>
              </Box>

              <AssignmentOutlinedIcon
                sx={{
                  color: "#2D2A38",
                  opacity: 0.7,
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Completed */}
        <Grid size={{ xs: 6 }}>
          <Paper
  elevation={0}
  onClick={() =>
    navigate(
      "/tasks?status=COMPLETED"
    )
  }
  sx={cardStyle}
>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box>
                <Typography color="text.secondary">
                  Completed
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    mt: 1,
                    fontWeight: 700,
                    color: "#5FAE7B",
                  }}
                >
                  {stats.completedTasks}
                </Typography>
              </Box>

              <CheckCircleOutlineIcon
                sx={{
                  color: "#5FAE7B",
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* In Progress */}
        <Grid size={{ xs: 6 }}>
          <Paper
  elevation={0}
  onClick={() =>
    navigate(
      "/tasks?status=IN_PROGRESS"
    )
  }
  sx={cardStyle}
>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box>
                <Typography color="text.secondary">
                  In Progress
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    mt: 1,
                    fontWeight: 700,
                    color: "#6D8FE8",
                  }}
                >
                  {stats.inProgressTasks}
                </Typography>
              </Box>

              <ScheduleOutlinedIcon
                sx={{
                  color: "#6D8FE8",
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Pending */}
        <Grid size={{ xs: 6 }}>
          <Paper
  elevation={0}
  onClick={() =>
    navigate(
      "/tasks?status=PENDING"
    )
  }
  sx={cardStyle}
>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box>
                <Typography color="text.secondary">
                  Pending
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    mt: 1,
                    fontWeight: 700,
                    color: "#D4A24C",
                  }}
                >
                  {stats.pendingTasks}
                </Typography>
              </Box>

              <AccessTimeOutlinedIcon
                sx={{
                  color: "#D4A24C",
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Paper
  elevation={0}
  sx={{
    mt: 3,
    p: 3,
    bgcolor: "#FCFBFE",
    border: "1px solid #ECE8F5",
    borderRadius: 3,
    boxShadow:
      "0 4px 12px rgba(120,100,180,0.06)",
  }}
>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      mb: 2,
    }}
  >
    <EmojiEventsOutlinedIcon
      sx={{
        color: "#D4A24C",
      }}
    />

    <Typography
      variant="h6"
      sx={{
        fontWeight: 600,
        color: "#23212B",
      }}
    >
      Completion Rate
    </Typography>
  </Box>

  <Typography
    sx={{
      fontSize: 48,
      fontWeight: 700,
      color: "#5FAE7B",
      textAlign: "center",
      lineHeight: 1,
    }}
  >
    {stats.completionRate}%
  </Typography>

    <Typography
    sx={{
        textAlign: "center",
        color: "#6F6A7D",
        mt: 1,
    }}
    >
    {stats.completionRate >= 80
        ? "Excellent productivity!"
        : stats.completionRate >= 50
        ? "You're making good progress."
        : "Let's complete a few more tasks today."}
    </Typography>
    </Paper>
    <Paper
        elevation={0}
        sx={{
            p: 3,
            mb: 3,

            border:
            "1px solid #ECE8F5",

            borderRadius: 3,

            bgcolor: "#FCFBFE",
        }}
        >
        <Typography
            variant="h6"
            sx={{
            fontWeight: 600,
            mb: 2,
            }}
        >
            🔔 Upcoming Reminders
        </Typography>

        {reminders.length === 0 ? (
            <Typography
            color="text.secondary"
            >
            No upcoming reminders
            </Typography>
        ) : (
            reminders.map(
            (reminder) => (
                <Box
                key={reminder.id}
                sx={{
                    mb: 2,
                }}
                >
                <Typography
                    sx={{
                    fontWeight: 600,
                    }}
                >
                    {reminder.title}
                </Typography>

                <Typography
                    sx={{
                    fontSize: 13,
                    color:
                        "#8A849A",
                    }}
                >
                    {new Date(
                    reminder.reminderAt!
                    ).toLocaleString()}
                </Typography>
                </Box>
            )
            )
        )}
        </Paper>
    <Paper
    elevation={0}
    sx={{
        mt: 3,
        p: 3,
        bgcolor: "#FCFBFE",
        border: "1px solid #ECE8F5",
        borderRadius: 3,
        boxShadow:
        "0 4px 12px rgba(120,100,180,0.06)",
    }}
    >
    <Typography
        variant="h6"
        sx={{
        mb: 2,
        fontWeight: 600,
        color: "#23212B",
        }}
    >
        Recent Tasks
    </Typography>

    {recentTasks.map(
        (task) => (
        <Box
  key={task.id}
  onClick={() =>
    navigate("/tasks")
  }
  sx={{
    py: 1.5,
    display: "flex",
    justifyContent: "space-between",
    borderBottom:
      "1px solid #F1EEF7",
    cursor: "pointer",
    transition: "0.2s",
    "&:hover": {
      background:
        "#FAF9FD",
    },
  }}
>
            <Box>
            <Typography
                sx={{
                fontWeight: 500,
                }}
            >
                {task.title}
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
            >
                {
                task.category
                    ?.name
                }
            </Typography>
            </Box>

            <Typography
            sx={{
                fontSize: 10,
                color:
                "#6F6A7D",
            }}
            >
            {task.status}
            </Typography>
        </Box>
        )
    )}
    </Paper>
    </Box>
    </>
  );
}

