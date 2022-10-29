import React from 'react'

const TypeBodyTemplateElement = ({
    rowData,
    types,
    matchField,
    subMatchField = null,
}) => {
    const type = types.find(e => {
        if (subMatchField) {
            return e.value === rowData[matchField][subMatchField]
        }
        return e.value === rowData[matchField]
    })
    const icon = type?.icon ? (
        <span className={'type-icon'} aria-label={type?.label}>
            {type?.icon} &nbsp;
        </span>
    ) : null
    return (
        <div>
            {icon}
            {type?.label}
        </div>
    )
}

export default TypeBodyTemplateElement
