import { ReactNode } from "react";
import { Header } from "./Header";
import { AppSidebar } from "./AppSidebar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6 md:p-8 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
