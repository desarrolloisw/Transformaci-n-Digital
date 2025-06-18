import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrincipalLayout } from '../layout/PrincipalLayout';
import { Dashboard } from '../pages/Dashboard';
import { Login } from '../pages/Login';
import { Process } from '../components/chatbotConfig/Process';
import { ProcessDetails } from '../pages/ProcessDetails';
import { UserDetails } from '../pages/UserDetails';
import { Users } from '../pages/Users';
import { Page404 } from '../pages/notFound/404';
import { DashboardProcess } from '../components/dashboard/DashboardProcess';
import { DashboardCategories } from '../components/dashboard/DashboardCategories';
import { DashboardCategoriesByProcess } from '../components/dashboard/DashboardCategoriesByProcess';
import { ChatbotConfig } from '../pages/ChatbotConfigPage';
import { Categories } from '../components/chatbotConfig/Category';
import { CategoryDetails } from '../pages/CategoryDetails';
import { PrivateRoute } from './PrivateRoute';

/**
 * MyRoutes component defines the main routing structure for the application.
 * Uses React Router v6. All protected routes are wrapped with PrivateRoute.
 * - Dashboard and chatbot-config routes are nested under PrincipalLayout.
 * - Redirects to login for unauthenticated users.
 * - Handles 404 with Page404.
 */
export const MyRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Protected routes with main layout */}
      <Route element={<PrivateRoute><PrincipalLayout /></PrivateRoute>}>
        {/* Dashboard routes (default redirect to processes) */}
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Navigate to="dashboard/processes" replace />} />
          <Route path="dashboard/processes" element={<DashboardProcess />} />
          <Route path="dashboard/categories" element={<DashboardCategories />} />
          <Route path="dashboard/categoriesbyprocess" element={<DashboardCategoriesByProcess />} />
        </Route>
        {/* Chatbot config section */}
        <Route path='chatbot-config' element={<ChatbotConfig />}>
          <Route index element={<Navigate to="processes" replace />} />
          <Route path='processes' element={<Process />} />
          <Route path='categories' element={<Categories />} />
        </Route>
        {/* Details and user management */}
        <Route path='process/:id' element={<ProcessDetails />} />
        <Route path='category/:id' element={<CategoryDetails />} />
        <Route path="users" element={<Users />} />
        <Route path="user/:id" element={<UserDetails />} />
      </Route>
      {/* Public routes */}
      <Route path="login" element={<Login />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  </BrowserRouter>
);