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

export { upperCaseFirstLetters }
