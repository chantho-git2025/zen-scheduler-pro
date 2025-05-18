
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import SearchBar from "@/components/common/SearchBar";
import { Bell } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="md:ml-64 transition-all duration-300 min-h-screen">
        <header className="sticky top-0 z-30 h-16 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center px-4 md:px-6">
            <div className="ml-auto flex items-center space-x-4">
              <SearchBar />
              <button className="relative rounded-full p-2 hover:bg-muted">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
                <span className="sr-only">Notifications</span>
              </button>
            </div>
          </div>
        </header>
        
        <main className="container py-6 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
