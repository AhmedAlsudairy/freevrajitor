"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Package,
  CreditCard,
  Settings,
  User,
  LogOut,
  Menu,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const routes = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Orders",
      icon: <FileText className="h-5 w-5" />,
      href: "/orders",
      active: pathname === "/orders",
    },
    {
      label: "Bids",
      icon: <FileText className="h-5 w-5" />,
      href: "/dashboard/bids",
      active: pathname === "/dashboard/bids",
    },
    {
      label: "Messages",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/messages",
      active: pathname === "/messages",
    },
    {
      label: "My Gigs",
      icon: <Package className="h-5 w-5" />,
      href: "/gigs",
      active: pathname === "/gigs",
    },
    {
      label: "Earnings",
      icon: <CreditCard className="h-5 w-5" />,
      href: "/earnings",
      active: pathname === "/earnings",
    },
    {
      label: "Profile",
      icon: <User className="h-5 w-5" />,
      href: "/profile",
      active: pathname === "/profile",
    },
    {
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/settings",
      active: pathname === "/settings",
    },
  ]

  const onClose = () => setIsOpen(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex flex-col w-64 border-r bg-card">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-xl">vrajitor</span>
          </Link>
        </div>
        <div className="flex-1 px-3 py-2">
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  route.active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="flex md:hidden items-center h-16 px-4 border-b shrink-0 bg-card">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="p-6 border-b">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <span className="text-xl">vrajitor</span>
              </Link>
            </div>
            <div className="flex-1 px-3 py-2">
              <div className="space-y-1">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      route.active
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {route.icon}
                    {route.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="p-4 border-t">
              <Button variant="outline" className="w-full justify-start gap-2">
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex-1 flex justify-center">
          <Link href="/" className="font-semibold">
            vrajitor
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center h-16 px-6 border-b md:justify-end">
          <div className="md:hidden">
            <span className="font-medium">Dashboard</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" size="sm" asChild>
              <Link href="/">View Marketplace</Link>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-6xl p-4 md:p-6 w-full">{children}</div>
        </main>
      </div>
    </div>
  )
}
