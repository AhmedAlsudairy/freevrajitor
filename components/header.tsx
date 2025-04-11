"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Bell, MessageSquare, LogOut } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { LanguageSwitcher } from "./language-switcher"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "./auth/client-auth-provider"
import { RoleSwitcher } from "./role-switcher"

export default function Header() {
  const { user, session, supabase, isLoading } = useAuth()
  const isSignedIn = !!session
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    image: string;
    initials: string;
  } | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { t, direction } = useLanguage()

  useEffect(() => {
    const getProfile = async () => {
      if (!user) {
        setUserProfile(null)
        return
      }
      
      // Get user profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email, avatar_url')
        .eq('id', user.id)
        .single()
      
      setUserProfile({
        name: profile?.full_name || user.email?.split('@')[0] || 'User',
        email: profile?.email || user.email || '',
        image: profile?.avatar_url || '/placeholder.svg?height=32&width=32',
        initials: profile?.full_name 
          ? profile.full_name.split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase() 
          : user.email?.substring(0, 2).toUpperCase() || 'U'
      })
    }
    
    getProfile()
  }, [user, supabase])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl md:text-2xl">{t("app.name")}</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>{t("nav.categories")}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/categories/programming"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Programming & Tech</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Web, mobile & software development, IT & networking
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/categories/design"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Graphics & Design</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Logo design, web design, art & illustration
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/categories/writing"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Writing & Translation</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Content writing, translation, transcription
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/categories/photography"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Photography</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Portrait, wedding, commercial photography
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/explore" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>{t("nav.browse")}</NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/projects" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {t("nav.projects")}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/photographers" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {t("nav.photographers")}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/freelancers" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {t("nav.freelancers")}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {isSignedIn && <RoleSwitcher />}
          <LanguageSwitcher />
          <ThemeToggle />

          {isLoading ? (
            <Button variant="ghost" size="sm" disabled>
              Loading...
            </Button>
          ) : isSignedIn ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/messages">
                  <MessageSquare className="h-5 w-5" />
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userProfile?.image} alt={userProfile?.name} />
                      <AvatarFallback>{userProfile?.initials || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">{userProfile?.name}</p>
                    <p className="text-xs text-muted-foreground">{userProfile?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">{t("nav.dashboard")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-0">
                    <div className="w-full px-2 py-1.5">
                      <RoleSwitcher />
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">{t("nav.profile")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/bids">My Bids</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={async () => {
                      await supabase.auth.signOut()
                      router.push('/')
                      router.refresh()
                    }} 
                    className="cursor-pointer text-red-500"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button variant="ghost" asChild>
                <Link href="/sign-in">{t("nav.signin")}</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">{t("nav.join")}</Link>
              </Button>
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side={direction === "rtl" ? "left" : "right"}>
              <nav className="flex flex-col gap-4">
                <Link
                  href="/"
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === "/" ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {t("nav.home")}
                </Link>
                <Link
                  href="/categories"
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === "/categories" ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {t("nav.categories")}
                </Link>
                <Link
                  href="/explore"
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === "/explore" ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {t("nav.browse")}
                </Link>
                <Link
                  href="/photographers"
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === "/photographers" ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {t("nav.photographers")}
                </Link>
                <Link
                  href="/how-it-works"
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === "/how-it-works" ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  How It Works
                </Link>
                <Link
                  href="/freelancers"
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === "/freelancers" ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {t("nav.freelancers")}
                </Link>

                {!isSignedIn && (
                  <>
                    <Link
                      href="/sign-in"
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        pathname === "/sign-in" ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {t("nav.signin")}
                    </Link>
                    <Link
                      href="/sign-up"
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        pathname === "/sign-up" ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {t("nav.join")}
                    </Link>
                  </>
                )}

                {isSignedIn && (
                  <>
                    <Link
                      href="/dashboard"
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {t("nav.dashboard")}
                    </Link>
                    <div className="py-2">
                      <RoleSwitcher />
                    </div>
                    <Link
                      href="/profile"
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        pathname === "/profile" ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {t("nav.profile")}
                    </Link>
                    <Link
                      href="/messages"
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        pathname === "/messages" ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {t("nav.messages")}
                    </Link>
                    <button
                      onClick={async () => {
                        await supabase.auth.signOut()
                        router.push('/')
                        router.refresh()
                      }}
                      className="text-lg font-medium text-red-500 transition-colors hover:text-red-600 text-left flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      {t("nav.logout")}
                    </button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
