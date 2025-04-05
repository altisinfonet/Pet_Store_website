import React from 'react'

const FormLayot = ({header}: Props) => {
    return (
        <div className='border border-solid border-gray-400'>
            <div>{header}</div>
            <hr />
        </div>
    )
}

    interface Props {
        header?: any
    }

export default FormLayot