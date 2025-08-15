"use client";

import React from "react";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";

// PUBLIC_INTERFACE
export function Shell({ children }: { children: React.ReactNode }) {
  /** Dashboard shell layout with top navigation and sidebar. */
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <div className="layout">
        <Sidebar />
        <main className="container-page py-6">{children}</main>
      </div>
    </div>
  );
}
