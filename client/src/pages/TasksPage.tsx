import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  TextField,
  Chip,
  FormControl,
  Select,
} from "@mui/material";

import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import IconButton from "@mui/material/IconButton";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import api from "../api/axios";

import AssigneeSelect, {
  type User,
} from "../components/AssigneeSelect";
type Task = {
  id: number;
  title: string;
  description?: string;
  status: string;
  dueDate?: string;
  reminderAt?: string;

  category?: {
    id: number;
    name: string;
  };
  assignedTo?: {
  id: number;
  name: string;
  email: string;
};
};

type Category = {
  id: number;
  name: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const [status, setStatus] = useState("");

const [openCreate, setOpenCreate] = useState(false);

const [title, setTitle] = useState("");
const [description, setDescription] = useState("");

const [categories, setCategories] = useState<Category[]>([]);

const [categoryId, setCategoryId] = useState("");

const [statusValue, setStatusValue] = useState("PENDING");

const [dueDate, setDueDate] = useState("");
const [reminderAt, setReminderAt] = useState("");

const [openDelete, setOpenDelete] = useState(false);
const [selectedTask, setSelectedTask] = useState<Task | null>(null);

const [editingTask, setEditingTask] =
  useState<Task | null>(null);

const [users, setUsers] =
  useState<User[]>([]);

const [
  assignedToId,
  setAssignedToId,
] = useState("");

  const fetchTasks = async (
    searchValue = search,
    statusValue = status
  ) => {
    try {
      const response =
        await api.get("/tasks", {
          params: {
            search: searchValue,
            status: statusValue,
          },
        });

      setTasks(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
  try {
    const response =
      await api.get(
        "/categories"
      );
      console.log("CATEGORIES:",
        response.data
      );

    setCategories(
      response.data
    );
  } catch (error) {
    console.error(error);
  }
};
    const createTask = async () => {
  try {
   await api.post("/tasks", {
    title,
    description,

    status: statusValue,

    dueDate:
        dueDate || null,

    reminderAt:
        reminderAt || null,

    categoryId:
        categoryId
        ? Number(categoryId)
        : null,

    assignedToId:
        assignedToId
        ? Number(assignedToId)
        : null,
    });

    setTitle("");
    setDescription("");

    setCategoryId("");
    setAssignedToId("");

    setStatusValue(
      "PENDING"
    );

    setDueDate("");
    setReminderAt("");

    setOpenCreate(false);

    fetchTasks();
  } catch (error) {
    console.error(error);
  }
};

const updateTask = async () => {
  if (!editingTask) return;

  try {
    await api.patch(
    `/tasks/${editingTask.id}`,
    {
        title,
        description,
        status: statusValue,

        dueDate:
        dueDate || null,

        reminderAt:
        reminderAt || null,

        categoryId:
        categoryId
            ? Number(categoryId)
            : null,

        assignedToId:
        assignedToId
            ? Number(assignedToId)
            : null,
    }
    );

    setEditingTask(null);
    setAssignedToId("");

    setOpenCreate(false);

    fetchTasks();
  } catch (error) {
    console.error(error);
  }
};

const updateTaskStatus = async (
  taskId: number,
  newStatus: string
) => {
  try {
    await api.patch(
      `/tasks/${taskId}`,
      {
        status: newStatus,
        assignedToId:
  assignedToId
    ? Number(
        assignedToId
      )
    : null,
      }
      
    );

    fetchTasks(
      search,
      status
    );
  } catch (error) {
    console.error(error);
  }
};

const getStatusIcon = (
  status: string
) => {
  switch (status) {
    case "PENDING":
      return (
        <RadioButtonUncheckedIcon
          sx={{
            fontSize: 16,
            color: "#D4A24C",
          }}
        />
      );

    case "IN_PROGRESS":
      return (
        <PendingOutlinedIcon
          sx={{
            fontSize: 16,
            color: "#6D8FE8",
          }}
        />
      );

    case "COMPLETED":
      return (
        <CheckCircleOutlineIcon
          sx={{
            fontSize: 16,
            color: "#5FAE7B",
          }}
        />
      );
  }
};

const getStatusLabel = (
  status: string
) => {
  switch (status) {
    case "PENDING":
      return "To Do";

    case "IN_PROGRESS":
      return "In Progress";

    case "COMPLETED":
      return "Done";

    default:
      return status;
  }
};

const deleteTask = async () => {
  if (!selectedTask) return;

  try {
    await api.delete(
      `/tasks/${selectedTask.id}`
    );

    setOpenDelete(false);

    fetchTasks();
  } catch (error) {
    console.error(error);
  }
};

const fetchUsers = async () => {
  try {
    const response =
      await api.get(
        "/collaborators"
      );

    const collaborators =
      response.data.map(
        (item: {
          collaborator: User;
        }) =>
          item.collaborator
      );

    setUsers(
      collaborators
    );
  } catch (error) {
    console.error(error);
  }
};

    useEffect(() => {
    const loadData = async () => {
        await Promise.all([
        fetchTasks("", ""),
        fetchCategories(),
        fetchUsers(),
        ]);
    };

    void loadData();
    }, []);

  if (loading) {
    return (
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
    );
  }

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
          mb: 0.5,
        }}
      >
        Tasks
      </Typography>

      <Typography
        sx={{
          color: "#6F6A7D",
          mb: 3,
        }}
      >
        Manage and organize your tasks
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          mb: 3,
          overflowX: "auto",
        }}
      >
        <Chip
  label="All"
  clickable
  onClick={() => {
    setStatus("");
    fetchTasks(search, "");
  }}
  sx={{
    bgcolor:
      status === ""
        ? "#8B7CF6"
        : "#EAE8EF",

    color:
      status === ""
        ? "#FFFFFF"
        : "#2D2A38",

    fontWeight: 500,
  }}
