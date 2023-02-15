// Modified version of: https://github.com/steviebaa/mui-nested-menu/blob/main/packages/mui-nested-menu/src/components/NestedMenuItem.tsx
import Menu from "@mui/material/Menu";
import type { FocusEvent, KeyboardEvent, MouseEvent, ReactNode } from "react";
import { useRef, useState } from "react";

const SubMenuItemWrapper = ({
  enabled,
  children,
  menuItem,
}: {
  enabled?: boolean;
  children: ReactNode;
  menuItem: ReactNode;
}) => {
  const menuItemRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuContainerRef = useRef<HTMLDivElement | null>(null);

  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const handleMouseEnter = (e: MouseEvent<HTMLElement>) => {
    setIsSubMenuOpen(true);
    // if (ContainerProps.onMouseEnter) {
    //   ContainerProps.onMouseEnter(e);
    // }
  };
  const handleMouseLeave = (e: MouseEvent<HTMLElement>) => {
    setIsSubMenuOpen(false);
    // if (ContainerProps.onMouseLeave) {
    //   ContainerProps.onMouseLeave(e);
    // }
  };

  // Check if any immediate children are active
  const isSubmenuFocused = () => {
    const active = containerRef.current?.ownerDocument.activeElement ?? null;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!active || !menuContainerRef.current) return false;
    for (const child of menuContainerRef.current.children) {
      if (child === active) {
        return true;
      }
    }

    return false;
  };

  const handleFocus = (e: FocusEvent<HTMLElement>) => {
    if (e.target === containerRef.current) {
      setIsSubMenuOpen(true);
    }
    // if (ContainerProps.onFocus) {
    //   ContainerProps.onFocus(e);
    // }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      return;
    }

    if (isSubmenuFocused()) {
      e.stopPropagation();
    }

    const active = containerRef.current?.ownerDocument.activeElement;

    if (e.key === "ArrowLeft" && isSubmenuFocused()) {
      containerRef.current?.focus();
    }

    if (
      e.key === "ArrowRight" &&
      e.target === containerRef.current &&
      e.target === active
    ) {
      const firstChild = menuContainerRef.current
        ?.children[0] as HTMLDivElement;
      firstChild?.focus();
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      ref={containerRef}
      onFocus={handleFocus}
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      <div ref={menuItemRef}>{menuItem}</div>
      <Menu
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "grey.900",
          },
        }}
        style={{ pointerEvents: "none" }}
        anchorEl={menuItemRef.current}
        anchorOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        transformOrigin={{
          horizontal: "left",
          vertical: "top",
        }}
        open={!!(enabled && isSubMenuOpen)}
        autoFocus={false}
        disableAutoFocus
        disableEnforceFocus
        onClose={() => {
          setIsSubMenuOpen(false);
        }}
      >
        <div ref={containerRef} style={{ pointerEvents: "auto" }}>
          {children}
        </div>
      </Menu>
    </div>
  );
};

SubMenuItemWrapper.displayName = "NestedMenuItem";

export default SubMenuItemWrapper;
