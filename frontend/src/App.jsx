import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import LogInPage from "./pages/auth/login/LogInPage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  const { data: authUserQuery, isLoading } = useQuery({
    queryKey: ["authUser"], // this querykey help to fetch data without writing the below function again in other components
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (data.error) return null;
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        console.log("authUser is here:", data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  return (
    <div className="flex max-w-6xl mx-auto">
      {/* Common components, bc it's not wrapped with Routes */}
      {authUserQuery && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={authUserQuery ? <HomePage /> : <Navigate to="/logIn" />}
        />
        <Route
          path="/signUp"
          element={!authUserQuery ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/logIn"
          element={!authUserQuery ? <LogInPage /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={
            authUserQuery ? <NotificationPage /> : <Navigate to="/logIn" />
          }
        />
        <Route
          path="/profile/:username"
          element={authUserQuery ? <ProfilePage /> : <Navigate to="/logIn" />}
        />
      </Routes>
      {authUserQuery && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;
