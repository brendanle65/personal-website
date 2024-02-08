"use client";

import NextLink from "next/link";
import withHover from "./withHover";

/**
 * The Link component determines the type of link tag to render
 * and changes the cursor when hovered over.
 */
export default withHover(NextLink);
