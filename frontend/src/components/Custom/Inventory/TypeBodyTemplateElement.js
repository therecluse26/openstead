import React from 'react'

const TypeBodyTemplateElement = ({
    rowData,
    types,
    matchField,
    subMatchField = null,
}) => {
    const type = types.find(e => {
        if (subMatchField) {
            return typeof rowData[matchField][subMatchField] === 'object'
                ? e.value === rowData[matchField][subMatchField]['key']
                : e.value === rowData[matchField][subMatchField]
        }
        return typeof rowData[matchField][subMatchField] === 'object'
            ? e.value === rowData[matchField]['key']
            : e.value === rowData[matchField]
    })
    const icon = type?.icon && (
        <span className={'type-icon'} aria-label={type?.label}>
            {type?.icon} &nbsp;
        </span>
    )
    return (
        <div>
            {icon}
            {type?.label}
        </div>
    )
}

export default TypeBodyTemplateElement
