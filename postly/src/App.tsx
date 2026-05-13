import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'
import { AuthProvider } from './lib/auth-context'
import { LandingPage } from './pages/LandingPage'
import { AppLayout } from './pages/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { GeneratePage } from './pages/GeneratePage'
import { CalendarsPage } from './pages/CalendarsPage'
import { CalendarDetailPage } from './pages/CalendarDetailPage'
import { BrandsPage } from './pages/BrandsPage'
import { AccountPage } from './pages/AccountPage'
import { AuthPage } from './pages/AuthPage'
import { Toaster } from "@/components/ui/toaster"

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster />
    </>
  ),
})

const indexRoute = createRoute({ 
  getParentRoute: () => rootRoute, 
  path: '/', 
  component: LandingPage 
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => <AuthPage mode="login" />
})

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: () => <AuthPage mode="signup" />
})

const appRoute = createRoute({ 
  getParentRoute: () => rootRoute, 
  path: '/app', 
  component: AppLayout 
})

const dashboardRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/',
  component: DashboardPage
})

const generateRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/generate',
  component: GeneratePage
})

const calendarsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/calendars',
  component: CalendarsPage
})

const calendarDetailRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/calendars/$id',
  component: () => {
    const { id } = calendarDetailRoute.useParams()
    return <CalendarDetailPage calendarId={id} />
  }
})

const brandsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/brands',
  component: BrandsPage
})

const accountRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/account',
  component: AccountPage
})

const routeTree = rootRoute.addChildren([
  indexRoute, 
  loginRoute,
  signupRoute,
  appRoute.addChildren([dashboardRoute, generateRoute, calendarsRoute, calendarDetailRoute, brandsRoute, accountRoute])
])

const router = createRouter({ routeTree })

export function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
