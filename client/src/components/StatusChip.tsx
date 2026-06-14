import Chip from "@mui/material/Chip";

import { statusColors } from "../utils/taskColors";

type Props = {
  status:
    | "PENDING"
    | "IN_PROGRESS"
    | "COMPLETED";
};

export default function StatusChip({
  status,
}: Props) {
  return (
    <Chip
      label={status.replace("_", " ")}
      sx={{
        bgcolor:
          statusColors[status].bg,

        color:
          statusColors[status].text,

        fontWeight: 600,

        borderRadius: 2,
      }}
    />
  );
}