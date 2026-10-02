import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router";
import SiteLayout from "../components/layout/SiteLayout";
import ProtectedLayout from "../components/layout/ProtectedLayout";
import AccountLayout from "../components/layout/AccountLayout";
import HomePage from "../pages/home/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import RouteErrorPage from "../pages/RouteErrorPage";

const PropertiesPage = lazy(() => import("../pages/properties/PropertiesPage"));
const PropertyDetailsPage = lazy(
  () => import("../pages/properties/PropertyDetailsPage"),
);
const AuthPage = lazy(() => import("../pages/auth/AuthPage"));
const ProfilePage = lazy(() => import("../pages/account/ProfilePage"));
const ChangePasswordPage = lazy(
  () => import("../pages/account/ChangePasswordPage"),
);
const FavoritesPage = lazy(() => import("../pages/account/FavoritesPage"));
const MyPropertiesPage = lazy(
  () => import("../pages/account/MyPropertiesPage"),
);
const PropertyFormPage = lazy(
  () => import("../pages/account/PropertyFormPage"),
);
const ComponentPreview = lazy(() => import("../pages/ComponentPreview"));
const TermsPage = lazy(() => import("../pages/TermsPage"));
const AboutPage = lazy(() => import("../pages/company/AboutPage"));
const ContactPage = lazy(() => import("../pages/company/ContactPage"));

function PageLoader() {
  return (
    <Suspense
      fallback={
        <p role="status" className="p-12 text-center text-sm text-muted">
          Loading your space…
        </p>
      }
    >
      <Outlet />
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <PageLoader />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "properties", element: <PropertiesPage /> },
          { path: "categories/:category", element: <PropertiesPage /> },
          { path: "properties/:id", element: <PropertyDetailsPage /> },
          { path: "login", element: <AuthPage key="login" mode="login" /> },
          { path: "signup", element: <AuthPage key="signup" mode="signup" /> },
          {
            path: "forgot-password",
            element: <AuthPage key="forgot" mode="forgot" />,
          },
          {
            path: "reset-password",
            element: <AuthPage key="reset" mode="reset" />,
          },
          { path: "terms", element: <TermsPage /> },
          { path: "about-us", element: <AboutPage /> },
          { path: "contact-us", element: <ContactPage /> },
          { path: "design/components", element: <ComponentPreview /> },
          {
            path: "account",
            element: <ProtectedLayout />,
            children: [
              {
                element: <AccountLayout />,
                children: [
                  { index: true, element: <Navigate to="profile" replace /> },
                  { path: "profile", element: <ProfilePage /> },
                  { path: "change-password", element: <ChangePasswordPage /> },
                  { path: "favorites", element: <FavoritesPage /> },
                  { path: "properties", element: <MyPropertiesPage /> },
                  { path: "properties/new", element: <PropertyFormPage /> },
                  {
                    path: "properties/:id/preview",
                    element: <PropertyFormPage />,
                  },
                  {
                    path: "properties/:id/edit",
                    element: <PropertyFormPage />,
                  },
                ],
              },
            ],
          },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
