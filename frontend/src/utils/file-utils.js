const convertUploadedFilesToBase64 = async data => {
    let files = []
    const reader = new FileReader()
    reader.onloadend = () => {
        files.push(reader.result)
    }
    for (let file of data?.files) {
        await fetch(file?.objectURL)
            .then(r => r.blob())
            .then(r => {
                reader.readAsDataURL(r)
            })
    }
    return files
}

export { convertUploadedFilesToBase64 }
