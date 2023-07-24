import { Dialog } from 'primereact/dialog'
import { useProjectStore } from './projectStore'

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
            header={<h2>Project Item</h2>}>
            <div>
                <h4>{selectedItem?.title}</h4>
                <p>{selectedItem?.description}</p>
            </div>
        </Dialog>
    )
}
