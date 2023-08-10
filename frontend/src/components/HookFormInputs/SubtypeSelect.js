import SelectInput from '@/components/HookFormInputs/SelectInput'
import { useState } from 'react'
import AppendableSelect from '@/components/HookFormInputs/AppendableSelect'

const SubtypeSelect = ({
    valueAddRequest,
    supertype,
    supertypeValueUrl = null,
    control,
    setValue,
    fieldId,
    errors,
    watch,
    label,
    id,
    className,
    optionLabel = 'label',
    optionValue = 'value',
    dataLabelKey = 'label',
    dataValueKey = 'value',
}) => {
    const [group, setGroup] = useState(null)
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
                    groupSetter={setGroup}
                    optionLabel={optionLabel}
                    optionValue={optionValue}
                    dataLabelKey={dataLabelKey}
                    dataValueKey={dataValueKey}
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
                    selectedType={watchType}
                    watch={watch}
                    id={id}
                    supergroup={group}
                    optionLabel={optionLabel}
                    optionValue={optionValue}
                    dataLabelKey={dataLabelKey}
                    dataValueKey={dataValueKey}
                />
            )}
        </>
    )
}

export default SubtypeSelect
