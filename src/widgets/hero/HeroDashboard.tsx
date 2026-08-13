import { Dashboard } from "./Dashboard";
import { getHeroMetrics } from "./liveMetrics";

/**
 * Server boundary for the hero dashboard.
 *
 * Metrics are resolved here, on the server, and handed to the client component
 * as props. That keeps the real figures inside the streamed HTML instead of
 * appearing only after hydration.
 */
export async function HeroDashboard() {
  const metrics = await getHeroMetrics();
  return <Dashboard metrics={metrics} />;
}
