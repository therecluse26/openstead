const upperCaseFirstLetters = sentence => {
    if (typeof sentence !== 'string') {
        return
    }
    return sentence
        .split(' ')
        .map(word => {
            return word[0].toUpperCase() + word.substring(1)
        })
        .join(' ')
}

const slugify = (str: string, separator: string = '-'): string => {
    if (!str) return ''

    return str
        .toLowerCase()
        .replace(/[^\w\s]+/g, '') // Remove non-alphanumeric characters
        .replace(/\s+/g, separator) // Replace spaces with the separator
}

export { upperCaseFirstLetters, slugify }
