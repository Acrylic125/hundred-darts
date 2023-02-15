import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  IconButton,
  List,
  ListItemButton,
  Stack,
} from "@mui/material";
import chroma from "chroma-js";
import { useState } from "react";

const DartTagsMenu = ({
  onRequestCreateTag,
  onRequestDeleteTag,
  onRequestUpdateTag,
  tags,
}: {
  onRequestCreateTag?: (name: { name: string; color: string }) => void;
  onRequestUpdateTag?: (tag: {
    id: string;
    name: string;
    color: string;
    active?: boolean;
  }) => void;
  onRequestDeleteTag?: (id: string) => void;
  tags: {
    id: string;
    name: string;
    color: string;
    active?: boolean;
  }[];
}) => {
  const [edittingTag, setEdittingTag] = useState(null);

  return (
    <Stack sx={{ minWidth: 240 }}>
      <Box
        sx={({ spacing, shadows }) => ({
          paddingX: spacing(1),
          boxShadow: shadows[1],
          paddingBottom: spacing(1),
        })}
      >
        <Button
          sx={{
            backgroundColor: "grey.800",
            color: "grey.100",
            "&:hover": {
              backgroundColor: "grey.700",
            },
          }}
          fullWidth
        >
          Create Tag
        </Button>
      </Box>

      {tags.length > 0 && (
        <List
          sx={{
            width: "100%",
            maxHeight: 280,
            overflow: "auto",
          }}
        >
          <Divider />
          {tags.map((tag) => (
            <ListItemButton
              sx={{
                display: "flex",
                flexDirection: "column",
                paddingX: 0,
                paddingY: 0,
                "&:hover .tag-actions": {
                  visibility: "visible",
                },
                ".tag-actions": {
                  visibility: "hidden",
                },
              }}
              key={tag.id}
            >
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
                    >
                      <EditIcon
                        sx={{
                          width: 20,
                          height: 20,
                        }}
                      />
                    </IconButton>
                    <IconButton
                      sx={{
                        width: 32,
                        height: 32,
                        color: "grey.400",
                      }}
                    >
                      <ClearIcon
                        sx={{
                          width: 24,
                          height: 24,
                        }}
                      />
                    </IconButton>
                  </Stack>
                </Stack>
                <Checkbox />
              </Stack>
              <Divider
                sx={{
                  width: "100%",
                }}
              />
            </ListItemButton>
          ))}
        </List>
      )}
    </Stack>
  );
};

export default DartTagsMenu;
