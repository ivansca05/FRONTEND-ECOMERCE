import { Link } from 'react-router'
import Cart from './Cart'
import AuthButtons from './AuthButtons'
import UserDropDown from './UserDropDown'
import { useUser } from '../../context/UserContext'

const Navbar = () => {
    const { loading, userInfo } = useUser()
    return (
        <header>
            <AuthButtons />
            <nav className="navbar bg-base-100 shadow-sm lg:rounded-box w-full">
                <div className="navbar-start">
                    <Link
                        className="btn btn-ghost text-xl font-bold uppercase text-gray-700"
                        to="/"
                    >
                        Umbrella Shop
                    </Link>
                </div>
                <div className="navbar-end gap-3">
                    {userInfo?.isAdmin && (
                        <Link
                            to="/admin/dashboard/products"
                            className="btn btn-primary"
                        >
                            Dashboard
                        </Link>
                    )}
                    <Cart />
                    {!loading && userInfo?.username && <UserDropDown />}
                </div>
            </nav>
        </header>
    )
}

export default Navbar
