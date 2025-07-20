import { NextPage } from 'next'
import UserForm from '../../../forms/Users/UserForm'
import LinkButton from '@/components/LinkButton'
import { useRouter } from 'next/router'
import Restrict from '@/components/Authorization/Restrict'

const EditUser: NextPage = () => {
    const { query } = useRouter()
    const { id } = query

    return (
        <>
            <LinkButton href={`/users/${id}`} text={'< Back'} />{' '}
            <Restrict permission="user:update" showMessage>
                <UserForm mode="edit" />
            </Restrict>
        </>
    )
}

export default EditUser
