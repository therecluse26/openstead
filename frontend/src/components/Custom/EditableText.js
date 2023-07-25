import { set } from 'lodash'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { useEffect, useState } from 'react'

const EditableText = ({ text, model, field }) => {
    const [value, setValue] = useState(text)
    const [isEditing, setIsEditing] = useState(false)

    const updateValue = () => {
        setIsEditing(false)
    }

    const handleBlur = () => {
        setIsEditing(false)
    }

    useEffect(() => {
        setValue(text)
    }, [text])

    return (
        <>
            {isEditing ? (
                <>
                    <div className="p-inputgroup">
                        <InputTextarea
                            className="border-round-md"
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            autoFocus
                            onBlur={handleBlur}
                            width={'100%'}
                        />
                    </div>
                    <div className="mt-2 flex justify-content-end">
                        <Button
                            className={
                                'p-button-success justify-content-center'
                            }
                            icon="pi pi-check"
                            onClick={updateValue}
                        />
                        <Button
                            className={'p-button-danger justify-content-center'}
                            icon="pi pi-times"
                            onClick={() => setIsEditing(false)}
                        />
                    </div>
                </>
            ) : (
                <span onClick={() => setIsEditing(true)}>{text}</span>
            )}
        </>
    )
}

export default EditableText
