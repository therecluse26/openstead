interface UploadedFile {
    objectURL: string
}

interface UploadData {
    files: UploadedFile[]
}

const convertUploadedFilesToBase64 = async (
    data: UploadData,
): Promise<string[]> => {
    const files: string[] = []

    if (!data?.files) {
        return files
    }

    for (const file of data.files) {
        try {
            const response = await fetch(file?.objectURL)
            const blob = await response.blob()

            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    if (typeof reader.result === 'string') {
                        resolve(reader.result)
                    } else {
                        reject(new Error('Failed to convert file to base64'))
                    }
                }
                reader.onerror = () => reject(reader.error)
                reader.readAsDataURL(blob)
            })

            files.push(base64)
        } catch (error) {
            console.error('Error converting file to base64:', error)
            // Continue with other files even if one fails
        }
    }

    return files
}

export { convertUploadedFilesToBase64 }