/>

<Chip
  label="Pending"
  clickable
  onClick={() => {
    setStatus("PENDING");

    fetchTasks(
      search,
      "PENDING"
    );
  }}
  sx={{
    bgcolor:
      status === "PENDING"
        ? "#8B7CF6"
        : "#EAE8EF",

    color:
      status === "PENDING"
        ? "#FFFFFF"
        : "#2D2A38",

    fontWeight: 500,
  }}
/>

<Chip
  label="In Progress"
  clickable
  onClick={() => {
    setStatus(
      "IN_PROGRESS"
    );

    fetchTasks(
      search,
      "IN_PROGRESS"
    );
  }}
  sx={{
    bgcolor:
      status ===
      "IN_PROGRESS"
        ? "#8B7CF6"
        : "#EAE8EF",

    color:
      status ===
      "IN_PROGRESS"
        ? "#FFFFFF"
        : "#2D2A38",

    fontWeight: 500,
  }}
/>

<Chip
  label="Completed"
  clickable
  onClick={() => {
    setStatus(
      "COMPLETED"
    );

    fetchTasks(
      search,
      "COMPLETED"
    );
  }}
  sx={{
    bgcolor:
      status ===
      "COMPLETED"
        ? "#8B7CF6"
        : "#EAE8EF",

    color:
      status ===
      "COMPLETED"
        ? "#FFFFFF"
        : "#2D2A38",

    fontWeight: 500,
  }}
