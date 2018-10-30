declare module "katex-autorender" {
    const renderMathInElement: (element: HTMLElement, options?: {
        delimiters?: {
            left: string;
            right: string;
            display: boolean;
        }[];
        ignoredTags?: string[];
        errorCallback?: (err: katex.ParseError) => void;
    }) => void;
    export = renderMathInElement;
}
