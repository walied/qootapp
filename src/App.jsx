import { useApp } from "./context/AppContext";
import { C } from "./constants";
import LandingScreen from "./screens/LandingScreen";
import AuthScreen from "./screens/AuthScreen";
import AICoachScreen from "./screens/AICoachScreen";

function AppContent() {
  const { screen } = useApp();
  switch (screen) {
    case "landing": return <LandingScreen />;
    case "auth": return <AuthScreen />;
    case "coach": return <AICoachScreen />;
    default: return <LandingScreen />;
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
