import UserForm from '../../forms/Users/UserForm'
import Restrict from '@/components/Authorization/Restrict'
import LinkButton from '@/components/LinkButton'

export default function AddUser() {
    return (
        <>
            <LinkButton href={`/users`} text={'< Back'} />{' '}
            <Restrict permission="user:update" showMessage>
                <UserForm />
            </Restrict>
        </>
    )
}
