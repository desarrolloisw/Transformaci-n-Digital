import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { Login } from '../pages/Login';
import { Process } from '../pages/Process';
import { ProcessDetails } from '../pages/ProcessDetails';
import { UserDetails } from '../pages/UserDetails';
import { Users } from '../pages/Users';
import { Page404 } from '../pages/notFound/404';
import { DashboardProcess } from '../components/dashboard/DashboardProcess';
import { DashboardCategories } from '../components/dashboard/DashboardCategories';
import { DashboardCategoriesByProcess } from '../components/dashboard/DashboardCategoriesByProcess';

export const MyRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} >
                <Route path="processes" element={<DashboardProcess />} />
                <Route path="categories" element={<DashboardCategories />} />
                <Route path="categoriesbyprocess" element={<DashboardCategoriesByProcess />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path='/processes' element={<Process />} />
            <Route path='/process/:id' element={<ProcessDetails />} />
            <Route path="/users" element={<Users />} />
            <Route path="/user/:id" element={<UserDetails />} />
            <Route path="*" element={<Page404 />} />
        </Routes>
    </BrowserRouter>
)