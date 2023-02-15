import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  Stack,
} from "@mui/material";
import chroma from "chroma-js";
import { useState } from "react";
import DartMenuTag from "./DartMenuTag";
import EditDartMenuTag from "./EditDartMenuTag";
import type { PartialTag, Tag } from "./types";

const DartTagsMenu = ({
  onRequestCreateTag,
  onRequestDeleteTag,
  onRequestUpdateTag,
  tags,
}: {
  onRequestCreateTag?: (name: { name: string; color: string }) => void;
  onRequestUpdateTag?: (tag: PartialTag) => void;
  onRequestDeleteTag?: (id: string) => void;
  tags: Tag[];
}) => {
  const [edittingTag, setEdittingTag] = useState<string | null>(null);

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
          onClick={() => {
            onRequestCreateTag?.({
              name: "New Tag",
              color: chroma.random().hex(),
            });
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
              onClick={() => {
                onRequestUpdateTag?.({
                  id: tag.id,
                  active: !tag.active,
                });
              }}
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
              {edittingTag === tag.id ? (
                <EditDartMenuTag
                  tag={tag}
                  onRequestUpdateTag={(tag) => {
                    onRequestUpdateTag?.(tag);
                  }}
                  onRequestDoneEditTag={() => {
                    setEdittingTag(null);
                  }}
                />
              ) : (
                <DartMenuTag
                  tag={tag}
                  onRequestEditTag={(id) => {
                    setEdittingTag(id);
                  }}
                  onRequestUpdateTag={(tag) => {
                    onRequestUpdateTag?.(tag);
                  }}
                  onRequestDeleteTag={(id) => {
                    onRequestDeleteTag?.(id);
                  }}
                />
              )}
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
