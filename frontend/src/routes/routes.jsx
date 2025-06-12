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

export const MyRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<PrivateRoute><PrincipalLayout /></PrivateRoute>}>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Navigate to="dashboard/processes" replace />} />
          <Route path="dashboard/processes" element={<DashboardProcess />} />
          <Route path="dashboard/categories" element={<DashboardCategories />} />
          <Route path="dashboard/categoriesbyprocess" element={<DashboardCategoriesByProcess />} />
        </Route>
        <Route path='chatbot-config' element={<ChatbotConfig />}>
          <Route index element={<Navigate to="processes" replace />} />
          <Route path='processes' element={<Process />} />
          <Route path='categories' element={<Categories />} />
        </Route>
        <Route path='process/:id' element={<ProcessDetails />} />
        <Route path='category/:id' element={<CategoryDetails />} />
        <Route path="users" element={<Users />} />
        <Route path="user/:id" element={<UserDetails />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  </BrowserRouter>
);