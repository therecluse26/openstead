import { Button } from 'primereact/button'
import { InputTextarea } from 'primereact/inputtextarea'
import { useEffect, useRef, useState } from 'react'
import Spinner from '../Spinner'
import { Toast } from 'primereact/toast'
import RichEditor from '../RichEditor'
import { updateField } from './EditableFieldService'

const EditableText = ({
    text,
    model,
    modelId,
    field,
    placeholder = 'Click to edit',
    richText = false,
}) => {
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState(text)
    const [displayedValue, setDisplayedValue] = useState(text)
    const [isEditing, setIsEditing] = useState(false)
    const toast = useRef(null)

    const handleTextOnMouseMove = e => {
        if (e.target.tagName === 'A') {
            e.target.style.cursor = 'pointer'
        }
    }

    const handleTextOnclick = e => {
        if (e.target.tagName.toLowerCase() === 'a') {
            // Horrible hack to get around the fact that Quill isn't adding the Href attribute to the anchor tag
            window.open(
                e.target.href !== '' ? e.target.href : e.target.innerText,
                '_blank',
            )
            return
        }

        setIsEditing(true)
    }

    const updateValue = async () => {
        setLoading(true)
        try {
            const updatedValue = await updateField(
                model,
                modelId,
                field,
                value,
                true,
            )

            setDisplayedValue(updatedValue)
        } catch (e) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: e.response?.data?.message ?? 'Unknown error',
            })
        }
        setIsEditing(false)
        setLoading(false)
    }

    useEffect(() => {
        setValue(text)
    }, [text])

    return (
        <>
            <Toast ref={toast} />

            {loading ? (
                <div className="p-d-flex p-jc-center">
                    <div className="p-m-2">
                        <Spinner />
                    </div>
                </div>
            ) : (
                <>
                    {isEditing ? (
                        <div>
                            <div className="p-inputgroup">
                                {richText ? (
                                    <RichEditor
                                        model={model}
                                        modelId={modelId}
                                        text={value}
                                        onTextChange={e => setValue(e)}
                                        imageUpdateEndpoint={
                                            '/api/images/base64'
                                        }
                                    />
                                ) : (
                                    <InputTextarea
                                        className="border-round-md"
                                        value={value}
                                        onChange={e => setValue(e.target.value)}
                                        autoFocus
                                        autoResize
                                        width={'100%'}
                                    />
                                )}
                            </div>
                            <div className="mt-2 flex justify-content-end">
                                <Button
                                    className={
                                        'p-button-success justify-content-center'
                                    }
                                    icon="pi pi-check"
                                    onClick={() => updateValue()}
                                />
                                <Button
                                    className={
                                        'p-button-danger justify-content-center'
                                    }
                                    icon="pi pi-times"
                                    onClick={() => setIsEditing(false)}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            {displayedValue ? (
                                <div
                                    className="editable-text-container"
                                    style={{
                                        objectFit: 'contain',
                                        width: '100%',
                                    }}
                                    onMouseMove={handleTextOnMouseMove}
                                    onClick={handleTextOnclick}
                                    dangerouslySetInnerHTML={{
                                        __html: displayedValue,
                                    }}
                                />
                            ) : (
                                <div
                                    className="editable-text-container"
                                    style={{
                                        objectFit: 'contain',
                                        width: '100%',
                                    }}
                                    onMouseMove={handleTextOnMouseMove}
                                    onClick={handleTextOnclick}>
                                    {placeholder}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    )
}

export default EditableText
