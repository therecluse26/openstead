import axios from '@/lib/axios'
import sanitizeHtml from '@/utils/sanitizeHtml'

const addNote = async (id, data) => {
    return await axios.post(`/api/notes`, {
        notable_type: data.notable_type,
        notable_id: id,
        note: sanitizeHtml(data.note?.htmlValue),
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
