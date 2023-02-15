import { Box, InputBase, Typography } from "@mui/material";
import { useRef, useState } from "react";
import ContextMenu from "./ContextMenu";

const Dart = ({
  content: _content,
  onRequestEdit,
  onRequestDelete,
  onRequestSave,
  onRequestDuplicate,
  onRequestClose,
  editMode,
  autoFocusOnEdit,
}: {
  content: string;
  onRequestEdit?: () => void;
  onRequestDelete?: () => void;
  onRequestSave?: (content: string) => void;
  onRequestDuplicate?: (content: string) => void;
  onRequestClose?: () => void;
  editMode?: boolean;
  autoFocusOnEdit?: boolean;
}) => {
  const [contextMenu, setContextMenu] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [content, setContent] = useState(_content);
  const editRef = useRef(null);

  return (
    <>
      <Box
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
          padding: 2,
          borderRadius: 2,
          borderWidth: contextMenu || editMode ? 3 : 0,
          borderStyle: "dashed",
          borderColor: "primary.500",
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
                  label: "Attach Label",
                  subMenu: (
                    <Box
                      sx={{
                        backgroundColor: "grey.800",
                        padding: 2,
                        borderRadius: 2,
                        borderWidth: 3,
                        borderStyle: "dashed",
                        borderColor: "primary.500",
                      }}
                    >
                      Hello
                    </Box>
                  ),
                },
              ],
            },
          ]}
        />
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
    </>
  );
};

export default Dart;
