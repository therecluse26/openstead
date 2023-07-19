import React from 'react'
import LinkButton from '@/components/LinkButton'
import ProjectForm from '@/forms/Projects/ProjectForm'

const CreateEquipment = () => {
    return (
        <>
            {' '}
            <LinkButton href={'/projects'} text={'< Back'} /> <ProjectForm />
        </>
    )
}

export default React.memo(CreateEquipment)
