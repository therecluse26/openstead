import React, { useEffect, useRef } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { csrf } from '@/hooks/auth'
import { useToast } from '../../context/ToastContext'
import NoteService from '@/services/Generic/NoteService'
import EditorInput from '@/components/HookFormInputs/EditorInput'

interface NoteFormData {
    note: string
}

interface NoteFormProps {
    inline?: boolean
    notableType: string
    parentId: string
    onComplete?: () => void
    onClose?: () => void
}

const NoteForm: React.FC<NoteFormProps> = ({
    inline = false,
    notableType,
    parentId,
    onComplete = () => {},
    onClose = () => {},
}) => {
    const isMounted = useRef<boolean>(false)
    const { showToast } = useToast()

    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<NoteFormData>({
        defaultValues: {
            note: '',
        },
    })

    useEffect(() => {
        if (!parentId) {
            return
        }
        isMounted.current = true
    }, [parentId])

    const onSubmit: SubmitHandler<NoteFormData> = async data => {
        await csrf()
        const noteData = {
            ...data,
            notable_type: notableType,
        }
        NoteService.addNote(parentId, noteData)
            .then(() => {
                if (inline) {
                    onComplete()
                }
            })
            .catch((error: any) => {
                showToast(
                    error.response.data.message ?? 'Error adding note',
                    'error',
                )
            })
    }

    return (
        <>
            <div
                className={
                    'justify-content-center align-content-center grid ' +
                    (inline ? 'text-right' : '')
                }>
                <div className={'col-12'}>
                    {inline ? (
                        <Button
                            className={'p-button-text text-right'}
                            onClick={() => {
                                onClose()
                            }}>
                            <i className={'ti ti-x'} /> &nbsp;{'Close'}
                        </Button>
                    ) : (
                        <h3 className={'text-center'}>Add New Note</h3>
                    )}
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="col-12  -mt-4">
                    <div
                        className={
                            'justify-content-center align-content-center'
                        }>
                        <Card className={'mb-4'}>
                            <EditorInput
                                control={control}
                                name={'note'}
                                label={'Note'}
                                errors={errors}
                                rules={{
                                    required: 'Note is required.',
                                }}
                                height={'240px'}
                            />
                        </Card>
                        <Button type="submit" label="Save" className="mt-2" />
                    </div>
                </form>
            </div>
        </>
    )
}

export default React.memo(NoteForm)
