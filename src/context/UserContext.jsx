import { useContext, createContext, useState, useEffect } from 'react'
import { getProfileService } from '../services/authServices'

export const UserContext = createContext({})

export const UserContextProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({})
    const [loading, setLoading] = useState(true)

    //funcion para verificar si el usuario tiene una sesion activa
    const checkSession = async () => {
        try {
            setLoading(true)
            const userData = await getProfileService()
            setUserInfo(userData)
        } catch (error) {
            console.log('No hay sesión activa', error)
            setUserInfo({})
        } finally {
            setLoading(false)
        }
    }

    //funcion para obtener el id del usuario autenticado
    const getUserId = () => {
        return userInfo?.id || null
    }

    //verificar si el usuario esta autenticado o no
    const isAuthenticated = () => {
        return !!userInfo?.id
    }

    useEffect(() => {
        checkSession()
    }, [])

    return (
        <UserContext.Provider
            value={{
                userInfo,
                setUserInfo,
                loading,
                checkSession,
                getUserId,
                isAuthenticated,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)
