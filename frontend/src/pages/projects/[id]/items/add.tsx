import React from 'react'
import { NextPage } from 'next'
import LinkButton from '@/components/LinkButton'
import { useRouter } from 'next/router'
import ProjectItemForm from '../../../../forms/Projects/ProjectItemForm'
import Restrict from '../../../../components/Authorization/Restrict'
import { useAuthorizationStore } from '@/components/Authorization/AuthorizationStore'

const CreateProjectItem: NextPage = () => {
    const { query } = useRouter()
    const { id, status } = query
    const user = useAuthorizationStore(state => state.user)

    return (
        <>
            <Restrict permission="project-item:create" showMessage={true}>
                <LinkButton href={`/projects/${id}`} text={'< Back'} />{' '}
                <ProjectItemForm
                    projectId={id as string}
                    status={status as string}
                />
            </Restrict>
        </>
    )
}

export default CreateProjectItem
