import useLocalOverrideTimeout from "@/utils/useLocalOverrideCallback";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import { Checkbox, Chip, IconButton, Stack, Tooltip } from "@mui/material";
import chroma from "chroma-js";
import { useState } from "react";
import type { Tag } from "./types";

const DartMenuTag = ({
  tag,
  onRequestEditTag,
  onRequestActivateTag,
  onRequestDeleteTag,
}: {
  tag: Tag;
  onRequestEditTag?: (id: string) => void;
  onRequestActivateTag?: (id: string, selected: boolean) => void;
  onRequestDeleteTag?: (id: string) => void;
}) => {
  const [confirmDeleteTimeout, setConfirmDeleteTimeout] = useState<
    null | "prepare" | "ready"
  >(null);
  const readyDeleteTimeout = useLocalOverrideTimeout(() => {
    setConfirmDeleteTimeout("ready");
  }, 1000);

  return (
    <Stack
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingX: 0,
      }}
      direction="row"
    >
      <Stack
        sx={({ spacing }) => ({
          marginLeft: spacing(1),
          alignItems: "center",
        })}
        direction="row"
        gap={1}
      >
        <Chip
          sx={{
            backgroundColor: chroma(tag.color).alpha(0.5).hex(),
          }}
          size="small"
          label={tag.name}
        />
        <Stack sx={{}} className="tag-actions" direction="row">
          <IconButton
            sx={{
              width: 32,
              height: 32,
              color: "grey.400",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onRequestEditTag?.(tag.id);
            }}
          >
            <EditIcon
              sx={{
                width: 20,
                height: 20,
              }}
            />
          </IconButton>
          <Tooltip
            title={
              confirmDeleteTimeout === "ready"
                ? "Click again to confirm deletion."
                : confirmDeleteTimeout === "prepare"
                ? "Click again in 1 second to confirm deletion."
                : "Delete Tag"
            }
          >
            <span
              onMouseLeave={() => {
                if (!confirmDeleteTimeout) return;
                setConfirmDeleteTimeout(null);
                readyDeleteTimeout.cancelCurrent();
              }}
            >
              <IconButton
                sx={{
                  width: 32,
                  height: 32,
                  color:
                    confirmDeleteTimeout !== null ? "error.100" : "grey.400",
                  ":disabled": {
                    color: "grey.200",
                  },
                }}
                color={confirmDeleteTimeout ? "error" : "default"}
                disabled={confirmDeleteTimeout === "prepare"}
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirmDeleteTimeout) {
                    if (confirmDeleteTimeout === "prepare") return;
                    onRequestDeleteTag?.(tag.id);
                    return;
                  }
                  setConfirmDeleteTimeout("prepare");
                  readyDeleteTimeout.start();
                }}
              >
                <ClearIcon
                  sx={{
                    width: 24,
                    height: 24,
                  }}
                />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>
      <Checkbox
        checked={tag.active}
        onChange={() => {
          onRequestActivateTag?.(tag.id, !tag.active);
        }}
      />
    </Stack>
  );
};

export default DartMenuTag;
