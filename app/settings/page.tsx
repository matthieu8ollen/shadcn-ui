"use client"

import { useState } from "react"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  User,
  Sparkles,
  Bell,
  CreditCard,
  Shield,
  Home,
  Linkedin,
  Download,
  Trash2,
  Save,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const settingsSections = [
  { id: "account", label: "Account", icon: User },
  { id: "content", label: "Content & AI", icon: Sparkles },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing & Plan", icon: CreditCard },
  { id: "privacy", label: "Privacy & Data", icon: Shield },
]

const contentPillars = [
  "Industry Trends",
  "SaaS Metrics",
  "Career Development",
  "Leadership Insights",
  "Product Strategy",
  "Team Management",
  "Financial Planning",
  "Market Analysis",
  "Customer Success",
  "Growth Strategies",
  "Innovation",
  "Digital Transformation",
]

const aiPersonas = [
  {
    id: "insightful-cfo",
    name: "Insightful CFO",
    description: "Data-driven financial perspective with strategic insights",
    tone: "Professional, analytical, forward-thinking",
  },
  {
    id: "bold-operator",
    name: "Bold Operator",
    description: "Action-oriented execution focus with practical solutions",
    tone: "Direct, confident, results-focused",
  },
  {
    id: "strategic-advisor",
    name: "Strategic Advisor",
    description: "High-level strategic thinking with industry expertise",
    tone: "Thoughtful, experienced, advisory",
  },
  {
    id: "data-driven-expert",
    name: "Data-Driven Expert",
    description: "Evidence-based insights with analytical depth",
    tone: "Precise, factual, research-oriented",
  },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("account")
  const [linkedinConnected, setLinkedinConnected] = useState(true)
  const [selectedPersona, setSelectedPersona] = useState("insightful-cfo")
  const [selectedPillars, setSelectedPillars] = useState(["Industry Trends", "SaaS Metrics", "Leadership Insights"])
  const [notifications, setNotifications] = useState({
    postPublished: true,
    queueEmpty: true,
    newSuggestions: false,
    weeklyReports: true,
    draftReminders: true,
    systemUpdates: false,
  })

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  const handlePillarToggle = (pillar: string) => {
    setSelectedPillars((prev) => (prev.includes(pillar) ? prev.filter((p) => p !== pillar) : [...prev, pillar]))
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNavigation />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-4">
            <h1 className="text-3xl font-medium tracking-tight text-balance font-sans text-emerald-800">Settings</h1>
            <p className="text-gray-600 text-pretty">Manage your account preferences and Writer Suite configuration</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation */}
          <div className="w-64 bg-white border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {settingsSections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-12",
                    activeSection === section.id && "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
                  )}
                  onClick={() => setActiveSection(section.id)}
                >
                  <section.icon className="h-5 w-5" />
                  {section.label}
                </Button>
              ))}
            </nav>
          </div>

          {/* Right Content */}
          <div className="flex-1 overflow-auto p-6">
            {activeSection === "account" && (
              <div className="space-y-6 max-w-2xl">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Update your personal and professional details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="John" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Smith" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john.smith@company.com" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Select defaultValue="cfo">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ceo">CEO</SelectItem>
                            <SelectItem value="cfo">CFO</SelectItem>
                            <SelectItem value="cmo">CMO</SelectItem>
                            <SelectItem value="vp">VP</SelectItem>
                            <SelectItem value="director">Director</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" defaultValue="TechCorp Inc." />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Linkedin className="h-5 w-5" />
                      LinkedIn Integration
                    </CardTitle>
                    <CardDescription>Connect your LinkedIn account for enhanced content creation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={linkedinConnected ? "default" : "secondary"}>
                          {linkedinConnected ? "Connected" : "Not Connected"}
                        </Badge>
                        {linkedinConnected && <span className="text-sm text-gray-600">john.smith@company.com</span>}
                      </div>
                      <Button
                        variant={linkedinConnected ? "outline" : "default"}
                        onClick={() => setLinkedinConnected(!linkedinConnected)}
                      >
                        {linkedinConnected ? "Disconnect" : "Connect LinkedIn"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>Professional Plan - $49/month</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Posts this month</span>
                        <span>23 / 50</span>
                      </div>
                      <Progress value={46} className="h-2" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Next billing: January 15, 2025</span>
                      <Button variant="outline">Upgrade Plan</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "content" && (
              <div className="space-y-6 max-w-4xl">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Writing Persona</CardTitle>
                    <CardDescription>Choose your AI writing style and tone</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {aiPersonas.map((persona) => (
                        <Card
                          key={persona.id}
                          className={cn(
                            "cursor-pointer transition-colors",
                            selectedPersona === persona.id && "ring-2 ring-emerald-500 bg-emerald-50",
                          )}
                          onClick={() => setSelectedPersona(persona.id)}
                        >
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{persona.name}</CardTitle>
                            <CardDescription className="text-sm">{persona.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs text-gray-500">{persona.tone}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Target Audience & Posting</CardTitle>
                    <CardDescription>Configure your audience and posting preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="audience">Target Audience</Label>
                        <Select defaultValue="executives">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="executives">C-Suite Executives</SelectItem>
                            <SelectItem value="managers">Middle Management</SelectItem>
                            <SelectItem value="professionals">Industry Professionals</SelectItem>
                            <SelectItem value="entrepreneurs">Entrepreneurs</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Select defaultValue="saas">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="saas">SaaS & Technology</SelectItem>
                            <SelectItem value="finance">Financial Services</SelectItem>
                            <SelectItem value="consulting">Consulting</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="frequency">Posting Frequency</Label>
                        <Select defaultValue="weekly">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="biweekly">Bi-weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Content Pillars</CardTitle>
                    <CardDescription>Select topics you want to create content about</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      {contentPillars.map((pillar) => (
                        <div key={pillar} className="flex items-center space-x-2">
                          <Checkbox
                            id={pillar}
                            checked={selectedPillars.includes(pillar)}
                            onCheckedChange={() => handlePillarToggle(pillar)}
                          />
                          <Label htmlFor={pillar} className="text-sm">
                            {pillar}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="customPillar">Add Custom Pillar</Label>
                      <div className="flex gap-2 mt-1">
                        <Input id="customPillar" placeholder="Enter custom topic..." />
                        <Button variant="outline">Add</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="space-y-6 max-w-2xl">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Notifications</CardTitle>
                    <CardDescription>Choose which email notifications you'd like to receive</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries({
                      postPublished: "Post published confirmations",
                      queueEmpty: "Publishing queue empty alerts",
                      newSuggestions: "New post suggestions available",
                      weeklyReports: "Weekly analytics reports",
                      draftReminders: "Draft post reminders",
                      systemUpdates: "System updates and maintenance",
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={key}>{label}</Label>
                        <Switch
                          id={key}
                          checked={notifications[key as keyof typeof notifications]}
                          onCheckedChange={(value) => handleNotificationChange(key, value)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>In-App Notifications</CardTitle>
                    <CardDescription>Configure browser and desktop notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="browserNotifications">Desktop notifications</Label>
                      <Switch id="browserNotifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="soundNotifications">Notification sounds</Label>
                      <Switch id="soundNotifications" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="doNotDisturb">Do not disturb mode</Label>
                      <Switch id="doNotDisturb" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "billing" && (
              <div className="space-y-6 max-w-2xl">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Subscription</CardTitle>
                    <CardDescription>Professional Plan - $49/month</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Next billing date</p>
                        <p className="text-sm text-gray-600">January 15, 2025</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Payment method</p>
                        <p className="text-sm text-gray-600">•••• •••• •••• 4242</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">Change Plan</Button>
                      <Button variant="outline">Update Payment</Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download Invoice
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Usage Analytics</CardTitle>
                    <CardDescription>Track your monthly usage and limits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Posts generated</span>
                        <span>23 / 50</span>
                      </div>
                      <Progress value={46} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>AI enhancements used</span>
                        <span>156 / 200</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Images generated</span>
                        <span>8 / 25</span>
                      </div>
                      <Progress value={32} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "privacy" && (
              <div className="space-y-6 max-w-2xl">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>Export and manage your data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Export all data</p>
                        <p className="text-sm text-gray-600">Download all your content, settings, and analytics</p>
                      </div>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Export content only</p>
                        <p className="text-sm text-gray-600">Download just your posts and drafts</p>
                      </div>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Danger Zone
                    </CardTitle>
                    <CardDescription>Irreversible actions that will permanently affect your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Alert className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Deleting your account will permanently remove all your data, including posts, drafts, and
                        analytics. This action cannot be undone.
                      </AlertDescription>
                    </Alert>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove all your
                            data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                            Yes, delete my account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
