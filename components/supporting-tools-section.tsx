import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, TrendingUp, Wrench } from "lucide-react"

const tools = [
  {
    id: "content-repurposer",
    title: "Content Repurposer",
    description:
      "Transform existing content into LinkedIn posts. Upload blogs, videos, or documents to extract key insights.",
    icon: RotateCcw,
    feature: "Multi-format support",
    href: "/tools/repurposer",
  },
  {
    id: "trending-topics",
    title: "Trending Topic Generator",
    description:
      "Discover what's trending in your industry right now. Get AI-curated topics with built-in relevance and engagement potential.",
    icon: TrendingUp,
    feature: "Updated hourly",
    href: "/tools/trending",
  },
  {
    id: "formula-workshop",
    title: "Formula Workshop",
    description:
      "Browse proven content formulas or create custom templates. Build reusable structures that match your style and goals.",
    icon: Wrench,
    feature: "50+ templates",
    href: "/tools/formulas",
  },
]

export function SupportingToolsSection() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Content Creation Tools</h2>
        <p className="text-muted-foreground">
          Powerful tools to help you generate, repurpose, and optimize your content ideas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Card
            key={tool.id}
            className="relative overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-1"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <tool.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg leading-tight">{tool.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-sm leading-relaxed">{tool.description}</CardDescription>

              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {tool.feature}
                </Badge>
              </div>

              <Button
                variant="outline"
                className="w-full hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
                asChild
              >
                <a href={tool.href}>Get Started</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
