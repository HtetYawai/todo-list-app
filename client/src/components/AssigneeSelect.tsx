import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export type User = {
  id: number;
  name: string;
  email: string;
};

type Props = {
  users: User[];

  assignedToId: string;

  setAssignedToId: (
    value: string
  ) => void;
};

export default function AssigneeSelect({
  users,
  assignedToId,
  setAssignedToId,
}: Props) {
  return (
    <FormControl
      fullWidth
      margin="normal"
    >
      <InputLabel>
        Assignee
      </InputLabel>

      <Select
        value={assignedToId}
        label="Assignee"
        onChange={(e) =>
          setAssignedToId(
            e.target.value
          )
        }
      >
        <MenuItem value="">
          Unassigned
        </MenuItem>

        {users.map((user) => (
          <MenuItem
            key={user.id}
            value={user.id}
          >
            {user.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}