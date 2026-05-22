// src/App.jsx
import { useApp } from "./context/AppContext";
import { C } from "./constants";

// Import all screens
import LandingScreen from "./screens/LandingScreen";
import QuizScreen from "./screens/QuizScreen";
import GeneratingScreen from "./screens/GeneratingScreen";
import PlanScreen from "./screens/PlanScreen";
import ErrorScreen from "./screens/ErrorScreen";
import FollowUpScreen from "./screens/FollowUpScreen";
import FollowUpPlanScreen from "./screens/FollowUpPlanScreen";
import DashboardScreen from "./screens/DashboardScreen";
import CommunityScreen from "./screens/CommunityScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AuthScreen from "./screens/AuthScreen";
import LoginScreen from "./screens/LoginScreen";
import OTPScreen from "./screens/OTPScreen";  // ✅ new OTP screen

function AppContent() {
  const { screen } = useApp();

  // Render the appropriate screen based on state
  switch (screen) {
    case "landing":
      return <LandingScreen />;
    case "auth":
      return <AuthScreen />;
    case "login":
      return <LoginScreen />;
    case "quiz":
      return <QuizScreen />;
    case "generating":
      return <GeneratingScreen />;
    case "plan":
      return <PlanScreen />;
    case "error":
      return <ErrorScreen />;
    case "followup":
      return <FollowUpScreen />;
    case "followup_plan":
      return <FollowUpPlanScreen />;
    case "dashboard":
      return <DashboardScreen />;
    case "community":
      return <CommunityScreen />;
    case "profile":
      return <ProfileScreen />;
    case "otp":          // ✅ OTP verification screen
      return <OTPScreen />;
    default:
      return <LandingScreen />;
  }
}

function App() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <AppContent />
    </div>
  );
}

export default App;
