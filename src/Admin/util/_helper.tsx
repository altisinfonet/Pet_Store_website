
export function truncateString(str: string, length: number) {
    if (str.length <= length) {
        return str;
    }
    return str.slice(0, length) + '...';
}

export function dhtmlRender(des: string) {
    
    return (
        <div dangerouslySetInnerHTML={{ __html: des }} />
    )
}