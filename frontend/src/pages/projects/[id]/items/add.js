import React from 'react'
import LinkButton from '@/components/LinkButton'
import { useRouter } from 'next/router'
import ProjectItemForm from '../../../../forms/Projects/ProjectItemForm'
import Restrict from '../../../../components/Authorization/Restrict'
import { useAuthorizationStore } from '@/components/Authorization/AuthorizationStore'
const CreateProjectItem = () => {
    const { query } = useRouter()
    const { id, status } = query
    const user = useAuthorizationStore(state => state.user)

    return (
        <>
            <Restrict permission="project-item:create" showMessage={true}>
                <LinkButton href={`/projects/${id}`} text={'< Back'} />{' '}
                <ProjectItemForm projectId={id} status={status} />
            </Restrict>
        </>
    )
}

export default React.memo(CreateProjectItem)
