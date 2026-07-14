import React from "react";
import Navbar from "./components/ui/navbar";

const Layout = ({
  children,
  flush = false,
}: {
  children: React.ReactNode;
  flush?: boolean;
}) => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <div className={flush ? "min-w-0 flex-1" : "min-w-0 flex-1 px-6 py-8 md:px-10"}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
