import axios from '@/lib/axios'
import sanitizeHtml from '@/utils/sanitizeHtml'

export const updateField = async (
    model: string,
    modelId: string,
    field: string,
    flexibleValue: { value: any } | Array<{ value: any }> | string,
    sanitize: boolean = false,
) => {
    let processedValue: any = null

    if (!flexibleValue) {
        processedValue = null
    } else if (Array.isArray(flexibleValue)) {
        processedValue = flexibleValue[0].value
    } else if (typeof flexibleValue === 'object') {
        processedValue = flexibleValue.value
    } else {
        processedValue = flexibleValue
    }

    return await axios
        .put(`/api/editable-field/${model}/${modelId}`, {
            value:
                sanitize && typeof processedValue === 'string'
                    ? sanitizeHtml(processedValue)
                    : processedValue,
            field_name: field,
        })
        .then(res => res.data)
}

export const getOptionsFromUrl = async (
    optionsEndpoint: string,
    optionLabelKey: string,
    optionValueKey: string,
    setter: (value: any) => void,
    dataLabelKey: string = 'label',
    dataValueKey: string = 'value',
) => {
    return await axios
        .get(optionsEndpoint)
        .then(res => res.data)
        .then(data => {
            let options = []
            if (typeof data === 'object' && 'data' in data) {
                options = data?.data.map(t => {
                    return {
                        [dataLabelKey]: t[optionLabelKey],
                        [dataValueKey]: t[optionValueKey],
                        group: t.group,
                    }
                })
            } else {
                options = data?.map(t => {
                    return {
                        [dataLabelKey]: t[optionLabelKey],
                        [dataValueKey]: t[optionValueKey],
                        group: t.group,
                    }
                })
            }

            setter(options)
        })
}
