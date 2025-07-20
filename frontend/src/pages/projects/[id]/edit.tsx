import { NextPage } from 'next'
import ProjectForm from '@/forms/Projects/ProjectForm'
import Restrict from '../../../components/Authorization/Restrict'

const EditProjectPage: NextPage = () => {
    return (
        <Restrict permission="project:update" showMessage>
            <ProjectForm mode="edit" />
        </Restrict>
    )
}

export default EditProjectPage
