"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// A <script> that only ever comes from the server HTML, where it runs before the first paint.
// When React renders the tree in the browser instead (a 404 arrives as a bare shell), a script
// tag it creates never runs and React warns about it, so nothing is rendered there.
const ServerInlineScript = ({ id, html }: { id: string; html: string }) => {
  const fromServer = useSyncExternalStore(
    subscribe,
    () => false,
    () => true,
  );
  if (!fromServer) return null;
  return <script id={id} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default ServerInlineScript;
