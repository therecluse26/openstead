import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import axios from '@/lib/axios'
import { Panel } from 'primereact/panel'
import CollapsiblePanelTemplate from '@/components/Templates/CollapsiblePanelTemplate'
import NoteForm from '@/forms/Generic/NoteForm'
import { Fieldset } from 'primereact/fieldset'
import { formatDateTime } from '@/utils/FormatDate'
import NoteService from '@/services/Generic/NoteService'
import Spinner from '@/components/Spinner'
import Restrict from '@/components/Authorization/Restrict'
import { useAuthorizationStore } from './Authorization/AuthorizationStore'

const Notes = ({ parentType, parentId, onLoaded = () => {} }) => {
    const [editing, setEditing] = useState(false)
    const [notes, setNotes] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const userCan = useAuthorizationStore(state => state.userCan)

    const refreshNotes = () => {
        if (parentType && parentId) {
            axios
                .get(`/api/notes/${parentType}/${parentId}`)
                .then(res => res.data)
                .then(data => {
                    setNotes(data)
                })
                .catch(() => {
                    alert('Failed to retrieve notes')
                })
                .finally(() => {
                    setLoaded(true)
                    onLoaded()
                })
        }
    }

    const deleteNote = id => {
        NoteService.deleteNote(id).then(() => {
            refreshNotes()
        })
    }

    useEffect(() => {
        refreshNotes()
    }, [parentId])

    return (
        <Restrict permission={'note:read'}>
            <div className={'my-4'}>
                {!loaded ? (
                    <div className="card flex justify-content-center">
                        <Spinner />
                    </div>
                ) : (
                    <Panel
                        toggleable
                        headerTemplate={options => {
                            return CollapsiblePanelTemplate(options, 'Notes')
                        }}>
                        {editing === true && userCan('note:create') ? (
                            <NoteForm
                                parentId={parentId}
                                inline={true}
                                notableType={parentType}
                                onClose={() => {
                                    setEditing(false)
                                }}
                                onComplete={() => {
                                    setEditing(false)
                                    refreshNotes()
                                }}
                            />
                        ) : (
                            <Restrict permission={'note:create'}>
                                <div
                                    className={
                                        'flex justify-content-center mb-2'
                                    }>
                                    <Button
                                        onClick={() => {
                                            setEditing(true)
                                        }}>
                                        <span>
                                            <i className={'ti ti-plus'} />
                                            {' New'}
                                        </span>
                                    </Button>
                                </div>
                            </Restrict>
                        )}

                        {notes?.map(note => {
                            return (
                                <div key={`outer-div-note-${note.id}`}>
                                    <Fieldset
                                        className={'mb-2'}
                                        legend={
                                            <>
                                                {formatDateTime(note.timestamp)}{' '}
                                                {note.creator &&
                                                    ' - ' +
                                                        note.creator.name}{' '}
                                            </>
                                        }
                                        toggleable>
                                        <div className={'grid'}>
                                            <Restrict
                                                permission={'note:delete'}>
                                                <div
                                                    className={
                                                        'col-1 w-full flex justify-content-end ml-2 -mt-4 -mb-4'
                                                    }>
                                                    <Button
                                                        className={
                                                            'p-button-danger justify-content-center'
                                                        }
                                                        onClick={() => {
                                                            deleteNote(note.id)
                                                        }}>
                                                        <i
                                                            className={
                                                                'ti ti-trash'
                                                            }
                                                        />
                                                    </Button>
                                                </div>
                                            </Restrict>

                                            <div
                                                className={'col-11'}
                                                dangerouslySetInnerHTML={{
                                                    __html: note?.note,
                                                }}
                                            />
                                        </div>
                                    </Fieldset>
                                </div>
                            )
                        })}
                    </Panel>
                )}
            </div>
        </Restrict>
    )
}

export default Notes
