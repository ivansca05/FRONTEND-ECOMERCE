import { Link } from 'react-router'
import { useUser } from '../../context/UserContext'

const AuthButtons = () => {
    const { userInfo } = useUser()

    //si hay usuario logueado, no mostrar los botones de login y register
    if (userInfo) {
        return null
    }

    return (
        <div className="py-4 flex justify-center items-center gap-4 flex-wrap">
            <Link className="btn btn-neutral btn-outline" to={'/register'}>
                Crear Cuenta
            </Link>

            <div className="hidden lg:block">|</div>

            <Link className="btn btn-neutral btn-outline" to={'/login'}>
                Iniciar sesión
            </Link>
        </div>
    )
}

export default AuthButtons
