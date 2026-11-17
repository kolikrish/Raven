
import { Suspense, type ReactNode } from "react";

// Wraps each section in its own Suspense boundary, nested one inside the next. Nothing here
// suspends, so the server HTML and the client render are exactly the same as without it; the
// boundaries only change how hydration is scheduled. React hydrates a server-rendered boundary
// in a later pass than its parent, so nesting them hydrates the sections one after another,
// each in its own short task, instead of setting every section's animations up in one long
// task that blocks the main thread.
const HydrateInTurn = ({ children }: { children: ReactNode[] }) =>
  children.reduceRight<ReactNode>(
    (rest, section) => (
      <Suspense>
        {section}
        {rest}
      </Suspense>
    ),
    null,
  );

export default HydrateInTurn;
