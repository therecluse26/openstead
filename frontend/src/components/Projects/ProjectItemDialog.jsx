import { Dialog } from 'primereact/dialog'
import { useProjectStore } from '../../state/ProjectStore'
import { Button } from 'primereact/button'

import { formatDateTime } from '@/utils/FormatDate'
import { Panel } from 'primereact/panel'
import CollapsiblePanelTemplate from '../Templates/CollapsiblePanelTemplate'
import Notes from '../Notes'
import EditableText from '../EditableFields/EditableText'
import EditableDropdown from '../EditableFields/EditableDropdown'
import { useRef } from 'react'
import { Toast } from 'primereact/toast'
import { IconEdit } from '@tabler/icons'

export default function ProjectItemDialog({ projectId }) {
    const modalVisible = useProjectStore(state => state.modalVisible)
    const setModalVisibility = useProjectStore(
        state => state.setModalVisibility,
    )
    const selectedItem = useProjectStore(state => state.selectedItem)
    const setSelectedItem = useProjectStore(state => state.setSelectedItem)
    const project = useProjectStore(state => state.project)
    const setProject = useProjectStore(state => state.setProject)

    const toast = useRef(null)

    return (
        <>
            <Toast ref={toast} />
            <Dialog
                visible={modalVisible}
                style={{ width: '70vw' }}
                onHide={() => {
                    setModalVisibility(false)
                }}
                header={
                    <h2>
                        <EditableText
                            placeholder={
                                <div>
                                    Item Title <IconEdit />
                                </div>
                            }
                            text={selectedItem?.title}
                            model="project_item"
                            modelId={selectedItem?.id}
                            field="title"
                        />
                    </h2>
                }>
                <div className="grid">
                    <div className="lg:col-8 md:col-6">
                        <EditableText
                            placeholder={
                                <h4>
                                    Item Description <IconEdit />
                                </h4>
                            }
                            text={selectedItem?.description}
                            model="project_item"
                            modelId={selectedItem?.id}
                            field="description"
                            richText
                        />

                        {selectedItem?.id && (
                            <Notes
                                parentId={selectedItem?.id}
                                parentType={'project_item'}
                            />
                        )}
                    </div>

                    <div className="lg:col-4 md:col-6">
                        <Panel
                            toggleable
                            headerTemplate={options => {
                                return CollapsiblePanelTemplate(
                                    options,
                                    'More Info',
                                )
                            }}>
                            <div className="grid">
                                <div className="col-5">Status</div>
                                <div className="col-7">
                                    <EditableDropdown
                                        value={
                                            selectedItem?.status
                                                ? {
                                                      key:
                                                          selectedItem?.status
                                                              ?.key ??
                                                          selectedItem?.status
                                                              ?.id,
                                                      label:
                                                          selectedItem?.status
                                                              ?.label ??
                                                          selectedItem?.status
                                                              ?.name,
                                                  }
                                                : null
                                        } // this is awful
                                        optionsUrl={`/api/projects/${projectId}/statuses`}
                                        optionLabel="label"
                                        optionValue="key"
                                        dataLabel="label"
                                        dataValue="key"
                                        model={'project_item'}
                                        modelId={selectedItem.id}
                                        field={'project_item_status_id'}
                                        onChange={value => {
                                            setProject({
                                                ...project,
                                                items: project.items.map(
                                                    item => {
                                                        if (
                                                            item.id ===
                                                            selectedItem.id
                                                        ) {
                                                            item.status.id =
                                                                value.key
                                                            item.status.name =
                                                                value.label
                                                        }
                                                        return item
                                                    },
                                                ),
                                            })
                                            setSelectedItem({
                                                ...selectedItem,
                                                status: value,
                                            })
                                        }}
                                        onError={e => {
                                            toast.current.show({
                                                severity: 'error',
                                                summary: 'Error',
                                                detail:
                                                    e.response?.data?.message ??
                                                    'Unknown error',
                                            })
                                        }}
                                    />
                                </div>
                                <div className="col-5">Assigned To</div>
                                {selectedItem?.assignee?.name ? (
                                    <div className="col-7 flex vertical-align-middle">
                                        <img
                                            className="w-2rem h-2rem border-circle rounded-full mr-2"
                                            src={selectedItem.assignee.avatar}
                                            alt={selectedItem.assignee.name}
                                        />
                                        <div>{selectedItem.assignee.name}</div>
                                    </div>
                                ) : (
                                    <div className="col-7">None</div>
                                )}

                                <div className="col-5">Created At</div>
                                <div className="col-7">
                                    {formatDateTime(selectedItem?.created_at) ??
                                        'Unknown'}
                                </div>

                                <div className="col-5">Created By</div>
                                {selectedItem?.creator?.name ? (
                                    <div className="col-7 flex vertical-align-middle">
                                        <img
                                            className="w-2rem h-2rem border-circle rounded-full mr-2"
                                            src={selectedItem.creator.avatar}
                                            alt={selectedItem.creator.name}
                                        />
                                        {selectedItem.creator.name}
                                    </div>
                                ) : (
                                    <div className="col-7">None</div>
                                )}

                                {selectedItem?.updated_at && (
                                    <>
                                        <div className="col-5">Updated At</div>
                                        <div className="col-7">
                                            {formatDateTime(
                                                selectedItem?.updated_at,
                                            )}
                                        </div>
                                    </>
                                )}

                                {selectedItem?.updated_by && (
                                    <>
                                        <div className="col-5">Updated By</div>
                                        <div className="col-7">
                                            {selectedItem?.updated_by?.name ??
                                                'Unknown'}
                                        </div>
                                    </>
                                )}
                            </div>
                        </Panel>
                        {!selectedItem?.deleted_at && (
                            <div className="col-12">
                                <Button
                                    onClick={() => setModalVisibility(false)}
                                    label="Mark as Closed"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </Dialog>
        </>
    )
}
