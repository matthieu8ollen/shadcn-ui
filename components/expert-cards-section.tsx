import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Mic, Users } from "lucide-react"

const experts = [
  {
    name: "Sarah",
    specialty: "SaaS Growth Expert",
    avatar: "/professional-woman-avatar.png",
    initials: "SG",
  },
  {
    name: "Marcus",
    specialty: "Content Strategist",
    avatar: "/professional-man-avatar.png",
    initials: "MC",
  },
  {
    name: "David",
    specialty: "Leadership Coach",
    avatar: "/professional-coach-avatar.png",
    initials: "DL",
  },
]

export function ExpertCardsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Expert Chat Consultations */}
      <Card className="relative overflow-hidden border-2 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <Badge variant="secondary" className="text-xs">
              Premium
            </Badge>
          </div>
          <CardTitle className="text-xl">Expert Chat Consultations</CardTitle>
          <CardDescription>
            Get personalized advice through text-based consultations with industry specialists
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Available Experts:</p>
            <div className="flex flex-col gap-2">
              {experts.map((expert) => (
                <div key={expert.name} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={expert.avatar || "/placeholder.svg"} alt={expert.name} />
                    <AvatarFallback className="text-xs">{expert.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{expert.name}</p>
                    <p className="text-xs text-muted-foreground">{expert.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button className="w-full" size="lg">
            Start Chat Consultation
          </Button>
        </CardContent>
      </Card>

      {/* Expert Voice Strategy Sessions */}
      <Card className="relative overflow-hidden border-2 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            <Badge variant="secondary" className="text-xs">
              Premium
            </Badge>
          </div>
          <CardTitle className="text-xl">Expert Voice Strategy Sessions</CardTitle>
          <CardDescription>Interactive voice conversations with the same expert specialists</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Available Experts:</p>
            <div className="flex flex-col gap-2">
              {experts.map((expert) => (
                <div key={expert.name} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={expert.avatar || "/placeholder.svg"} alt={expert.name} />
                    <AvatarFallback className="text-xs">{expert.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{expert.name}</p>
                    <p className="text-xs text-muted-foreground">{expert.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>3 sessions remaining this month</span>
          </div>
          <Button className="w-full" size="lg">
            Start Voice Session
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
