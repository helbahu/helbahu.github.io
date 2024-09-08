import { Link } from "react-router-dom"

const UserCared = ({user}) => {
    return(
        <Link to={`/users/${user.username}`}>
            <div key={user.id} className='Users-User'>
                <h4>{user.firstName} {user.lastName} ({user.username})</h4>
                <h5>{user.email}</h5>
            </div>
        </Link>
    )
    
}
export default UserCared;