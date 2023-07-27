import axios from '@/lib/axios'
import { useRef, useState } from 'react'
import { Editor } from 'primereact/editor'

export default function RichEditor({
    model,
    modelId,
    text,
    onTextChange = () => {},
    imageUpdateEndpoint,
}) {
    const [value, setValue] = useState(text)

    const editorRef = useRef(null)

    async function imageHandler(imageDataUrl) {
        if (!imageUpdateEndpoint) return
        // Post the image to the server and return the image URL
        const url = await axios
            .post(imageUpdateEndpoint, {
                image: imageDataUrl,
                model_name: model,
                model_id: modelId,
            })
            .then(res => res.data)

        // Inserts the image into the editor at the last cursor position
        const quill = editorRef.current.getQuill()
        let index = (quill.getSelection() || {}).index
        if (index === undefined || index < 0) index = quill.getLength()
        quill.insertEmbed(index, 'image', url, 'user')
    }

    async function imageUploadHandler(clicked) {
        if (imageUpdateEndpoint && clicked) {
            let fileInput = this.container.querySelector(
                'input.ql-image[type=file]',
            )
            if (fileInput == null) {
                fileInput = document.createElement('input')
                fileInput.setAttribute('type', 'file')
                fileInput.setAttribute(
                    'accept',
                    'image/png, image/gif, image/jpeg, image/bmp, image/x-icon',
                )
                fileInput.classList.add('ql-image')
                fileInput.addEventListener('change', function (e) {
                    const files = e.target.files
                    let file
                    if (files.length > 0) {
                        file = files[0]
                        const type = file.type
                        const reader = new FileReader()
                        reader.onload = e => {
                            // handle the inserted image
                            const dataUrl = e.target.result
                            imageHandler(dataUrl, type, file.name)
                            fileInput.value = ''
                        }
                        reader.readAsDataURL(file)
                    }
                })
            }
            fileInput.click()
        }
    }

    const extendQuill = () => {
        // Add a custom image handler if we have an endpoint to upload to
        // Otherwise, this falls back to the default image handler
        // which inserts a base64 encoded image into the text field
        if (imageUpdateEndpoint) {
            const quill = editorRef.current.getQuill()
            quill.getModule('toolbar').addHandler('image', imageUploadHandler)
        }
    }

    return (
        <Editor
            className="w-full"
            ref={editorRef}
            value={value}
            onLoad={extendQuill}
            onTextChange={e => {
                setValue(e.htmlValue)
                onTextChange(e.htmlValue)
            }}
        />
    )
}
