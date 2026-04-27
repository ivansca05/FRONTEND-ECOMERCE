import { useUser } from "../../context/UserContext"
import toast from "react-hot-toast"
import { logoutService } from "../../services/authServices"
import { useNavigate } from "react-router"

const UserDropDown = () => {
    const { setUserInfo } = useUser()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logoutService()
            setUserInfo(null)
            toast.success('Sesión cerrada exitosamente')
            navigate('/')
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
            toast.error('Error al iniciar sesión, intente nuevamente')
        }
    }

    return (
        <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
            >
                <div className="w-10 rounded-full">
                    <img
                        src="https://res.cloudinary.com/dkoqeulbc/image/upload/v1777252119/3527523_cristiano_ronaldo_20240528093324_ijeusx.jpg"
                        alt="avatar"
                    />
                </div>
            </div>
            <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow"
            >
                 <li>
                    <a onClick={handleLogout} className="justify-between">
                        Cerrar sesión
                    </a>
                </li>
            </ul>
        </div>
    )
}

export default UserDropDown
