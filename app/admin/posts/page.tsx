import { ProtectedRoute } from "@/components/auth/protected-route"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { PostTable } from "@/components/admin/post-table"

export default function AdminPostsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <PostTable />
      </AdminLayout>
    </ProtectedRoute>
  )
}
