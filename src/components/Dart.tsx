import { Box, InputBase, Typography } from "@mui/material";
import { useRef, useState } from "react";

const Dart = ({
  content: _content,
  onRequestEdit,
  onRequestSave,
  onRequestClose,
  editMode,
  autoFocusOnEdit,
}: {
  content: string;
  onRequestEdit?: () => void;
  onRequestSave?: (content: string) => void;
  onRequestClose?: () => void;
  editMode?: boolean;
  autoFocusOnEdit?: boolean;
}) => {
  const [content, setContent] = useState(_content);
  const editRef = useRef(null);

  return (
    <Box
      onClick={() => {
        onRequestEdit?.();
      }}
      sx={{
        backgroundColor: "grey.800",
        padding: 2,
        borderRadius: 2,
        borderWidth: editMode ? 2 : 0,
        borderStyle: "dashed",
        borderColor: "primary.500",
      }}
    >
      {editMode ? (
        <InputBase
          autoFocus={autoFocusOnEdit}
          inputRef={editRef}
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
        <Typography variant="body1" component="p">
          {content || "Empty Dart"}
        </Typography>
      )}
    </Box>
  );
};

export default Dart;
