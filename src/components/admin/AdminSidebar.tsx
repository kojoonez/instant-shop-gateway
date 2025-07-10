import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  Store,
  TrendingUp,
  Bell
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

const navigationItems = [
  { 
    title: "Dashboard", 
    url: "/admin", 
    icon: BarChart3,
    exact: true
  },
  { 
    title: "Products", 
    url: "/admin/products", 
    icon: Package,
    badge: "24"
  },
  { 
    title: "Orders", 
    url: "/admin/orders", 
    icon: ShoppingCart,
    badge: "12"
  },
  { 
    title: "Users", 
    url: "/admin/users", 
    icon: Users 
  },
  { 
    title: "Analytics", 
    url: "/admin/analytics", 
    icon: TrendingUp 
  },
]

const secondaryItems = [
  { 
    title: "Settings", 
    url: "/admin/settings", 
    icon: Settings 
  },
]

export function AdminSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return currentPath === path
    }
    return currentPath.startsWith(path)
  }

  const getNavClass = (path: string, exact = false) => {
    const active = isActive(path, exact)
    return active 
      ? "bg-primary/10 text-primary border-r-2 border-primary font-medium" 
      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
  }

  return (
    <Sidebar className={state === "collapsed" ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-card border-r">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Store className="w-4 h-4 text-primary-foreground" />
            </div>
            {state !== "collapsed" && (
              <div>
                <h2 className="font-semibold text-sm">CraveTray Admin</h2>
                <p className="text-xs text-muted-foreground">Management Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={state === "collapsed" ? "sr-only" : ""}>
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.exact}
                      className={getNavClass(item.url, item.exact)}
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && (
                        <>
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary Navigation */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className={state === "collapsed" ? "sr-only" : ""}>
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={getNavClass(item.url)}
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Notification Bell */}
        {state !== "collapsed" && (
          <div className="p-4 border-t mt-auto">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
              <div className="relative">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </div>
              <div className="text-xs text-muted-foreground">
                3 new notifications
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}