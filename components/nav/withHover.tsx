"use client";

import { useContext, ComponentType } from "react";
import { cursorStateContext, CursorState } from "@/contexts/CursorContext";

/**
 * The withHover HOC wraps JSX elements that when hovered over change the cursor.
 */
const withHover = (
  Component: ComponentType<any>,
  hoverState = CursorState.HOVER
) => {
  return (props) => {
    const { style, onMouseEnter, onMouseLeave, ...rest } = props;
    const { setCursorState } = useContext(cursorStateContext);

    return (
      <Component
        {...rest}
        style={{ ...style, cursor: "pointer" }}
        onMouseEnter={() => {
          setCursorState(hoverState);
          if (onMouseEnter) {
            onMouseEnter();
          }
        }}
        onMouseLeave={() => {
          setCursorState(CursorState.IDLE);
          if (onMouseLeave) {
            onMouseLeave();
          }
        }}
      />
    );
  };
};

export default withHover;
