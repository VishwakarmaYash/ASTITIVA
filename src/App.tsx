// import { Routes, Route, Navigate } from "react-router-dom";

// import WebsiteApp from "./website/WebsiteApp";
// import AdminApp from "./admin/App";

// function AdminRoute({ children }: { children: React.ReactNode }) {
//   const token = localStorage.getItem("vault_auth_token");
//   const role = localStorage.getItem("vault_user_role");

//   if (!token) {
//     return <Navigate to="/" replace />;
//   }

//   if (role !== "admin") {
//     return <Navigate to="/" replace />;
//   }

//   return <>{children}</>;
// }

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<WebsiteApp />} />

//       <Route
//         path="/admin"
//         element={
//           <AdminRoute>
//             <AdminApp />
//           </AdminRoute>
//         }
//       />
//     </Routes>
//   );
// }

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WebsiteApp from "./website/WebsiteApp";
import AdminApp from "./admin/App";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WebsiteApp />} />
        <Route path="/admin" element={<AdminApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}