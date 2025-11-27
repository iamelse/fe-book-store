import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import pageMeta from "../config/pageMeta";

export default function MetaUpdater() {
  const { pathname } = useLocation();

  useEffect(() => {
    const defaultTitle = "Bookify";
    const defaultDesc = "Beli buku favoritmu di Book Store.";

    const meta = pageMeta[pathname];

    document.title = meta?.title || defaultTitle;

    const descContent = meta?.description || defaultDesc;
    let metaDesc = document.querySelector("meta[name='description']");

    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }

    metaDesc.setAttribute("content", descContent);
  }, [pathname]);

  return null;
}