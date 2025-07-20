import axios, { AxiosResponse } from '@/lib/axios'
import sanitizeHtml from '@/utils/sanitizeHtml'

interface NoteData {
    notable_type: string
    note?: {
        htmlValue?: string
    }
}

const addNote = async (id: string, data: NoteData): Promise<AxiosResponse> => {
    return await axios.post(`/api/notes`, {
        notable_type: data.notable_type,
        notable_id: id,
        note: data.note?.htmlValue ? sanitizeHtml(data.note.htmlValue) : '',
        _method: 'POST',
    })
}

const deleteNote = async (id: string): Promise<AxiosResponse | void> => {
    if (confirm('Are you sure you want to delete this note?')) {
        return await axios.delete(`/api/notes/${id}`)
    }
}

export default {
    addNote,
    deleteNote,
}
