import SelectInput from '@/components/HookFormInputs/SelectInput'
import React from 'react'
import AppendableSelect from '@/components/HookFormInputs/AppendableSelect'

const SubtypeSelect = ({
    valueAddRequest,
    supertype,
    supertypeValueUrl = null,
    control,
    setValue,
    fieldId,
    errors,
    toast,
    watch,
    label,
    id,
    className,
}) => {
    const watchType = watch('type')

    const supertypeApiUrl = supertypeValueUrl ?? `/api/${supertype}/types`

    const getFormErrorMessage = name => {
        return (
            errors[name] && (
                <small className="p-error">{errors[name].message}</small>
            )
        )
    }

    return (
        <>
            <div className={className ?? 'field'}>
                <SelectInput
                    optionsEndpoint={supertypeApiUrl}
                    control={control}
                    name={'type'}
                    label={'Type'}
                    rules={{
                        required: 'Type is required.',
                    }}
                />
                {getFormErrorMessage('type')}
            </div>

            {watchType && (
                <AppendableSelect
                    valueAddRequest={valueAddRequest}
                    label={label}
                    supertype={supertype}
                    supertypeValueUrl={supertypeValueUrl}
                    control={control}
                    setValue={setValue}
                    fieldId={fieldId}
                    errors={errors}
                    toast={toast}
                    selectedType={watchType}
                    watch={watch}
                    id={id}
                />
            )}
        </>
    )
}

export default SubtypeSelect
