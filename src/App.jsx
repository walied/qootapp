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
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

function AppRouter() {
  const { screen } = useApp();

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
