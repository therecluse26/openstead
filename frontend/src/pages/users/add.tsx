import { NextPage } from 'next'
import UserForm from '../../forms/Users/UserForm'
import Restrict from '@/components/Authorization/Restrict'
import LinkButton from '@/components/LinkButton'

const AddUser: NextPage = () => {
    return (
        <>
            <LinkButton href={`/users`} text={'< Back'} />{' '}
            <Restrict permission="user:update" showMessage>
                <UserForm />
            </Restrict>
        </>
    )
}

export default AddUser
