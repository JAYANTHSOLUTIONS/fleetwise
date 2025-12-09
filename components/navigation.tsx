"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LogOut, Settings, User, Gauge, Truck, Wrench, FileText } from "lucide-react"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()

  const handleLogout = () => {
    setIsLoggedIn(false)
    setShowUserMenu(false)
  }

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Gauge },
    { href: "/vehicles", label: "Vehicles", icon: Truck },
    { href: "/maintenance", label: "Maintenance", icon: Wrench },
    { href: "/reports", label: "Reports", icon: FileText },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-2 border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">FW</span>
            </div>
            <span className="font-bold text-lg text-gray-900 hidden sm:inline">FleetWise</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive(href) ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{label}</span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Admin</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-gray-200 rounded-lg shadow-lg p-2">
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                      <Settings size={16} />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/signin">
                  <button className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X size={24} className="text-gray-900" /> : <Menu size={24} className="text-gray-900" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t-2 border-gray-200 pt-4">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive(href) ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t-2 border-gray-200 flex gap-2">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              ) : (
                <>
                  <Link href="/signin" className="flex-1">
                    <button className="w-full px-4 py-2 text-gray-700 font-medium border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
