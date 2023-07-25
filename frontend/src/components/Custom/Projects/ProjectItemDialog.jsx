import { Dialog } from 'primereact/dialog'
import { useProjectStore } from './projectStore'
import { Button } from 'primereact/button'

import { formatDateTime } from '@/utils/FormatDate'
import { Panel } from 'primereact/panel'
import CollapsiblePanelTemplate from '../Templates/CollapsiblePanelTemplate'
import Notes from '../Notes'

export default function ProjectItemDialog() {
    const modalVisible = useProjectStore(state => state.modalVisible)
    const setModalVisibility = useProjectStore(
        state => state.setModalVisibility,
    )
    const selectedItem = useProjectStore(state => state.selectedItem)

    return (
        <Dialog
            visible={modalVisible}
            style={{ width: '70vw' }}
            onHide={() => {
                setModalVisibility(false)
            }}
            header={<h2>{selectedItem?.title}</h2>}>
            <div className="grid">
                <div className="lg:col-8 md:col-6">
                    <div>{selectedItem?.description}</div>

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
                                {selectedItem?.status?.name ?? 'Unknown'}
                            </div>
                            <div className="col-5">Assigned To</div>
                            <div className="col-7">
                                {selectedItem?.assigned_to?.name ?? 'Unknown'}
                            </div>

                            <div className="col-5">Created At</div>
                            <div className="col-7">
                                {formatDateTime(selectedItem?.created_at) ??
                                    'Unknown'}
                            </div>

                            <div className="col-5">Updated At</div>
                            <div className="col-7">
                                {formatDateTime(selectedItem?.updated_at) ??
                                    'Unknown'}
                            </div>

                            <div className="col-5">Created By</div>
                            <div className="col-7">
                                {selectedItem?.creator?.name ?? 'Unknown'}
                            </div>

                            {selectedItem?.updated_by && (
                                <div>
                                    <div className="col-5">Updated By</div>
                                    <div className="col-7">
                                        {selectedItem?.updated_by?.name ??
                                            'Unknown'}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Panel>
                    {!selectedItem?.deleted_at && (
                        <div className="col-12">
                            <Button
                                onClick={() => setModalVisibility(false)}
                                label="Mark as Closed"
                                link
                            />
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    )
}
