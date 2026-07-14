import { useLocation } from "react-router-dom";

const formatRouteName = (pathname: string) => {
  const currentPath = pathname === "/" ? "/dashboard" : pathname;
  const lastSegment = currentPath.split("/").filter(Boolean).at(-1) ?? "dashboard";

  return lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const PlaceholderPage = () => {
  const location = useLocation();

  return (
    <main className="portal-shell flex items-start">
      <h1 className="text-xl font-semibold text-dark">
        {formatRouteName(location.pathname)}
      </h1>
    </main>
  );
};

export default PlaceholderPage;
