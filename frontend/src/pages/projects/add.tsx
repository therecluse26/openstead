import React from 'react'
import { NextPage } from 'next'
import LinkButton from '@/components/LinkButton'
import ProjectForm from '@/forms/Projects/ProjectForm'

const CreateProject: NextPage = () => {
    return (
        <>
            {' '}
            <LinkButton href={'/projects'} text={'< Back'} /> <ProjectForm />
        </>
    )
}

export default CreateProject
