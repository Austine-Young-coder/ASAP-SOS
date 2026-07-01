import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Splash from "./components/Splash";
import Onboarding from "./components/Onboarding";
import SignIn from "./components/SignIn";
import PermissionsFlow from "./components/PermissionsFlow";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import Call from "./pages/Call";
import Broadcasts from "./pages/Broadcasts";
import NewBroadcast from "./pages/NewBroadcast";
import Settings from "./pages/Settings";
import SOSAction from "./pages/SOSAction";
import { useAuth } from "./hooks/useAuth";
import { getLocal, setLocal } from "./lib/storage";

const STAGE = {
  SPLASH: "splash",
  ONBOARDING: "onboarding",
  SIGNIN: "signin",
  PERMISSIONS: "permissions",
  APP: "app"
};

export default function App() {
  const { user, loading } = useAuth();
  const [stage, setStage] = useState(STAGE.SPLASH);
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    const seenOnboarding = getLocal("seenOnboarding", false);
    const seenPermissions = getLocal("seenPermissions", false);

    // Stage resolution happens once splash finishes (see onSplashDone).
    // We precompute the next stage here so onSplashDone can just read it.
    window.__asapNextStage = !seenOnboarding
      ? STAGE.ONBOARDING
      : !user
      ? STAGE.SIGNIN
      : !seenPermissions
      ? STAGE.PERMISSIONS
      : STAGE.APP;
  }, [loading, user]);

  const onSplashDone = () => setStage(window.__asapNextStage || STAGE.ONBOARDING);

  const onOnboardingDone = () => {
    setLocal("seenOnboarding", true);
    setStage(user ? (getLocal("seenPermissions") ? STAGE.APP : STAGE.PERMISSIONS) : STAGE.SIGNIN);
  };

  const onSignedIn = () => {
    setStage(getLocal("seenPermissions", false) ? STAGE.APP : STAGE.PERMISSIONS);
  };

  const onPermissionsDone = () => {
    setLocal("seenPermissions", true);
    setStage(STAGE.APP);
  };

  // Once signed in via Supabase redirect, user appears asynchronously —
  // advance automatically if we were waiting on the sign-in screen.
  useEffect(() => {
    if (stage === STAGE.SIGNIN && user) onSignedIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, stage]);

  if (stage === STAGE.SPLASH) return <Splash onDone={onSplashDone} />;
  if (stage === STAGE.ONBOARDING) return <Onboarding onDone={onOnboardingDone} />;
  if (stage === STAGE.SIGNIN) return <SignIn onSignedIn={onSignedIn} />;
  if (stage === STAGE.PERMISSIONS) return <PermissionsFlow onDone={onPermissionsDone} />;

  const hideNav = location.pathname.startsWith("/broadcast/new") || location.pathname.startsWith("/sos-action");

  return (
    <div className="app-shell">
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/call" element={<Call />} />
          <Route path="/broadcasts" element={<Broadcasts />} />
          <Route path="/broadcast/new" element={<NewBroadcast />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/sos-action" element={<SOSAction />} />
        </Routes>
      </div>
      {!hideNav && <BottomNav />}
    </div>
  );
}