/>
      </Box>

      <TextField
        fullWidth
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => {
          const value =
            e.target.value;

          setSearch(value);

          fetchTasks(
            value,
            status
          );
        }}
        sx={{
          mb: 3,
        }}
      />

      {tasks.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "#FCFBFE",
            border:
              "1px solid #ECE8F5",
            borderRadius: 3,
          }}
        >
          <Typography
            color="text.secondary"
          >
            No tasks found
          </Typography>
        </Paper>
      ) : (
        tasks.map((task) => (
          <Paper
            key={task.id}
            elevation={0}
            sx={{
              p: 2.5,
              mb: 2,
              bgcolor: "#FCFBFE",
              border:
                "1px solid #ECE8F5",
              borderRadius: 3,
              boxShadow:
                "0 4px 12px rgba(120,100,180,0.06)",
            }}
          >
            <Box
  sx={{
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
  }}
>
    <Box
  sx={{
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "flex-start",
  }}
>
  <Typography
    sx={{
      fontWeight: 600,
      flex: 1,
      pr: 1,
    }}
  >
    {task.title}
  </Typography>

  <Box>
    <IconButton
  size="small"
  onClick={() => {
    setEditingTask(task);

    setTitle(task.title);

    setDescription(
      task.description || ""
    );

    setCategoryId(
      task.category?.id?.toString() ||
        ""
    );

    setStatusValue(
      task.status
    );

    setDueDate(
      task.dueDate
        ? task.dueDate
            .split("T")[0]
        : ""
    );

    setReminderAt(
        task.reminderAt
            ? task.reminderAt.slice(0, 16)
            : ""
        );

    setAssignedToId(
  task.assignedTo?.id?.toString() || ""
);

    setOpenCreate(true);
  }}
  sx={{
    color: "#6F6A7D",
  }}
>
      <EditOutlinedIcon
        fontSize="small"
      />
    </IconButton>

    <IconButton
      size="small"
      onClick={() => {
        setSelectedTask(task);
        setOpenDelete(true);
      }}
      sx={{
        color: "#E57373",
      }}
    >
      <DeleteOutlineIcon
        fontSize="small"
      />
    </IconButton>
  </Box>
</Box>

</Box>

            {task.description && (
              <Typography
                sx={{
                  mt: 0.5,
                  color: "#6F6A7D",
                  fontSize: 14,
                }}
              >
                {task.description}
              </Typography>
            )}

            {task.reminderAt && (
            <Typography
                sx={{
                mt: 1,
                fontSize: 13,
                color: "#F59E0B",
                fontWeight: 500,
                }}
            >
                ⏰ Reminder:{" "}
                {new Date(
                task.reminderAt
                ).toLocaleString()}
            </Typography>
            )}

            <Typography
                sx={{
                    mt: 0.5,
                    fontSize: 13,
                    color: "#8A849A",
                }}
                >
                Assigned to:{" "}
                {task.assignedTo?.name ??
                    "Nobody"}
                </Typography>

            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  color: "#8A849A",
                }}
              >
                {task.category?.name ??
                  "No Category"}
              </Typography>

              <FormControl
  size="small"
  sx={{
    minWidth: 150,
  }}
>
  <Select
    value={task.status}
    onChange={(e) =>
      updateTaskStatus(
        task.id,
        e.target.value
      )
    }
    renderValue={(value) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {getStatusIcon(
          value as string
        )}

        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {getStatusLabel(
            value as string
          )}
        </Typography>
      </Box>
    )}
    sx={{
      height: 36,
      borderRadius: 999,

      bgcolor:
        task.status ===
        "COMPLETED"
          ? "#EAF8EF"
          : task.status ===
            "IN_PROGRESS"
          ? "#E8EEFF"
          : "#FFF4DD",

      "& .MuiOutlinedInput-notchedOutline":
        {
          border: "none",
        },

      "& .MuiSelect-select":
        {
          py: 0.75,
        },
    }}
  >
    <MenuItem value="PENDING">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <RadioButtonUncheckedIcon
          sx={{
            fontSize: 16,
            color: "#D4A24C",
          }}
        />

        To Do
      </Box>
    </MenuItem>

    <MenuItem value="IN_PROGRESS">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <PendingOutlinedIcon
          sx={{
            fontSize: 16,
            color: "#6D8FE8",
          }}
        />

        In Progress
      </Box>
    </MenuItem>

    <MenuItem value="COMPLETED">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <CheckCircleOutlineIcon
          sx={{
            fontSize: 16,
            color: "#5FAE7B",
          }}
        />

        Done
      </Box>
    </MenuItem>
  </Select>
