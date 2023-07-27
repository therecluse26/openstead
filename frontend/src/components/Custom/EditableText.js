import axios from '@/lib/axios'
import { Button } from 'primereact/button'
import { InputTextarea } from 'primereact/inputtextarea'
import { useEffect, useRef, useState } from 'react'
import Spinner from '../Spinner'
import { Toast } from 'primereact/toast'
import sanitizeHtml from '@/utils/sanitizeHtml'
import RichEditor from './RichEditor'

const EditableText = ({ text, model, modelId, field, richText = false }) => {
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState(text)
    const [displayedValue, setDisplayedValue] = useState(text)
    const [isEditing, setIsEditing] = useState(false)
    const toast = useRef(null)

    const updateValue = async () => {
        setLoading(true)
        try {
            const updatedValue = await axios
                .put(`/api/editable-field/${model}/${modelId}`, {
                    value: sanitizeHtml(value),
                    field_name: field,
                })
                .then(res => res.data)

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
                        <div
                            className="editable-text-container"
                            style={{
                                objectFit: 'contain',
                                width: '100%',
                            }}
                            onClick={() => setIsEditing(true)}
                            dangerouslySetInnerHTML={{ __html: displayedValue }}
                        />
                    )}
                </>
            )}
        </>
    )
}

export default EditableText
