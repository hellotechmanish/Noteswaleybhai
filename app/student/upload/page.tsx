// import { UploadForm } from '@/components/student/upload-form'
// import { DashboardHeader } from '@/components/student/dashboard-header'

// export default function UploadPage() {
//   return (
//     <main className="min-h-screen bg-gray-50">
//       <DashboardHeader />
//       <div className="max-w-2xl mx-auto px-6 py-8">
//         <UploadForm />
//       </div>
//     </main>
//   )
// }

import { UploadForm } from "@/components/student/upload-form";

export default function UploadPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <UploadForm />
    </div>
  );
}
