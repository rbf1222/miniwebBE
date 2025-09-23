import { ProtectedRoute } from "@/components/auth/protected-route"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { UploadWizard } from "@/components/admin/upload-wizard"

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <div className="max-w-4xl">
          <UploadWizard />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
