
"use client";

import { useEffect } from "react";
import ServerInlineScript from "./ServerInlineScript";

type SiteMarkerProps = {
  name: string;
};

const SiteMarker = ({ name }: SiteMarkerProps) => {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute(name, "");
    return () => root.removeAttribute(name);
  }, [name]);

  return <ServerInlineScript id={`marker-${name}`} html={`document.documentElement.setAttribute(${JSON.stringify(name)},"")`} />;
};

export default SiteMarker;