</FormControl>
            </Box>
          </Paper>
        ))
      )}

      <Dialog
  open={openCreate}
  onClose={() =>
    setOpenCreate(false)
  }
  fullWidth
>
  <DialogTitle>
  {editingTask
    ? "Edit Task"
    : "Create Task"}
</DialogTitle>

  <DialogContent>
  <TextField
    label="Title"
    fullWidth
    margin="normal"
    value={title}
    onChange={(e) =>
      setTitle(
        e.target.value
      )
    }
  />

  <TextField
    label="Description"
    fullWidth
    multiline
    rows={3}
    margin="normal"
    value={description}
    onChange={(e) =>
      setDescription(
        e.target.value
      )
    }
  />

  <TextField
  select
  label="Category"
  fullWidth
  margin="normal"
  value={categoryId}
  onChange={(e) =>
    setCategoryId(
      e.target.value
    )
  }
>
  {categories.map(
    (category) => (
      <MenuItem
        key={category.id}
        value={category.id}
      >
        {category.name}
      </MenuItem>
    )
  )}
</TextField>

<AssigneeSelect
  users={users}
  assignedToId={assignedToId}
  setAssignedToId={setAssignedToId}
/>

  <TextField
    select
    label="Status"
    fullWidth
    margin="normal"
    value={statusValue}
    onChange={(e) =>
      setStatusValue(
        e.target.value
      )
    }
  >
    <MenuItem value="PENDING">
      Pending
    </MenuItem>

    <MenuItem value="IN_PROGRESS">
      In Progress
    </MenuItem>

    <MenuItem value="COMPLETED">
      Completed
    </MenuItem>
  </TextField>

  <TextField
  label="Due Date"
  type="date"
  fullWidth
  margin="normal"
  value={dueDate}
  onChange={(e) =>
    setDueDate(e.target.value)
  }
  slotProps={{
    inputLabel: {
      shrink: true,
    },
  }}
/>

<TextField
  label="Reminder"
  type="datetime-local"
  fullWidth
  margin="normal"
  value={reminderAt}
  onChange={(e) =>
    setReminderAt(
      e.target.value
    )
  }
  slotProps={{
    inputLabel: {
      shrink: true,
    },
  }}
/>

</DialogContent>

  <DialogActions>
    <Button
  onClick={() => {
    setOpenCreate(false);
    setEditingTask(null);
  }}
>
  Cancel
</Button>

    <Button
  variant="contained"
  onClick={() => {
    if (editingTask) {
      updateTask();
    } else {
      createTask();
    }
  }}
>
  {editingTask
    ? "Save"
    : "Create"}
</Button>
  </DialogActions>
</Dialog>

<Dialog
  open={openDelete}
  onClose={() =>
    setOpenDelete(false)
  }
>
  <DialogTitle>
    Delete Task?
  </DialogTitle>

  <DialogContent>
  <Typography>
    Are you sure you want to delete
    "{selectedTask?.title}"?
  </Typography>

  <Typography
    sx={{
      mt: 1,
      color: "#6F6A7D",
      fontSize: 14,
    }}
  >
    This action cannot be undone.
  </Typography>
</DialogContent>

  <DialogActions>
    <Button
      onClick={() =>
        setOpenDelete(false)
      }
    >
      Cancel
    </Button>

    <Button
      color="error"
      variant="contained"
      onClick={deleteTask}
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>

      <Fab
  color="primary"
  onClick={() => {
  setEditingTask(null);

  setTitle("");
  setDescription("");
  setCategoryId("");
  setAssignedToId("");

  setStatusValue("PENDING");
  setDueDate("");

  setOpenCreate(true);
}}
  sx={{
    position: "fixed",
    bottom: 24,
    right: 24,
  }}
>
  <AddIcon />
</Fab>
    </Box>
    </>
  );
}