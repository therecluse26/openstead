import { Dialog } from 'primereact/dialog'
import { useProjectStore } from './projectStore'
import { Divider } from 'primereact/divider'
import { Button } from 'primereact/button'
import { formatDateTime } from '@/utils/FormatDate'

export default function ProjectItemDialog() {
    const modalVisible = useProjectStore(state => state.modalVisible)
    const setModalVisibility = useProjectStore(
        state => state.setModalVisibility,
    )
    const selectedItem = useProjectStore(state => state.selectedItem)

    return (
        <Dialog
            visible={modalVisible}
            onHide={() => {
                setModalVisibility(false)
            }}
            style={{ width: '50vw' }}
            header={<h2>{selectedItem?.title}</h2>}>
            <div>
                <div className="grid">
                    <div className="col-2">Status</div>
                    <div className="col-10">
                        {selectedItem?.status?.name ?? 'Unknown'}
                    </div>
                    <div className="col-2">Description</div>

                    <div>{selectedItem?.description}</div>
                </div>
                <Divider layout="vertical" className="my-2" />

                <div className="grid">
                    <div className="col-2">Assigned To</div>
                    <div className="col-10">
                        {selectedItem?.assigned_to?.name ?? 'Unknown'}
                    </div>

                    <div className="col-2">Created At</div>
                    <div className="col-10">
                        {formatDateTime(selectedItem?.created_at) ?? 'Unknown'}
                    </div>

                    <div className="col-2">Updated At</div>
                    <div className="col-10">
                        {formatDateTime(selectedItem?.updated_at) ?? 'Unknown'}
                    </div>

                    <div className="col-2">Created By</div>
                    <div className="col-10">
                        {selectedItem?.creator?.name ?? 'Unknown'}
                    </div>
                    <div className="col-2">Updated By</div>
                    <div className="col-10">
                        {selectedItem?.updated_by?.name ?? 'Unknown'}
                    </div>

                    <div className="col-12">
                        <Button
                            onClick={() => setModalVisibility(false)}
                            label="Mark as Closed"
                            link
                        />
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
