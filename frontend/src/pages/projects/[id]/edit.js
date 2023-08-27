import ProjectForm from '@/forms/Projects/ProjectForm'
import Restrict from '../../../components/Authorization/Restrict'

export default function EditProjectPage() {
    return (
        <Restrict permission="project:update" showMessage>
            <ProjectForm mode="edit" />
        </Restrict>
    )
}
