import { Box } from "@mui/material";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Typography from "@mui/material/Typography";
import * as React from "react";

const ContextMenu = ({
  openState,
  onRequestClose,
  sections,
}: {
  openState?: {
    top: number;
    left: number;
  } | null;
  onRequestClose: () => void;
  sections: {
    label?: string;
    items: {
      icon?: React.ReactNode;
      label: string;
      shortcut?: string;
      onClick?: () => void;
    }[];
  }[];
}) => {
  return (
    <Menu
      open={!!openState}
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: "grey.900",
        },
      }}
      onClose={onRequestClose}
      anchorReference="anchorPosition"
      anchorPosition={
        openState ? { top: openState.top, left: openState.left } : undefined
      }
    >
      <MenuList sx={{ width: 240, maxWidth: "100%", paddingY: 0, marginY: 0 }}>
        {sections.map((section, sectionIndex) => {
          return (
            <Box key={sectionIndex}>
              {sectionIndex > 0 && <Divider />}
              {section.label && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ px: 2, py: 1 }}
                >
                  {section.label}
                </Typography>
              )}
              {section.items.map((item) => (
                <MenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onClick?.();
                  }}
                  key={item.label}
                >
                  {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                  <ListItemText>{item.label}</ListItemText>
                  {item.shortcut && (
                    <Typography variant="body2" color="text.secondary">
                      {item.shortcut}
                    </Typography>
                  )}
                </MenuItem>
              ))}
            </Box>
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default ContextMenu;
