import DoneIcon from "@mui/icons-material/Done";
import { Box, IconButton, InputBase, Menu, Stack } from "@mui/material";
import chroma from "chroma-js";
import { useRef, useState } from "react";
import { SketchPicker } from "react-color";
import type { PartialTag, Tag } from "./types";

const EditDartMenuTag = ({
  tag,
  onRequestUpdateTag,
  onRequestDoneEditTag,
}: {
  tag: Tag;
  onRequestUpdateTag?: (tag: PartialTag) => void;
  onRequestDoneEditTag?: (tag: PartialTag) => void;
}) => {
  const [colorPickerMenu, setColorPickerMenu] = useState<boolean>(false);
  const [name, setName] = useState<string>(tag.name);
  const [color, setColor] = useState<string>(tag.color);
  const colorPickerRef = useRef<HTMLButtonElement | null>(null);

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
      <Menu
        sx={{
          "& .MuiMenu-paper": {
            backgroundColor: "transparent",
          },
        }}
        anchorEl={colorPickerRef.current}
        anchorOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        transformOrigin={{
          horizontal: "left",
          vertical: "top",
        }}
        open={colorPickerMenu}
        onClose={() => {
          setColorPickerMenu(false);
          onRequestUpdateTag?.({
            id: tag.id,
            color,
          });
        }}
      >
        <SketchPicker
          disableAlpha
          color={color}
          onChange={(color) => {
            setColor(color.hex);
          }}
        />
      </Menu>

      <IconButton
        ref={colorPickerRef}
        onClick={() => {
          setColorPickerMenu(true);
        }}
      >
        <Box
          sx={{
            width: 24,
            height: 24,
            backgroundColor: chroma(color).alpha(0.5).hex(),
            borderRadius: "50%",
          }}
        />
      </IconButton>
      <InputBase
        sx={{
          flexGrow: 1,
        }}
        autoFocus
        onBlur={() => {
          console.log("blur name");
          onRequestUpdateTag?.({
            id: tag.id,
            name,
          });
        }}
        placeholder="Tag Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <IconButton
        sx={{
          width: 32,
          height: 32,
          marginRight: 1,
          color: "grey.400",
        }}
        onClick={() => {
          onRequestDoneEditTag?.({
            id: tag.id,
            name,
            color,
          });
        }}
      >
        <DoneIcon />
      </IconButton>
    </Stack>
  );
};

export default EditDartMenuTag;
