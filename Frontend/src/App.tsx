import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { GroupOrderProvider } from "./context/GroupOrderContext";
import { SupportProvider } from "./context/SupportContext";
import { VerificationProvider } from "./context/VerificationContext";
import { NotificationProvider } from "./context/NotificationContext";
import Index from "./pages/Index";
import Boys from "./pages/Boys";
import Girls from "./pages/Girls";
import Teachers from "./pages/Teachers";
import ClubCustomization from "./pages/ClubCustomization";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import GroupOrders from "./pages/GroupOrders";
import EventMerch from "./pages/EventMerch";
import ReturnPolicy from "./pages/ReturnPolicy";
import PaymentSupport from "./pages/PaymentSupport";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <GroupOrderProvider>
            <SupportProvider>
              <VerificationProvider>
                <NotificationProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/home" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                      <Route path="/boys" element={<ProtectedRoute><Boys /></ProtectedRoute>} />
                      <Route path="/girls" element={<ProtectedRoute><Girls /></ProtectedRoute>} />
                      <Route path="/teachers" element={<ProtectedRoute><Teachers /></ProtectedRoute>} />
                      <Route path="/club-customization" element={<ProtectedRoute><ClubCustomization /></ProtectedRoute>} />
                      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                      <Route path="/group-orders" element={<ProtectedRoute><GroupOrders /></ProtectedRoute>} />
                      <Route path="/group-orders/:code" element={<ProtectedRoute><GroupOrders /></ProtectedRoute>} />
                      <Route path="/event-merch" element={<ProtectedRoute><EventMerch /></ProtectedRoute>} />
                      <Route path="/return-policy" element={<ProtectedRoute><ReturnPolicy /></ProtectedRoute>} />
                      <Route path="/payment-support" element={<ProtectedRoute><PaymentSupport /></ProtectedRoute>} />
                      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </NotificationProvider>
              </VerificationProvider>
            </SupportProvider>
          </GroupOrderProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
