import { lazy, Suspense } from "react";
import ScrollToTop from "./components/common/ScrollToTop";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import { AppProvider, useApp } from "./contexts/AppContext";
import Layout from "./components/layout/Layout";
const Landing = lazy(() => import("./pages/public/Landing"));
const Auth = lazy(() => import("./pages/auth/Auth"));
const Dashboard = lazy(() => import("./pages/farmer/Dashboard"));
const Farms = lazy(() => import("./pages/farmer/Farms"));
const Detection = lazy(() => import("./pages/farmer/Detection"));
const Monitoring = lazy(() => import("./pages/farmer/Monitoring"));
const Weather = lazy(() => import("./pages/farmer/Weather"));
const Harvest = lazy(() => import("./pages/farmer/Harvest"));
const Advice = lazy(() => import("./pages/farmer/Advice"));
const Notifications = lazy(() => import("./pages/farmer/Notifications"));
const Profile = lazy(() => import("./pages/farmer/Profile"));
const Reports = lazy(() => import("./pages/officer/Reports"));
const Visits = lazy(() => import("./pages/officer/Visits"));
const Users = lazy(() => import("./pages/admin/Users"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
function Guard() {
  const { user } = useApp();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
function RoleGuard({ roles }: { roles: string[] }) {
  const { user } = useApp();
  return user && roles.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/app/dashboard" replace />
  );
}
export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense
          fallback={
            <div className="route-loading" role="status">
              <span className="large-icon">⌁</span>
              <p>Preparing your workspace…</p>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Landing />} />
            {["login", "register", "forgot-password", "reset-password"].map(
              (path) => (
                <Route
                  path={"/" + path}
                  element={<Auth key={path} />}
                  key={path}
                />
              ),
            )}
            <Route element={<Guard />}>
              <Route path="/app" element={<Layout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="farms" element={<Farms />} />
                <Route path="monitoring" element={<Monitoring />} />
                <Route path="detection" element={<Detection />} />
                <Route path="weather" element={<Weather />} />
                <Route path="harvest" element={<Harvest />} />
                <Route path="advice" element={<Advice />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="reports" element={<Reports />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Profile settings />} />
                <Route element={<RoleGuard roles={["officer", "admin"]} />}>
                  <Route path="users" element={<Users />} />
                  <Route path="visits" element={<Visits />} />
                </Route>
                <Route element={<RoleGuard roles={["admin"]} />}>
                  <Route path="analytics" element={<Analytics />} />
                </Route>
              </Route>
            </Route>
            <Route
              path="*"
              element={
                <div className="not-found">
                  <h1>This path is still a seedling.</h1>
                  <p>Let’s take you back to familiar ground.</p>
                  <a className="button primary" href="/">
                    Back to home
                  </a>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  );
}
