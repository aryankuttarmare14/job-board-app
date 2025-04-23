"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { Briefcase, Menu, User } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6" />
            <span className="font-bold inline-block">JobBoard</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/jobs"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/jobs" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Jobs
            </Link>
            <Link
              href="/companies"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/companies" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Companies
            </Link>
            {user?.role === "employer" && (
              <Link
                href="/dashboard/employer"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname.startsWith("/dashboard/employer") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Employer Dashboard
              </Link>
            )}
            {user?.role === "jobseeker" && (
              <Link
                href="/dashboard/jobseeker"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname.startsWith("/dashboard/jobseeker") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                My Applications
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/profile" className="w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={user.role === "employer" ? "/dashboard/employer" : "/dashboard/jobseeker"}
                    className="w-full"
                  >
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="hidden md:inline-flex">
                <Link href="/auth/register">Register</Link>
              </Button>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem asChild>
                <Link href="/jobs">Jobs</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/companies">Companies</Link>
              </DropdownMenuItem>
              {!user && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/register">Register</Link>
                  </DropdownMenuItem>
                </>
              )}
              {user?.role === "employer" && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/employer">Employer Dashboard</Link>
                </DropdownMenuItem>
              )}
              {user?.role === "jobseeker" && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/jobseeker">My Applications</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
