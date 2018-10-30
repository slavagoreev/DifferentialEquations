import {
    renderMathInElement
} from './autorender';

export function parseKatex(): void {
    const elements: NodeListOf<HTMLElement> = document.querySelectorAll(".math");
    elements.forEach((element) => {
        renderMathInElement(element, {
            delimiters: [{
                left: "$",
                right: "$",
                display: true,
            }],
            ignoredTags: ["script", "noscript", "style", "textarea", "pre"],
            throwOnError: true,
        });
    });

}
(window as any).parseKatex = parseKatex;
