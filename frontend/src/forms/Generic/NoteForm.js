import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { csrf } from '@/hooks/auth'
import AddErrorToasts from '@/utils/AddErrorToasts'
import ToastContext, { useToastContext } from '@/context/ToastContext'
import NoteService from '@/services/Generic/NoteService'
import EditorInput from '@/components/HookFormInputs/EditorInput'

const NoteForm = ({
    inline = false,
    notableType,
    parentId,
    onComplete = () => {},
    onClose = () => {},
}) => {
    const isMounted = useRef(false)
    const toast = useToastContext(ToastContext)

    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({
        type: null,
        note: null,
    })

    useEffect(() => {
        if (!parentId) {
            return
        }
        isMounted.current = true
    }, [parentId])

    const onSubmit = async data => {
        await csrf()
        data['notable_type'] = notableType
        NoteService.addNote(parentId, data)
            .then(() => {
                if (inline) {
                    onComplete()
                }
            })
            .catch(error => {
                AddErrorToasts(toast, error)
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
