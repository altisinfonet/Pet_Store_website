import React from 'react'


const SimpleCard = ({ heading, children, headingClassName, childrenClassName, className }: Props) => {
    return (
        <div className={`border border-solid bg-white border-gray-400 ${className}`}>
            <div className={`${headingClassName} px-3 py-2 bg-gray-300`}>{heading}</div>
            {/* <hr className='border-gray-400' /> */}
            {children && <div className={`${childrenClassName} p-3`}>{children}</div>}
        </div>
    )
}

interface Props {
    heading?: string | number | JSX.Element,
    children?: any,
    className?: string,
    headingClassName?: string,
    childrenClassName?: string
}

export default SimpleCard