import axios from '@/lib/axios'
import sanitizeHtml from '@/utils/sanitizeHtml'

export const updateField = async (
    model: string,
    modelId: string,
    field: string,
    flexibleValue: { value: any } | Array<{ value: any }> | string,
    sanitize: boolean = false,
) => {
    if (Array.isArray(flexibleValue)) {
        flexibleValue = flexibleValue[0].value
    } else if (typeof flexibleValue === 'object') {
        flexibleValue = flexibleValue.value
    }

    return await axios
        .put(`/api/editable-field/${model}/${modelId}`, {
            value: sanitize ? sanitizeHtml(flexibleValue) : flexibleValue,
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
    if (optionsEndpoint) {
        return await axios
            .get(optionsEndpoint)
            .then(res => res.data)
            .then(data => {
                if (typeof data === 'object' && 'data' in data) {
                    setter(
                        data?.data.map(t => {
                            return {
                                [dataLabelKey]: t[optionLabelKey],
                                [dataValueKey]: t[optionValueKey],
                                group: t.group,
                            }
                        }),
                    )
                } else {
                    setter(
                        data?.map(t => {
                            return {
                                [dataLabelKey]: t[optionLabelKey],
                                [dataValueKey]: t[optionValueKey],
                                group: t.group,
                            }
                        }),
                    )
                }
            })
    }
    return []
}
