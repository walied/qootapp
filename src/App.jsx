import { useState } from "react";
import { useApp, AppProvider } from "./context/AppContext";
import LandingScreen from "./screens/LandingScreen";
import LoginScreen from "./screens/LoginScreen";
import QuizScreen from "./screens/QuizScreen";
import PlanScreen from "./screens/PlanScreen";
import DashboardScreen from "./screens/DashboardScreen";
import GeneratingScreen from "./screens/GeneratingScreen";
import ErrorScreen from "./screens/ErrorScreen";
import FollowUpScreen from "./screens/FollowUpScreen";
import FollowUpPlanScreen from "./screens/FollowUpPlanScreen";
import CommunityScreen from "./screens/CommunityScreen";
import ProfileScreen from "./screens/ProfileScreen";

export default function App() {
  const [hasError, setHasError] = useState(false);

  return (
    <div onError={(e) => setHasError(true)}>
      {hasError ? (
        <div style={{ color: "white", textAlign: "center", padding: 40 }}>
          <h1>⚠️ خطأ في التطبيق</h1>
          <p>تحقق من Console المتصفح (F12)</p>
        </div>
      ) : (
        <AppProvider>
          <AppRouter />
        </AppProvider>
      )}
    </div>
  );
}

function AppRouter() {
  const { screen } = useApp();
  console.log("📱 Current screen:", screen); // مراقبة الشاشة الحالية

  // لو screen غير محدد، نعرض landing
  if (!screen) return <LandingScreen />;

  switch (screen) {
    case "landing": return <LandingScreen />;
    case "login": return <LoginScreen />;
    case "quiz": return <QuizScreen />;
    case "plan": return <PlanScreen />;
    case "dashboard": return <DashboardScreen />;
    case "generating": return <GeneratingScreen />;
    case "error": return <ErrorScreen />;
    case "followup": return <FollowUpScreen />;
    case "followup_plan": return <FollowUpPlanScreen />;
    case "community": return <CommunityScreen />;
    case "profile": return <ProfileScreen />;
    default: return <LandingScreen />;
  }
}
