import { Controller } from 'react-hook-form'
import { classNames } from 'primereact/utils'
import React from 'react'
import { Editor } from 'primereact/editor'

const TextInput = ({ control, name, rules, errors, height = '320px' }) => {
    const getFormErrorMessage = name => {
        return (
            errors[name] && (
                <small className="p-error">{errors[name].message}</small>
            )
        )
    }

    return (
        <span className="p-float-label">
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { onChange, value, name }, fieldState }) => (
                    <Editor
                        id={name}
                        value={value}
                        style={{ height: height }}
                        className={classNames({
                            'p-invalid': fieldState.error,
                        })}
                        formats={[
                            'bold',
                            'italic',
                            'underline',
                            'link',
                            'video',
                            'list',
                        ]}
                        headerTemplate={
                            <span className="ql-formats">
                                <button className="ql-bold" aria-label="Bold" />
                                <button
                                    className="ql-italic"
                                    aria-label="Italic"
                                />
                                <button
                                    className="ql-underline"
                                    aria-label="Underline"
                                />

                                <button
                                    className="ql-list"
                                    value={'ordered'}
                                    aria-label="List"
                                />

                                <button
                                    className="ql-list"
                                    value={'bullet'}
                                    aria-label="List"
                                />

                                <button className="ql-link" aria-label="Link" />

                                <button
                                    className="ql-video"
                                    aria-label="Video"
                                />
                            </span>
                        }
                        onTextChange={onChange}
                    />
                )}
            />
            {getFormErrorMessage(name)}
        </span>
    )
}

export default TextInput
