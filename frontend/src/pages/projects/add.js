import React from 'react'
import LinkButton from '@/components/LinkButton'
import ProjectForm from '@/forms/Projects/ProjectForm'

const CreateProject = () => {
    return (
        <>
            {' '}
            <LinkButton href={'/projects'} text={'< Back'} /> <ProjectForm />
        </>
    )
}

export default React.memo(CreateProject)
