import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminPage from './pages/AdminPage';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminWorkouts from './pages/AdminWorkouts';
import AdminMeals from './pages/AdminMeals';
import AdminPlans from './pages/AdminPlans';
import AdminPartners from './pages/AdminPartners';
import Messages from './pages/Messages';
import ForgotPassword from './pages/ForgotPassword';
import ConfirmPassword from './pages/ConfirmPassword';
import AuthCode from './pages/AuthCode';
import Products from './pages/Products';
import Partners from './pages/Partners';
import PartnerDetail from './pages/PartnerDetail';
import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FitnessPrograms from './pages/FitnessPrograms';
import Meals from './pages/Meals';
import Plans from './pages/Plans';
import ProductDetail from './pages/ProductDetail';
import MealDetail from './pages/MealDetail';
import PlanDetail from './pages/PlanDetail';
import Membership from './pages/Membership';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './components/MyOrders';
import MealPlans from './components/MealPlans';
import WorkoutPlans from './components/WorkoutPlans';
import PaymentDetails from './components/MyMemberships';
import EditProfile from './components/EditProfile';
import Logout from './components/Logout';
import { socketService } from './services/socketService';
import ContactsPage from './pages/admin/ContactsPage';

function AppContent() {
  const location = useLocation();
  const publicPages = ['/', '/fitness-programs', '/meals', '/meal', '/plans', '/plan', '/products', '/product', '/partners', '/membership', '/cart', '/checkout'];
  const isLanding = location.pathname === '/';
  const showNavbar = isLanding || publicPages.some(path =>
    location.pathname === path ||
    location.pathname.startsWith(path + '/') ||
    location.pathname.startsWith(path + '?') ||
    location.pathname.startsWith(path + '#')
  );
  const showFooter = isLanding || publicPages.some(path =>
    location.pathname === path ||
    location.pathname.startsWith(path + '/') ||
    location.pathname.startsWith(path + '?') ||
    location.pathname.startsWith(path + '#')
  );

  useEffect(() => {
    socketService.initializeSocket();
  }, []);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/fitness-programs" element={<FitnessPrograms />} />
        <Route path="/meals" element={<Meals />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/products" element={<Products />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/partners/:id" element={<PartnerDetail />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/meal/:id" element={<MealDetail />} />
        <Route path="/plan/:id" element={<PlanDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth-code" element={<AuthCode />} />
        <Route path="/confirm-password" element={<ConfirmPassword />} />
        <Route path="/dashboard/*" element={<UserLayout />}>
          <Route index element={<Navigate to="my-orders" replace />} />
          <Route path="" element={<Dashboard />}>
            <Route path="my-orders" element={<MyOrders />} />
            <Route path="meal-plans" element={<MealPlans />} />
            <Route path="workout-plans" element={<WorkoutPlans />} />
            <Route path="payment-details" element={<PaymentDetails />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="logout" element={<Logout />} />
          </Route>
        </Route>
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="messages" element={<Messages />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="workouts" element={<AdminWorkouts />} />
          <Route path="meals" element={<AdminMeals />} />
          <Route path="plans" element={<AdminPlans />} />
          <Route path="partners" element={<AdminPartners />} />
          <Route path="page" element={<AdminPage />} />
        </Route>
      </Routes>
      {showFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
