import { createContext, useState, useEffect, useContext } from 'react'
import { useUser } from './UserContext'
import {
    addToCartService,
    getCartService,
    updateCartService,
    removeFromCartService,
    clearCartService,
    getCartTotalService,
} from '../services/cartServices'

import toast from 'react-hot-toast'

export const CartContext = createContext({})

export const CartContextProvider = ({ children }) => {
    const [cart, setCart] = useState([])
    const [total, setTotal] = useState(0)
    const [itemsQuantity, setItemsQuantity] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    const { getUserId, isAuthenticated, loading: userLoading } = useUser()

    //funcion para cargar el carrito desde localStorage
    const loadLocalCart = () => {
        try {
            const localCart = localStorage.getItem('cart')
            return localCart ? JSON.parse(localCart) : []
        } catch (error) {
            console.error('Error al cargar el carrito local: ', error)
            return []
        }
    }

    //funcion para guardar el carrito en el localStorage
    const saveLocalCart = (cartItems) => {
        try {
            localStorage.setItem('cart', JSON.stringify(cartItems))
        } catch (error) {
            console.error('Error al guardar carrito local', error)
        }
    }

    //Funcion para cargar el carrito (backend o localStorage)
    const loadCart = async () => {
        if (isAuthenticated()) {
            //usuario autenticado: cargar desde backend

            try {
                setLoading(true)
                const userId = getUserId()
                const response = await getCartService(userId)

                //Transofrmar los datos del backend al formato del frontend
                const cartItems =
                    response.cart?.products?.map((item) => ({
                        _id: item.productId._id,
                        name: item.productId.name,
                        price: item.productId.price,
                        imageUrl: item.productId.imageUrl,
                        description: item.productId.description,
                        stock: item.productId.stock,
                        quantity: item.quantity,
                    })) || []

                setCart(cartItems)
            } catch (error) {
                console.error('Error al cargar el carrito', error)
                //si falla el backedn, intentar cargar desde localStorage como fallback
                const localCart = loadLocalCart()
                setCart(localCart)
            } finally {
                setLoading(false)
            }
        } else {
            //Usuario no autenticado: cargar desde localStorage
            const localCart = loadLocalCart()
            setCart(localCart)
        }
    }

    //funcion para sincronizar carrito local con el backend
    const syncCartWIthBackend = async () => {
        const localCart = loadLocalCart()

        if (localCart.length > 0 && isAuthenticated()) {
            try {
                setLoading(true)
                const userId = getUserId()

                //agregar cada producto del carrito local al backend
                for (const item of localCart) {
                    try {
                        await addToCartService(userId, item._id, item.quantity)
                    } catch {
                        console.error(
                            `Error al sincronizar producto ${item.name}`,
                        )
                    }
                }

                //Limpiar localStorage después de sincronizar
                localStorage.removeItem('cart')

                //recargar carrito desde el backend
                await loadCart()
                toast.success('Carrito sincronizado con éxito')
            } catch (error) {
                console.error('Error al sincronizar carrito', error)
            } finally {
                setLoading(false)
            }
        }
    }

    //cargar carrito al inicializar
    useEffect(() => {
        let isMounted = true

        const initializeCart = async () => {
            //Esperar un poco para que el userContext se estabilice
            await new Promise((resolve) => setTimeout(resolve, 100))

            if (!isMounted) return

            const previousAuthState = localStorage.getItem('wasAuthenticated')
            const currentAuthState = isAuthenticated()

            if (!previousAuthState && currentAuthState) {
                //El usuario acaba de iniciar sesión, sincronizar carrito
                await syncCartWIthBackend()
            } else {
                //cargar carrito normalmente
                await loadCart()
            }
            //guardar el estado de autenticación actual para la próxima vez
            localStorage.setItem(
                'wasAuthenticated',
                currentAuthState.toString(),
            )
            setLoading(false)
        }

        initializeCart()

        return () => {
            isMounted = false
        }
    }, [userLoading])

    //Añadir producto al carrito
    const addToCart = async (product, quantity = 1) => {
        if (isAuthenticated()) {
            //usuario autenticado
            try {
                setLoading(true)
                const userId = getUserId()
                await addToCartService(userId, product._id, quantity)

                //recargar carrito desde el backend
                await loadCart()
                toast.success('Producto agregado al carrito')
            } catch (error) {
                console.error('Error al agregar producto al carrito', error)
                toast.error('Error al agregar producto al carrito')
            } finally {
                setLoading(false)
            }
        } else {
            //Usuario no autenticado: agregar al carrito local
            try {
                const currentCart = [...cart]
                const existingIndex = currentCart.findIndex(
                    (item) => item._id === product._id,
                )

                if (existingIndex > -1) {
                    //Si el producto ya existe en el carrito, actualizar la cantidad
                    currentCart[existingIndex].quantity += quantity
                } else {
                    //Si el producto no existe en el carrito, agregarlo
                    currentCart.push({ ...product, quantity })

                    setCart(currentCart)
                    saveLocalCart(currentCart)
                    toast.success('Producto agregado al carrito')
                }
            } catch (error) {
                console.error(
                    'Error al agregar producto al carrito local',
                    error,
                )
                toast.error('Error al agregar producto al carrito')
            }
        }
    }

    const removeProductFromBackend = async (userId, productId) => {
    const response = await fetch(
        `http://localhost:3001/api/cart/removeProduct/${userId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
        },
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar el producto')
    }

    return data
}

    //Eliminar producto del carrito
const removeFromCart = async (productId) => {
    if (isAuthenticated()) {
        try {
            setLoading(true)
            const userId = getUserId()

            await removeProductFromBackend(userId, productId)

            //recargar carrito desde el backend
            await loadCart()
            toast.success('Producto eliminado del carrito')
        } catch (error) {
            console.error('Error al eliminar producto del carrito', error)
            toast.error('Error al eliminar producto del carrito')
        } finally {
            setLoading(false)
        }
    } else {
        try {
            const currentCart = cart.filter((item) => item._id !== productId)
            setCart(currentCart)
            saveLocalCart(currentCart)
            toast.success('Producto eliminado del carrito')
        } catch (error) {
            console.error('Error al eliminar producto del carrito local', error)
            toast.error('Error al eliminar producto del carrito local')
        }
    }
}

    //Actualizar cantidad de un producto en el carrito
    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            toast.error('La cantidad debe ser al menos 1')
            return
        }

        if (isAuthenticated()) {
            try {
                setLoading(true)
                const userId = getUserId()
                await updateCartService(userId, productId, newQuantity)

                //recargar carrito desde el backend
                await loadCart()
                toast.success('Cantidad actualizada')
            } catch (error) {
                console.error('Error al actualizar la cantidad', error)
                toast.error('Error al actualizar la cantidad')
            } finally {
                setLoading(false)
            }
        } else {
            try {
                const currentCart = cart.map((item) =>
                    item._id === productId
                        ? { ...item, quantity: newQuantity }
                        : item,
                )
                setCart(currentCart)
                saveLocalCart(currentCart)
                toast.success('Cantidad actualizada')
            } catch (error) {
                console.error(
                    'Error al actualizar la cantidad en el carrito local',
                    error,
                )
                toast.error('Error al actualizar la cantidad')
            }
        }
    }

    //limpiar todo el carrito
    const clearCart = async () => {
        if (isAuthenticated()) {
            try {
                setLoading(true)
                const userId = getUserId()
                await clearCartService(userId)

                //limpiar el carrito local
                setCart([])
                toast.success('Carrito vacío')
            } catch (error) {
                console.error('Error al limpiar el carrito', error)
                toast.error('Error al limpiar el carrito')
            } finally {
                setLoading(false)
            }
        } else {
            try {
                setCart([])
                saveLocalCart([])
                toast.success('Carrito vacío')
            } catch (error) {
                console.error('Error al limpiar el carrito local', error)
                toast.error('Error al limpiar el carrito local')
            }
        }
    }

    //Escuchar cambios de autenticacion por separado
    useEffect(() => {
        const previousAuthState =
            localStorage.getItem('wasAuthenticated') === 'true'
        const currentAuthState = isAuthenticated()

        //solo actuar si realmente cambió el estado de autenticación
        if (previousAuthState !== currentAuthState && cart.length === 0) {
            loadCart()
            localStorage.setItem(
                'wasAuthenticated',
                currentAuthState.toString(),
            )
        }
    }, [])

    //Reaccionar directamente a camnios en userInfo (login/logout)
    useEffect(() => {
        //esperar a que Usercontext termine de verificar la sesión
        if (userLoading) return

        //Si el usuario inició sesion (userInfo.id aparece). sincronizar o cargar
        if (isAuthenticated) {
            ;(async () => {
                try {
                    const localCart = loadLocalCart()
                    if (localCart.length > 0) {
                        await syncCartWithBackend()
                    } else {
                        await loadCart()
                    }
                } catch (error) {
                    console.error(
                        'Error al sincronizar el carrito tras login',
                        error,
                    )
                }
            })()
        } else {
            //si el usuario hace logout mostrar carrito local
            try {
                setCart(loadLocalCart())
            } catch (error) {
                console.error(
                    'Error al cargar el carrito local tras logout',
                    error,
                )
            }
        }
    }, [isAuthenticated, userLoading])

    // calcular total y cantidad de items cuando cambia el carrito
    useEffect(() => {
        const newTotal = cart.reduce(
            (acc, item) => acc + item.price * (item.quantity || 1),
            0,
        )

        setTotal(newTotal)

        const newItemsQuantity = cart.reduce(
            (acc, item) => acc + (item.quantity || 1),
            0,
        )

        setItemsQuantity(newItemsQuantity)
    }, [cart])

    // Abrir modal
    const openModal = () => setIsModalOpen(true)
    //Cerrar modal
    const closeModal = () => setIsModalOpen(false)

    return (
        <CartContext.Provider
            value={{
                cart,
                total,
                itemsQuantity,
                isModalOpen,
                closeModal,
                loading,
                addToCart,
                removeFromCart,
                clearCart,
                openModal,
                updateQuantity,
                loadCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)
