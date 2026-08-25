import { useEffect } from "react";
import Layout from "./components/layout/Layout";
import { useSessionStore } from "./store/chatStore";
import { fetchConfigOptions, createSession } from "./services/api";

function App() {
  const { setConfigOptions, setSession } = useSessionStore();

  useEffect(() => {
    async function init() {
      // 1. Fetch available options (models, backends, etc.)
      const options = await fetchConfigOptions();
      setConfigOptions(options);

      // 2. Initialize a session (either resume or create new)
      let sessionId = localStorage.getItem("deep_agent_session");
      if (!sessionId) {
        const session = await createSession();
        sessionId = session.session_id;
        localStorage.setItem("deep_agent_session", sessionId);
      }
      setSession(sessionId);
    }
    init();
  }, []);

  return <Layout />;
}

export default App;
