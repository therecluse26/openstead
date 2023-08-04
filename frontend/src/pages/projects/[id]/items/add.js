import React from 'react'
import LinkButton from '@/components/LinkButton'
import { useRouter } from 'next/router'
import ProjectItemForm from '../../../../forms/Projects/ProjectItemForm'

const CreateProjectItem = () => {
    const { query } = useRouter()
    const { id, status } = query

    return (
        <>
            {' '}
            <LinkButton href={`/projects/${id}`} text={'< Back'} />{' '}
            <ProjectItemForm projectId={id} status={status} />
        </>
    )
}

export default React.memo(CreateProjectItem)
