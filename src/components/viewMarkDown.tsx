import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

const Markdown = dynamic(
    () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
    { ssr: false }
);

export const ViewMarkDown: React.FC<{value: string}> = ({value}) => {
    return (
        <>
            <Markdown source={value} />
        </>
    )
}