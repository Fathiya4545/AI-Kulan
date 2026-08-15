// Shown when the app has been waiting on Convex long enough that the backend
// is almost certainly not running.
export default function BackendWarning() {
  return (
    <div className="backend-warning">
      <strong>Can't reach the database.</strong>
      <p>
        This project uses a local Convex deployment, which only exists while{' '}
        <code>npx convex dev</code> is running. Open a second terminal tab in this
        folder and start it:
      </p>
      <pre>npx convex dev</pre>
      <p>Leave it running, then reload this page.</p>
    </div>
  );
}
