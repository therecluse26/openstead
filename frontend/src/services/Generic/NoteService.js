import axios from '@/lib/axios'
import sanitizeHtml from 'sanitize-html'

const addNote = async (id, data) => {
    return await axios.post(`/api/notes`, {
        notable_type: data.notable_type,
        notable_id: id,
        note: sanitizeHtml(data.note?.htmlValue, {
            allowedTags: [
                'p',
                'em',
                'strong',
                'b',
                'u',
                'i',
                'iframe',
                'ul',
                'li',
                'ol',
            ],
            allowedClasses: {
                p: ['fancy', 'simple'],
            },
            allowedAttributes: {
                iframe: ['src', 'class', 'frameborder', 'allowfullscreen'],
            },
            allowedIframeDomains: [
                'youtube.com',
                'vimeo.com',
                'bitchute.com',
                'rumble.com',
                'odysee.com',
            ],
        }),
        _method: 'POST',
    })
}

const deleteNote = async id => {
    if (confirm('Are you sure you want to delete this note?')) {
        return await axios.delete(`/api/notes/${id}`)
    }
}

export default {
    addNote,
    deleteNote,
}
