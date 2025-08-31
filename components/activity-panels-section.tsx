import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Clock, TrendingUp, ArrowRight, Eye } from "lucide-react"

const weeklyStats = [
  { label: "Ideas Generated", value: "24", change: "+12%" },
  { label: "Consultations", value: "8", change: "+3%" },
  { label: "Content Created", value: "15", change: "+25%" },
]

const recentIdeas = [
  {
    title: "5 SaaS Growth Metrics That Actually Matter",
    type: "Expert Chat",
    timestamp: "2 hours ago",
    status: "draft",
  },
  {
    title: "Why Your Content Strategy Needs a Personal Touch",
    type: "Trending Topics",
    timestamp: "1 day ago",
    status: "published",
  },
  {
    title: "Leadership Lessons from Remote Team Management",
    type: "Voice Session",
    timestamp: "2 days ago",
    status: "scheduled",
  },
]

const trendingTopics = [
  { topic: "AI in Content Marketing", engagement: "High", industry: "Marketing" },
  { topic: "Remote Leadership Strategies", engagement: "Medium", industry: "Leadership" },
  { topic: "SaaS Customer Retention", engagement: "High", industry: "SaaS" },
  { topic: "Personal Branding for Executives", engagement: "Medium", industry: "Business" },
]

export function ActivityPanelsSection() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Activity Overview</h2>
        <p className="text-muted-foreground">Track your progress and discover what's trending in your industry.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* This Week Stats */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">This Week</CardTitle>
            </div>
            <CardDescription>Your content creation activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {weeklyStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
              <a href="/analytics">
                View Detailed Analytics
                <ArrowRight className="ml-2 h-3 w-3" />
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Ideas */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Recent Ideas</CardTitle>
            </div>
            <CardDescription>Continue working on saved ideas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {recentIdeas.map((idea, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight line-clamp-2">{idea.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {idea.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{idea.timestamp}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          idea.status === "published"
                            ? "bg-green-500"
                            : idea.status === "draft"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
              <a href="/library">
                View All Ideas
                <ArrowRight className="ml-2 h-3 w-3" />
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Trending Now */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Trending Now</CardTitle>
            </div>
            <CardDescription>Current industry topics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {trendingTopics.map((trend, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight">{trend.topic}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={trend.engagement === "High" ? "default" : "secondary"} className="text-xs">
                          {trend.engagement}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{trend.industry}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
              <a href="/tools/trending">
                Explore Trending Topics
                <ArrowRight className="ml-2 h-3 w-3" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
