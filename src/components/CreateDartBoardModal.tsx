import { useState } from "react";
import {
  Button,
  CircularProgress,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const CreateDartBoardModal = ({
  open,
  loading,
  onCreate,
  onClose,
}: {
  open: boolean;
  loading?: boolean;
  onCreate?: ({ name }: { name: string }) => void;
  onClose?: () => void;
}) => {
  const [name, setName] = useState("");

  return (
    <Modal
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      open={open}
      onClose={onClose}
      aria-labelledby="Create Dart Board"
      aria-describedby="Modal to create a dart board"
    >
      <Stack
        sx={({ palette, spacing }) => ({
          width: "80%",
          maxWidth: 720,
          overflow: "auto",
          backgroundColor: "grey.900",
          color: "grey.50",
          borderTopWidth: 10,
          borderTopStyle: "solid",
          borderColor: palette.primary.main,
          borderRadius: 2,
          padding: spacing(4, 4),
        })}
        direction="column"
        gap={4}
      >
        <form
          style={{
            width: "100%",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            onCreate?.({ name });
          }}
        >
          <Stack
            sx={{
              width: "100%",
            }}
            direction="column"
            gap={4}
          >
            <Typography
              sx={{
                fontWeight: "bold",
              }}
              variant="h4"
              component="h2"
            >
              Create Dart Board
            </Typography>
            <Stack gap={1} direction="column">
              <Typography variant="body1" component="p" color="grey.300">
                Name the dart board
              </Typography>
              <TextField
                placeholder="Dart Board Name"
                name="Dart Board Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                fullWidth
              />
            </Stack>
            <Stack direction="row" gap={1}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || name.length === 0}
              >
                <Stack direction="row" gap={1}>
                  {loading && <CircularProgress size={24} />}
                  <Typography variant="body1" component="p">
                    Create
                  </Typography>
                </Stack>
              </Button>
              <Button onClick={onClose} variant="text" size="large">
                <Typography variant="body1" component="p">
                  Cancel
                </Typography>
              </Button>
            </Stack>
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
};

export default CreateDartBoardModal;
