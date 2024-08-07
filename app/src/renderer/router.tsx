import type { FC } from 'react'
import {
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom'
import { AppLayout } from './layout/app'
import App from './pages/app'
import Settings from './pages/settings'

const router = createHashRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={<App />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/about" element={<div>about</div>} />
    </Route>,
  ),
)

export const Router: FC = () => {
  return <RouterProvider router={router} />
}
