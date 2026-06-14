import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

type Props = {
  open: boolean;

  taskTitle?: string;

  onClose: () => void;

  onDelete: () => void;
};

export default function DeleteTaskDialog({
  open,
  taskTitle,
  onClose,
  onDelete,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        Delete Task?
      </DialogTitle>

      <DialogContent>
        <Typography>
          Are you sure you want to
          delete "{taskTitle}"?
        </Typography>

        <Typography
          sx={{
            mt: 1,
            color: "#6F6A7D",
            fontSize: 14,
          }}
        >
          This action cannot be
          undone.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={onDelete}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}