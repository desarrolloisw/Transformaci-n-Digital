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
            <Route path="/" element={<Dashboard />} >
                <Route index element={<Navigate to="dashboard/processes"  replace />} />
                <Route index path="dashboard/processes" element={<DashboardProcess />} />
                <Route path="dashboard/categories" element={<DashboardCategories />} />
                <Route path="dashboard/categoriesbyprocess" element={<DashboardCategoriesByProcess />} />
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