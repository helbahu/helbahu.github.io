import { useNavigate } from "react-router-dom";
import useLocalStorage from "./useLocalStorage";

const Logout = ({setUser,closeNav}) => {
    const {clear} = useLocalStorage();
    const navigate = useNavigate();

    const logout = () => {
        clear();
        setUser(user=>({}));
        closeNav();
        navigate('/');
    }

    return (
        <span className="Logout" onClick={logout}>Logout</span>
    )
}
export default Logout;