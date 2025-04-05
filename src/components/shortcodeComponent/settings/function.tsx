import React from "react";
import { component_match_id } from "./config";
import parse from 'html-react-parser';

interface RequestProps {
    request: string;
}

export function shortCodeMiddleware({ request }: RequestProps) {
    // console.log("request", request)
    const regex = /\[([^\]]+)\]/g;

    // Function to replace shortcodes with components
    const replaceShortcodes = (html: string) => {
        // console.log("html", html);
        if (html) {
            return html.replace(regex, (match: any, p1: any) => {
                const ComponentToRender: any = component_match_id[p1]?.component;
                if (ComponentToRender) {
                    return `<div data-shortcode="${p1}"></div>`;
                } else {
                    return `[${p1} this component not found]`;
                }
            });
        }
        return "";
        
    };

    const processedHtml = replaceShortcodes(request);

    const renderWithComponents = (node: any) => {
        if (node.attribs && node.attribs['data-shortcode']) {
            const shortcode = node.attribs['data-shortcode'];
            const ComponentToRender = component_match_id[shortcode]?.component;
            if (ComponentToRender) {
                return <ComponentToRender key={shortcode} name="supratim" />;
            }
        }
        return node;
    };

    // if (request) {
    //     // const parts = request.split(/\n/g);
    //     const processedParts = parts.map((part, index) => {
    //         const match = part.match(regex);

    //         if (match) {
    //             let extractedValue = match[0].slice(1, -1); // Remove the first and last characters
    //             const ComponentToRender = component_match_id[extractedValue]?.component as React.FC<any> | undefined;

    //             if (ComponentToRender) {
    //                 const propsForComponent = {
    //                     name: "supratim",
    //                 };
    //                 return <ComponentToRender key={index} {...propsForComponent} />;
    //             } else {
    //                 return (
    //                     <span key={index}>
    //                         [{extractedValue} this component not found]
    //                     </span>
    //                 );
    //             }
    //         } else {
    //             return (
    //                 <span key={index}>
    //                     {part}
    //                     <br />
    //                 </span>
    //             );
    //         }
    //     });

    //     return <div>{processedParts}</div>;
    // }

    return <>{parse(processedHtml, { replace: renderWithComponents })}</>;
}