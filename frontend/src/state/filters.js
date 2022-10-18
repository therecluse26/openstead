import { atom } from 'jotai'
import { atomWithQuery } from 'jotai/urql'

const idAtom = atom(1)
const inventoryFilterQuery = atomWithQuery(get => ({
    queryKey: ['users', get(idAtom)],
    queryFn: async () => {
        const res = await fetch('/api/inventory/filters')
        return res.json()
    },
}))

const filterAtom = () => {
    if (typeof window !== 'undefined') {
        return atom(
            localStorage.getItem('inventoryFilters') ?? inventoryFilterQuery,
        ).read()
    }
}

const inventoryFilters = () => {
    if (typeof window !== 'undefined') {
        return atom(
            get => get(filterAtom),
            (get, set, newStr) => {
                set(filterAtom, newStr)
                localStorage.setItem('inventoryFilters', newStr)
            },
        )
    }
}

export default { inventoryFilters }
