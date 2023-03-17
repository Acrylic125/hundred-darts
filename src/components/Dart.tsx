import { Stack, Box, InputBase, Typography, IconButton } from "@mui/material";
import { useRef, useState } from "react";
import ContextMenu from "./ContextMenu";
import DartTagsMenu from "./dart-menu/DartTagsMenu";
import type { Tag } from "./dart-menu/types";
import AddIcon from "@mui/icons-material/Add";

const Dart = ({
  content: _content,
  onRequestEdit,
  onRequestDelete,
  onRequestSave,
  onRequestDuplicate,
  onRequestClose,
  editMode,
  autoFocusOnEdit,
  tags,
}: {
  content: string;
  onRequestEdit?: () => void;
  onRequestDelete?: () => void;
  onRequestSave?: (content: string) => void;
  onRequestDuplicate?: (content: string) => void;
  onRequestClose?: () => void;
  onRequestCreateTag?: (tag: { name: string; color: string }) => void;
  onRequestUpdateTag?: (tag: {
    id: string;
    name: string;
    color: string;
  }) => void;
  editMode?: boolean;
  autoFocusOnEdit?: boolean;
  tags?: Tag[];
}) => {
  const [contextMenu, setContextMenu] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [content, setContent] = useState(_content);
  const editRef = useRef(null);

  return (
    <Stack
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu(
          contextMenu
            ? null
            : {
                top: e.clientY,
                left: e.clientX,
              }
        );
      }}
      onClick={() => {
        onRequestEdit?.();
      }}
      sx={{
        backgroundColor: "grey.800",
        cursor: "context-menu",
        borderRadius: 2,
        borderWidth: contextMenu || editMode ? 3 : 2,
        borderStyle: contextMenu || editMode ? "dashed" : "solid",
        borderColor: contextMenu || editMode ? "primary.500" : "grey.700",
      }}
    >
      <ContextMenu
        onRequestClose={() => {
          setContextMenu(null);
        }}
        openState={contextMenu}
        sections={[
          {
            items: [
              {
                label: "Duplicate",
                shortcut: "Ctrl+D",
                onClick: () => {
                  setContextMenu(null);
                  onRequestDuplicate?.(content);
                },
              },
              {
                label: "Delete",
                shortcut: "Delete",
                onClick: () => {
                  onRequestDelete?.();
                },
              },
            ],
          },
          {
            items: [
              {
                type: "submenu",
                label: "Attach Tag",
                subMenu: <DartTagsMenu tags={tags ?? []} />,
              },
            ],
          },
        ]}
      />
      <Stack
        sx={{
          padding: ({ spacing }) => spacing(1, 2),
          borderBottom: "2px solid",
          borderColor: "grey.700",
        }}
      >
        <Box>
          <IconButton>
            <AddIcon />
          </IconButton>
        </Box>
      </Stack>

      <Box
        sx={{
          padding: ({ spacing }) => spacing(2, 2),
        }}
      >
        {editMode ? (
          <InputBase
            autoFocus={autoFocusOnEdit}
            inputRef={editRef}
            placeholder="Empty Dart"
            defaultValue={_content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            value={content}
            onFocus={(e) =>
              e.currentTarget.setSelectionRange(
                e.currentTarget.value.length,
                e.currentTarget.value.length
              )
            }
            onBlur={() => {
              if (!editMode) return;
              onRequestClose?.();
              onRequestSave?.(content);
            }}
            sx={{
              width: "100%",
              height: "100%",
              color: "white",
            }}
            multiline
          />
        ) : (
          <Typography
            sx={{
              opacity: content ? 1 : 0.5,
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
            variant="body1"
            component="p"
          >
            {content || "Empty Dart"}
          </Typography>
        )}
      </Box>
    </Stack>
  );
};

export default Dart;
