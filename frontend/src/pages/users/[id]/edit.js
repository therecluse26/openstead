import UserForm from '../../../forms/Users/UserForm'
import LinkButton from '@/components/LinkButton'
import { useRouter } from 'next/router'

export default function EditUser() {
    const { query } = useRouter()

    const { id } = query

    return (
        <>
            <LinkButton href={`/users/${id}`} text={'< Back'} />{' '}
            <UserForm mode="edit" />
        </>
    )
}
