import { Routes, Route } from 'react-router'
import Layout from './layout/Layout'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Checkout from './pages/Checkout'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailure from './pages/PaymentFailure'
import PaymentPending from './pages/PaymentPending'
import { UserContextProvider } from './context/UserContext'
import { ProductContextProvider } from './context/ProductContext'
import { CartContextProvider } from './context/CartContext'
import { Toaster } from 'react-hot-toast'
import DetailProduct from './pages/DetailProduct'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

function App() {
    return (
        <UserContextProvider>
            <ProductContextProvider>
                <CartContextProvider>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route
                                path="/detailProduct/:id"
                                element={<DetailProduct />}
                            />
                            <Route path='/checkout' element={<Checkout />}/>
                            <Route path='/payment/success' element={<PaymentSuccess />}/>
                            <Route path='/payment/failure' element={<PaymentFailure />}/>
                            <Route path='/payment/pending' element={<PaymentPending />}/>

                            <Route
                                path="/admin/dashboard/*"
                                element={
                                    <ProtectedRoute>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>
                    </Routes>
                </CartContextProvider>
            </ProductContextProvider>
            <Toaster />
        </UserContextProvider>
    )
}

export default App
