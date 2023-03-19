import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { api } from "../utils/api";
import {
  Editable,
  Slate,
  withReact,
  type RenderElementProps,
  type RenderLeafProps,
} from "slate-react";

import type { Descendant, Editor } from "slate";
import { createEditor } from "slate";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { DefaultElement } from "slate-react";
import { Typography } from "@mui/material";

function useEditorConfig(editor: Editor) {
  return { renderElement, renderLeaf };
}

function renderElement(props: RenderElementProps) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { element, children, attributes } = props;
  if ("type" in element && typeof element.type === "string") {
    switch (element.type) {
      case "paragraph":
        return (
          <Typography
            sx={{
              color: "grey.100",
            }}
            {...attributes}
          >
            {children}
          </Typography>
        );
      case "h1":
        <Typography
          variant="h1"
          component="h1"
          sx={{
            color: "grey.100",
          }}
          {...attributes}
        >
          {children}
        </Typography>;
      case "h2":
        return <h2 {...attributes}>{children}</h2>;
      case "h3":
        return <h3 {...attributes}>{children}</h3>;
      case "h4":
        return <h4 {...attributes}>{children}</h4>;
      default:
        // For the default case, we delegate to Slate's default rendering.
        return <DefaultElement {...props} />;
    }
  }
  return <DefaultElement {...props} />;
}

function renderLeaf({ attributes, children, leaf }: RenderLeafProps) {
  return (
    <span {...attributes}>
      <Typography
        component="p"
        sx={{
          display: "inline",
          color: "grey.100",
          fontWeight: "bold" in leaf && leaf.bold ? "bold" : undefined,
          textDecoration:
            "underline" in leaf && leaf.underline ? "underline" : undefined,
        }}
        {...attributes}
      >
        {children}
      </Typography>
    </span>
  );
}

const ExampleDocument = [
  {
    type: "paragraph",
    children: [
      { text: "Hello World! This is my paragraph inside a sample document." },
      { text: "Bold text.", bold: true, code: true },
      { text: "Italic text.", italic: true },
      { text: "Bold and underlined text.", bold: true, underline: true },
      { text: "variableFoo", code: true },
    ],
  },
];

const Home: NextPage = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const { renderElement, renderLeaf } = useEditorConfig(editor);
  return (
    <Slate editor={editor} value={ExampleDocument}>
      <Editable renderElement={renderElement} renderLeaf={renderLeaf} />
    </Slate>
  );
};

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//   );
// };
