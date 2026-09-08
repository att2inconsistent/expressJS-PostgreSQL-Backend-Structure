
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/seller/Dashboard";
import IncomingOrders from "./pages/seller/IncomingOrders";
import ManageMenu from "./pages/seller/ManageMenu";
import PendingApproval from "./pages/seller/PendingApproval";
import ReviewPayments from "./pages/seller/ReviewPayments";

import ManageStands from "./pages/admin/ManageStands";
import AssignSellers from "./pages/admin/AssignSellers";
import SellerApplications from "./pages/admin/SellerApplications";

const router = createBrowserRouter ([
  { path: '/login', element: <Login /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/pending-approval', element: <PendingApproval /> },
    { path: '/menu', element: <ManageMenu /> },
    { path: '/orders', element: <IncomingOrders /> },
    { path: '/payments', element: <ReviewPayments /> },
    { path: '/admin/applications', element: <SellerApplications /> },
    { path: '/admin/stands', element: <ManageStands /> },
    { path: '/admin/assign', element: <AssignSellers /> },
])

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App;