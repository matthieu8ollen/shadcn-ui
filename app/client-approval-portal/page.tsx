"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  CalendarIcon,
  Grid3X3,
  Filter,
  Eye,
  Check,
  X,
  MessageSquare,
  Upload,
  ImageIcon,
  Video,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react"

const mockDrafts = [
  {
    id: 1,
    title: "Celebrating Our Team's Success at Effie Awards Netherlands 🏆",
    funnelStage: "Awareness",
    keyTakeaways: [
      "Proud to share our team's recognition at the prestigious Effie Awards Netherlands",
      "Behind every award is a team that believes in creative excellence and strategic thinking",
      "Grateful for the opportunity to work with such talented individuals who push boundaries daily",
    ],
    scheduledDate: "2025-09-29", // Monday
    status: "approved",
    content:
      "What an incredible evening at the Effie Awards Netherlands! 🏆\n\nSeeing our team recognized for their outstanding work in creative strategy and execution fills me with immense pride. This award isn't just about the campaign - it's about the countless hours of collaboration, the bold ideas that seemed impossible at first, and the unwavering commitment to excellence that defines our culture.\n\nBehind every successful campaign is a team that dares to think differently. Tonight, we celebrate not just the recognition, but the journey that got us here.\n\nTo my amazing colleagues: your creativity, dedication, and passion continue to inspire me every day. Here's to many more moments like these! 🙌\n\n#EffieAwards #TeamWork #CreativeExcellence #ProudMoment #Netherlands",
    mediaAttached: true,
    mediaType: "image",
    mediaUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1758781418129-UaaR8Sn7AKK4MDbAjSBQFRCrlckzI1.jpeg",
  },
  {
    id: 2,
    title: "The Future of Quality Assurance in Digital Transformation",
    funnelStage: "Consideration",
    keyTakeaways: [
      "Quality assurance is evolving beyond traditional testing into strategic business enablement",
      "AI and automation are reshaping how we approach quality in digital products",
      "The human element remains crucial in defining what 'quality' truly means for users",
    ],
    scheduledDate: "2025-09-30", // Tuesday
    status: "pending",
    content:
      "Quality assurance isn't just about finding bugs anymore - it's about ensuring digital experiences that truly serve people. 🎯\n\nAs we accelerate digital transformation across industries, I've been reflecting on how QA has evolved from a final checkpoint to a strategic partner throughout the entire product lifecycle.\n\nThe integration of AI and automation tools has revolutionized our testing capabilities, but here's what I find most exciting: the human insight that defines what quality actually means for real users in real situations.\n\nWhen we combine technological precision with human empathy, we create digital products that don't just work - they work beautifully for the people who need them most.\n\nWhat's your experience with evolving QA practices? I'd love to hear your thoughts! 💭\n\n#QualityAssurance #DigitalTransformation #UserExperience #TechInnovation #ProductDevelopment",
    mediaAttached: true,
    mediaType: "image",
    mediaUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1750687434162-wy6V7HmyE2X45AuPe4WPppSBZ830Gw.jpeg",
  },
  {
    id: 3,
    title: "Building Authentic Connections: Lessons from Cannes Lions",
    funnelStage: "Decision",
    keyTakeaways: [
      "Authentic networking happens when you focus on giving value rather than getting something",
      "The most meaningful connections often come from unexpected conversations",
      "Diversity of perspectives drives the most innovative creative solutions",
    ],
    scheduledDate: "2025-10-01", // Wednesday
    status: "rejected",
    content:
      "Sometimes the most valuable conversations happen in the most unexpected places. ☀️\n\nAt Cannes Lions this year, I found myself in deep discussions about creative strategy not in the conference halls, but during coffee breaks, walking between venues, and yes - even waiting in line for lunch.\n\nThese spontaneous moments reminded me that authentic networking isn't about collecting business cards or LinkedIn connections. It's about genuine curiosity, shared challenges, and the magic that happens when diverse perspectives collide.\n\nOne conversation with a creative director from Brazil completely shifted my thinking about cultural authenticity in global campaigns. Another chat with a data scientist from Sweden opened my eyes to new possibilities in personalization.\n\nThe lesson? Stay curious, stay open, and remember that the person next to you might just have the insight that transforms your next project.\n\nWhat's the most unexpected place you've had a game-changing professional conversation? 🤔\n\n#CannesLions #Networking #CreativeStrategy #Diversity #Innovation #GlobalPerspectives",
    mediaAttached: true,
    mediaType: "image",
    mediaUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1752224602530-WPiPSTca3yey7CQofy9YrxdaAL1j65.jpeg",
  },
  {
    id: 4,
    title: "The Power of Team Collaboration in Remote Work Era",
    funnelStage: "Decision",
    keyTakeaways: [
      "Remote work has redefined how we build and maintain team culture",
      "Intentional collaboration requires new tools and mindsets",
      "The strongest teams blend digital efficiency with human connection",
    ],
    scheduledDate: "2025-10-02", // Thursday
    status: "approved",
    content:
      "This photo captures something special - the energy of a team that truly collaborates, not just coordinates. 💪\n\nIn our remote-first world, I've learned that the strongest teams don't just happen. They're intentionally built through shared experiences, open communication, and a culture that celebrates both individual strengths and collective achievements.\n\nWhat strikes me most about high-performing teams is their ability to blend digital efficiency with genuine human connection. They use technology to enhance collaboration, not replace the human elements that make teamwork truly powerful.\n\nThe best meetings aren't just about status updates - they're about problem-solving together, challenging each other's thinking, and creating something bigger than what any individual could achieve alone.\n\nTo my incredible team: thank you for showing me every day what's possible when talented people choose to work together with purpose and passion. 🙌\n\n#TeamWork #RemoteWork #Collaboration #Leadership #Culture #DigitalTransformation",
    mediaAttached: true,
    mediaType: "image",
    mediaUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1758889990427-yULNSUwoz49gu25lrRwsKvEvmCCVIN.jpeg",
  },
  {
    id: 5,
    title: "Embracing the Future of Work: Insights from Our Strategy Session",
    funnelStage: "Awareness",
    keyTakeaways: [
      "The future of work is being shaped by intentional choices we make today",
      "Hybrid models require new approaches to leadership and team dynamics",
      "Success metrics are evolving beyond traditional productivity measures",
    ],
    scheduledDate: "2025-10-03", // Friday
    status: "pending",
    content:
      "Yesterday's strategy session reminded me why I love what we do. 🚀\n\nBringing together brilliant minds from different disciplines, backgrounds, and perspectives always leads to those 'aha!' moments that reshape how we think about challenges.\n\nWe spent hours diving deep into the future of work - not just the tools and technologies, but the human elements that make work meaningful. How do we maintain culture in hybrid environments? How do we measure success when traditional metrics don't capture the full picture?\n\nThe conversations were rich, sometimes challenging, but always grounded in our shared commitment to creating workplaces where people can do their best work while living their best lives.\n\nOne insight that stuck with me: the companies that will thrive aren't just adapting to change - they're actively shaping what the future of work looks like for their people and their industries.\n\nWhat's your vision for the future of work? I'd love to continue this conversation! 💭\n\n#FutureOfWork #Strategy #Leadership #HybridWork #Innovation #TeamDynamics",
    mediaAttached: true,
    mediaType: "image",
    mediaUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1758781418235-5HhGuJZmzCDsSYf4qK1qZSV144M0Zg.jpeg",
  },
  {
    id: 6,
    title: "Finding Focus in a Distracted World: My Morning Routine",
    funnelStage: "Awareness",
    keyTakeaways: [
      "Deep work requires intentional boundaries and focused environments",
      "Morning routines set the tone for sustained productivity throughout the day",
      "The best ideas often come during moments of quiet reflection",
    ],
    scheduledDate: "2025-10-02", // Thursday - Multiple posts for this day
    status: "pending",
    content:
      "5:30 AM. Coffee brewing. World still quiet. This is where the magic happens. ☕\n\nIn our always-on world, I've discovered that the early morning hours are pure gold for deep thinking and strategic work. No notifications, no meetings, no distractions - just me, my thoughts, and the problems I'm passionate about solving.\n\nThis isn't about productivity hacking or grinding harder. It's about creating space for the kind of thinking that gets lost in the noise of a busy day. The strategic insights, the creative connections, the solutions that seem obvious in hindsight but require quiet focus to discover.\n\nMy morning routine is simple: coffee, journal, and 90 minutes of uninterrupted work on whatever matters most. Some days it's strategy development, other days it's creative problem-solving, sometimes it's just processing and planning.\n\nThe consistency has transformed not just my productivity, but my clarity and decision-making throughout the day.\n\nWhat does your ideal focused work environment look like? 🤔\n\n#DeepWork #MorningRoutine #Productivity #Focus #Leadership #WorkLifeBalance",
    mediaAttached: true,
    mediaType: "image",
    mediaUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1752563597041-XX6ClL16Jnj44OBCY8yvUw89quQMhU.jpeg",
  },
  {
    id: 7,
    title: "Celebrating Friendship and Professional Growth Together",
    funnelStage: "Consideration",
    keyTakeaways: [
      "The best professional relationships often grow into meaningful friendships",
      "Celebrating wins together strengthens both personal and professional bonds",
      "Diverse networks lead to richer perspectives and better outcomes",
    ],
    scheduledDate: "2025-10-02", // Thursday - Multiple posts for this day
    status: "rejected",
    content:
      "Some of the best professional relationships start with genuine friendship. 🌟\n\nThis photo captures a moment I treasure - celebrating not just professional achievements, but the journey we've shared together. In a world that often separates 'work' from 'life,' I've found that the most fulfilling career experiences happen when you're surrounded by people you genuinely care about.\n\nThese friendships have shaped my perspective, challenged my thinking, and supported me through both victories and setbacks. They've taught me that success isn't just about individual achievement - it's about lifting each other up and celebrating together.\n\nWhen you work with people you respect and enjoy being around, every project becomes more meaningful, every challenge more manageable, and every success more worth celebrating.\n\nTo my incredible friends and colleagues: thank you for making this journey so much richer. Here's to many more adventures together! 🥂\n\n#Friendship #ProfessionalGrowth #TeamWork #Celebration #Gratitude #WorkFamily",
    mediaAttached: true,
    mediaType: "image",
    mediaUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1752224603624-rcymKKoSvcCZNAnAAE6PBuxzbVw5Bh.jpeg",
  },
  {
    id: 8,
    title: "Weekend Reflection: Lessons from Q3 and Looking Ahead",
    funnelStage: "Retention",
    keyTakeaways: [
      "Regular reflection helps identify patterns and opportunities for growth",
      "Q3 taught us the importance of adaptability in uncertain times",
      "Setting clear intentions for Q4 while remaining flexible to change",
    ],
    scheduledDate: "2025-09-28", // Sunday
    status: "approved",
    content:
      "As we wrap up Q3, I'm taking time to reflect on the lessons that have shaped our journey this quarter. 📊\n\nThe biggest insight? Adaptability isn't just a nice-to-have skill - it's become the cornerstone of sustainable success. The projects that thrived were those where we stayed curious, remained flexible, and weren't afraid to pivot when new information emerged.\n\nWhat worked: Deeper client partnerships, cross-functional collaboration, and investing in our team's continuous learning.\n\nWhat challenged us: Rapid market changes, evolving client expectations, and balancing innovation with execution.\n\nWhat we're changing: More structured experimentation, clearer communication rhythms, and dedicated time for strategic thinking.\n\nAs we head into Q4, I'm energized by the opportunities ahead. The foundation we've built this year positions us perfectly for the challenges and possibilities that lie ahead.\n\nTo everyone who's been part of this journey: thank you for your dedication, creativity, and resilience. Let's make Q4 our strongest quarter yet! 💪\n\n#QuarterlyReflection #Leadership #Growth #Strategy #TeamWork #Q4Goals",
    mediaAttached: false,
    mediaType: null,
  },
  {
    id: 9,
    title: "Understanding Gen Z: Insights from the Next Generation of Consumers",
    funnelStage: "Awareness",
    keyTakeaways: [
      "Gen Z values authenticity over perfection in brand communications",
      "Social responsibility isn't optional - it's expected and scrutinized",
      "Digital-native doesn't mean they don't value human connection",
    ],
    scheduledDate: "2025-10-01", // Wednesday - Multiple posts for this day
    status: "pending",
    content:
      "This generation is rewriting the rules of consumer behavior, and we need to pay attention. 👀\n\nGen Z isn't just younger millennials - they're fundamentally different in how they discover, evaluate, and engage with brands. They've grown up in a world where information is instant, authenticity is paramount, and social impact is non-negotiable.\n\nWhat I find most fascinating: they're incredibly discerning despite (or perhaps because of) being digital natives. They can spot inauthentic marketing from miles away, and they're not afraid to call it out publicly.\n\nBut here's what many brands miss: behind the digital-first behavior is a deep desire for genuine human connection and meaningful experiences. They want brands that stand for something, that contribute positively to the world, and that treat them as intelligent individuals rather than demographic targets.\n\nThe brands that succeed with Gen Z don't just market to them - they invite them into conversations, value their perspectives, and create experiences that align with their values.\n\nWhat's your experience working with or marketing to Gen Z? I'd love to hear your insights! 💭\n\n#GenZ #ConsumerBehavior #Marketing #Authenticity #DigitalNatives #BrandStrategy",
    mediaAttached: true,
    mediaType: "image",
    mediaUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1746085927948-EVLqVV74HSVxCSMeE5xrz6mDJ1mGD9.jpeg",
  },
  {
    id: 10,
    title: "Summer Team Building: The Power of Shared Experiences",
    funnelStage: "Awareness",
    keyTakeaways: [
      "Shared experiences outside the office strengthen professional relationships",
      "Team building works best when it feels natural and enjoyable",
      "The strongest teams know how to work hard and celebrate together",
    ],
    scheduledDate: "2025-10-04", // Saturday
    status: "approved",
    content:
      "Sometimes the best team building happens when you're not trying to 'team build.' 🌞\n\nThis summer moment captures what I love most about our team culture - the ability to genuinely enjoy each other's company, whether we're tackling complex projects or simply sharing good food and laughter.\n\nThese informal moments are where real connections form. Where we learn about each other's perspectives, share stories that help us understand what motivates each person, and build the trust that makes our professional collaboration so effective.\n\nI've learned that the strongest teams aren't just groups of talented individuals - they're communities of people who care about each other's success and well-being.\n\nWhen you create space for authentic relationships to develop, everything else gets better: communication improves, creativity flows more freely, and challenges become opportunities to support each other.\n\nTo my amazing team: thank you for bringing your whole selves to work and for making every day more enjoyable. Here's to many more moments like these! 🙌\n\n#TeamBuilding #Culture #Relationships #Summer #WorkFamily #Gratitude",
    mediaAttached: true,
    mediaType: "image",
    mediaUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1752224604056-xaVgvsM1zJ78WXBlOuvRsXQKZjN2oP.jpeg",
  },
]

const mockApprovedPosts = [
  {
    id: 11,
    title: "Sunday Strategy Session: Planning Your Week",
    scheduledDate: "2025-09-28",
    status: "approved",
    publishTime: "08:00 AM",
  },
  {
    id: 12,
    title: "Tuesday Tips: Email Marketing Best Practices",
    scheduledDate: "2025-09-30",
    status: "approved",
    publishTime: "02:00 PM",
  },
]

const funnelStageColors = {
  Awareness: "bg-blue-100 text-blue-800 border-blue-200",
  Consideration: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Decision: "bg-green-100 text-green-800 border-green-200",
  Retention: "bg-purple-100 text-purple-800 border-purple-200",
}

const statusColors = {
  pending: "bg-orange-100 text-orange-800 border-orange-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  conflict: "bg-red-100 text-red-800 border-red-200",
  revision: "bg-blue-100 text-blue-800 border-blue-200",
}

export default function ClientApprovalPortal() {
  const [viewMode, setViewMode] = useState<"calendar" | "grid">("grid")
  const [gridTab, setGridTab] = useState<"pending" | "approved" | "needs-review">("pending")
  const [selectedDraft, setSelectedDraft] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [reviewMode, setReviewMode] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<string[]>([])
  const [comments, setComments] = useState("")
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [highlightedComments, setHighlightedComments] = useState<
    Array<{
      id: string
      text: string
      comment: string
      startIndex: number
      endIndex: number
    }>
  >([])
  const [showCommentButton, setShowCommentButton] = useState(false)
  const [commentButtonPosition, setCommentButtonPosition] = useState({ x: 0, y: 0 })
  const [selectedText, setSelectedText] = useState("")
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null)

  const getWeeklyCalendarData = () => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + currentWeekOffset * 7) // Start from Sunday + offset

    const weekDays = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)

      const dateString = date.toISOString().split("T")[0]
      const dayDrafts = mockDrafts.filter((draft) => draft.scheduledDate === dateString)

      weekDays.push({
        date: date,
        dateString: dateString,
        dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString("en-US", { month: "long" }),
        drafts: dayDrafts,
        hasContent: dayDrafts.length > 0,
      })
    }

    return weekDays
  }

  const handleApprove = (draftId: number) => {
    console.log("Approving draft:", draftId)
    // Handle approval logic
  }

  const handleRevision = (draftId: number) => {
    console.log("Requesting revision for draft:", draftId)
    // Handle revision request logic
  }

  const handleReject = (draftId: number) => {
    console.log("Rejecting draft:", draftId)
    // Handle rejection logic
  }

  const handleRequestContent = (dateString: string) => {
    console.log("Requesting content for:", dateString)
    // Handle content request logic
  }

  const goToPreviousWeek = () => {
    setCurrentWeekOffset(currentWeekOffset - 1)
  }

  const goToNextWeek = () => {
    setCurrentWeekOffset(currentWeekOffset + 1)
  }

  const getCurrentWeekLabel = () => {
    const weekData = getWeeklyCalendarData()
    const startDate = weekData[0].date
    const endDate = weekData[6].date

    if (startDate.getMonth() === endDate.getMonth()) {
      return `${startDate.getDate()}-${endDate.getDate()} ${startDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
    } else {
      return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    }
  }

  const getPendingPosts = () => mockDrafts.filter((draft) => draft.status === "pending")
  const getApprovedPosts = () => mockDrafts.filter((draft) => draft.status === "approved")
  const getNeedsReviewPosts = () => mockDrafts.filter((draft) => draft.status === "rejected")

  const getCurrentGridData = () => {
    switch (gridTab) {
      case "pending":
        return getPendingPosts()
      case "approved":
        return getApprovedPosts()
      case "needs-review":
        return getNeedsReviewPosts()
      default:
        return getPendingPosts()
    }
  }

  const getGridTabTitle = () => {
    switch (gridTab) {
      case "pending":
        return "Pending Approval"
      case "approved":
        return "Approved Posts"
      case "needs-review":
        return "Needs Review"
      default:
        return "Pending Approval"
    }
  }

  const mediaLibrary = [
    {
      id: 1,
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1752224603624-rcymKKoSvcCZNAnAAE6PBuxzbVw5Bh.jpeg",
      name: "Team Networking",
      type: "image",
    },
    {
      id: 2,
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1758781418129-UaaR8Sn7AKK4MDbAjSBQFRCrlckzI1.jpeg",
      name: "Effie Awards Team",
      type: "image",
    },
    {
      id: 3,
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1758889990427-yULNSUwoz49gu25lrRwsKvEvmCCVIN.jpeg",
      name: "Accenture Song Office",
      type: "image",
    },
    {
      id: 4,
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1752563597041-XX6ClL16Jnj44OBCY8yvUw89quQMhU.jpeg",
      name: "Remote Work Setup",
      type: "image",
    },
    {
      id: 5,
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1758781418235-5HhGuJZmzCDsSYf4qK1qZSV144M0Zg.jpeg",
      name: "Conference Networking",
      type: "image",
    },
    {
      id: 6,
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1750687434162-wy6V7HmyE2X45AuPe4WPppSBZ830Gw.jpeg",
      name: "Quality Assurance",
      type: "image",
    },
    {
      id: 7,
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1752224602530-WPiPSTca3yey7CQofy9YrxdaAL1j65.jpeg",
      name: "Team Meeting",
      type: "image",
    },
    {
      id: 8,
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1746085927948-EVLqVV74HSVxCSMeE5xrz6mDJ1mGD9.jpeg",
      name: "Gen Z Perspective",
      type: "image",
    },
    {
      id: 9,
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1752224604056-xaVgvsM1zJ78WXBlOuvRsXQKZjN2oP.jpeg",
      name: "Summer Team Building",
      type: "image",
    },
  ]

  const toggleMediaSelection = (mediaId: string) => {
    setSelectedMedia((prev) => (prev.includes(mediaId) ? prev.filter((id) => id !== mediaId) : [...prev, mediaId]))
  }

  const getCurrentAttachments = () => {
    return mediaLibrary.filter((media) => selectedMedia.includes(media.id.toString()))
  }

  const handleUploadMedia = () => {
    // Create a file input element
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*,video/*"
    input.multiple = true

    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        // Handle file upload logic here
        console.log("[v0] Files selected for upload:", files)
        // In a real app, you would upload these files to your storage service
        // and add them to the media library
        alert(`Selected ${files.length} file(s) for upload. Upload functionality would be implemented here.`)
      }
    }

    input.click()
  }

  const handleTextSelection = (event: React.MouseEvent) => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim().length > 0) {
      const selectedText = selection.toString().trim()
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      // Calculate position relative to the viewport
      setCommentButtonPosition({
        x: rect.right + 10,
        y: rect.top + window.scrollY,
      })

      setSelectedText(selectedText)
      // Store the start and end offsets relative to the content div
      // This is a simplification; a more robust solution would involve DOM traversal
      // to get accurate character indices within the entire content.
      // For this example, we'll assume the selection is within the current render.
      setSelectedRange({
        start: range.startOffset,
        end: range.endOffset,
      })
      setShowCommentButton(true)
    } else {
      setShowCommentButton(false)
    }
  }

  const handleCreateComment = () => {
    if (selectedText && selectedRange) {
      const newComment = {
        id: Date.now().toString(),
        text: selectedText,
        comment: "",
        startIndex: selectedRange.start,
        endIndex: selectedRange.end,
      }

      setHighlightedComments((prev) => [...prev, newComment])
      setShowCommentButton(false)
      setSelectedText("")
      setSelectedRange(null)

      // Clear selection
      window.getSelection()?.removeAllRanges()
    }
  }

  const updateCommentText = (commentId: string, newComment: string) => {
    setHighlightedComments((prev) =>
      prev.map((comment) => (comment.id === commentId ? { ...comment, comment: newComment } : comment)),
    )
  }

  const deleteComment = (commentId: string) => {
    setHighlightedComments((prev) => prev.filter((comment) => comment.id !== commentId))
  }

  const renderPostContentWithHighlights = (content: string) => {
    if (highlightedComments.length === 0) {
      return <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">{content}</div>
    }

    // Sort comments by start index to process them in order
    const sortedComments = [...highlightedComments].sort((a, b) => a.startIndex - b.startIndex)

    let lastIndex = 0
    const elements: React.ReactNode[] = []

    sortedComments.forEach((comment, index) => {
      // Add text before the highlight
      if (lastIndex < comment.startIndex) {
        elements.push(<span key={`text-${index}`}>{content.slice(lastIndex, comment.startIndex)}</span>)
      }

      // Add the highlighted text
      elements.push(
        <span
          key={`highlight-${comment.id}`}
          className="bg-yellow-200 border-b-2 border-yellow-400 cursor-pointer relative"
          title={`Comment: ${comment.comment || "No comment yet"}`}
        >
          {comment.text}
        </span>,
      )

      lastIndex = comment.endIndex
    })

    // Add remaining text
    if (lastIndex < content.length) {
      elements.push(<span key="text-end">{content.slice(lastIndex)}</span>)
    }

    return <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">{elements}</div>
  }

  if (reviewMode && selectedDraft) {
    return (
      <div className="min-h-screen bg-gray-50">
        {previewImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewImage(null)}
          >
            <div className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center">
              <img
                src={previewImage || "/placeholder.svg"}
                alt="Preview"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                variant="outline"
                className="absolute top-4 right-4 bg-white hover:bg-gray-100"
                onClick={() => setPreviewImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {showCommentButton && (
          <div
            className="fixed z-40 bg-white border border-gray-300 rounded-lg shadow-lg p-2"
            style={{
              left: commentButtonPosition.x,
              top: commentButtonPosition.y,
            }}
          >
            <Button size="sm" onClick={handleCreateComment} className="bg-blue-600 hover:bg-blue-700 text-white">
              <MessageSquare className="h-3 w-3 mr-1" />
              Add Comment
            </Button>
          </div>
        )}

        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Button variant="ghost" size="sm" onClick={() => setReviewMode(false)} className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Portal Dashboard
            </Button>
            <span>/</span>
            <span>{selectedDraft.scheduledDate}</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{selectedDraft.title}</span>
          </div>
        </div>

        {/* Split Panel Review Layout */}
        <div className="flex h-[calc(100vh-80px)]">
          {/* Left Panel - Post Content Review (60%) */}
          <div className="flex-1 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedDraft.title}</h1>
                <div className="flex items-center gap-3">
                  <Badge className={funnelStageColors[selectedDraft.funnelStage as keyof typeof funnelStageColors]}>
                    {selectedDraft.funnelStage}
                  </Badge>
                  <span className="text-sm text-gray-500">Scheduled: {selectedDraft.scheduledDate}</span>
                </div>
              </div>

              {/* Key Takeaways */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Key Takeaways</h3>
                <ul className="space-y-2">
                  {selectedDraft.keyTakeaways.map((takeaway: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Post Preview */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Post Content</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="select-text cursor-text" onMouseUp={handleTextSelection}>
                    {renderPostContentWithHighlights(selectedDraft.content)}
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    Character count: {selectedDraft.content.length} / 3000
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Review Comments</h3>

                {/* Highlighted Text Comments */}
                {highlightedComments.length > 0 && (
                  <div className="mb-4 space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Comments on highlighted text:</h4>
                    {highlightedComments.map((comment) => (
                      <div key={comment.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 mb-1">Referenced text:</div>
                            <div className="text-sm text-gray-700 bg-yellow-100 px-2 py-1 rounded italic">
                              "{comment.text}"
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteComment(comment.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Add your comment about this highlighted section..."
                          value={comment.comment}
                          onChange={(e) => updateCommentText(comment.id, e.target.value)}
                          className="mt-2 min-h-[80px] text-sm"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* General Comments */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">General comments:</h4>
                  <Textarea
                    placeholder="Add your general comments or revision requests..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Media & Actions (40%) */}
          <div className="w-2/5 bg-gray-50 overflow-y-auto">
            <div className="p-6">
              {/* Media Management */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Media Attachments</h3>

                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <ImageIcon className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">Current Attachments ({getCurrentAttachments().length})</span>
                    </div>
                    {getCurrentAttachments().length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {getCurrentAttachments().map((attachment) => (
                          <div key={attachment.id} className="relative">
                            <div className="bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={attachment.url || "/placeholder.svg"}
                                alt={attachment.name}
                                className="w-full h-20 object-cover"
                              />
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{attachment.name}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                        <span className="text-gray-500">No media selected</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Media Library</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {mediaLibrary.map((item) => (
                      <div
                        key={item.id}
                        className={`bg-white border-2 rounded-lg p-2 cursor-pointer hover:border-teal-300 transition-colors relative ${
                          selectedMedia.includes(item.id.toString())
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200"
                        }`}
                        onClick={() => toggleMediaSelection(item.id.toString())}
                      >
                        <div className="bg-gray-100 rounded h-20 overflow-hidden mb-2 relative">
                          <img
                            src={item.url || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            className="absolute top-1 right-1 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              setPreviewImage(item.url)
                            }}
                          >
                            <Eye className="h-3 w-3 text-gray-600" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-600">{item.name}</p>
                        {selectedMedia.includes(item.id.toString()) && (
                          <div className="absolute top-1 left-1 bg-green-500 rounded-full p-1">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upload New */}
                <div className="mt-4">
                  <Button variant="outline" className="w-full bg-transparent" onClick={handleUploadMedia}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Media
                  </Button>
                </div>
              </div>

              {/* Action Panel */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Actions</h3>

                <div className="space-y-3">
                  <Button
                    onClick={() => handleApprove(selectedDraft.id)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve Post
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleRevision(selectedDraft.id)}
                    className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Request Revision
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedDraft.id)}
                    className="w-full border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject Post
                  </Button>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Button variant="ghost" className="w-full">
                    Save Draft
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Content Approval Portal</h1>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src="/images/patritia-avatar.jpeg"
                alt="Patritia Pahladsingh"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="font-medium">@Patritia Pahladsingh</span>
                <span>•</span>
                <span>5 pending approvals • 2 scheduled this week</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("calendar")}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {viewMode === "grid" ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={gridTab === "pending" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGridTab("pending")}
                  className={gridTab === "pending" ? "bg-white shadow-sm text-gray-600" : ""}
                >
                  Pending ({getPendingPosts().length})
                </Button>
                <Button
                  variant={gridTab === "approved" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGridTab("approved")}
                  className={gridTab === "approved" ? "bg-white shadow-sm text-gray-600" : ""}
                >
                  Approved ({getApprovedPosts().length})
                </Button>
                <Button
                  variant={gridTab === "needs-review" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGridTab("needs-review")}
                  className={gridTab === "needs-review" ? "bg-white shadow-sm text-gray-600" : ""}
                >
                  Needs Review ({getNeedsReviewPosts().length})
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{getGridTabTitle()}</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {getCurrentGridData().map((draft) => (
                  <Card key={draft.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg leading-tight">{draft.title}</CardTitle>
                          {draft.status === "conflict" && (
                            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                          )}
                        </div>
                        <Badge className={funnelStageColors[draft.funnelStage as keyof typeof funnelStageColors]}>
                          {draft.funnelStage}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={statusColors[draft.status as keyof typeof statusColors]}>
                          {draft.status}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Key Takeaways */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Key Takeaways</h4>
                        <ul className="space-y-1">
                          {draft.keyTakeaways.slice(0, 2).map((takeaway, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="line-clamp-1">{takeaway}</span>
                            </li>
                          ))}
                          {draft.keyTakeaways.length > 2 && (
                            <li className="text-sm text-gray-500">+{draft.keyTakeaways.length - 2} more</li>
                          )}
                        </ul>
                      </div>

                      {/* Scheduled Date & Media */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{draft.scheduledDate}</span>
                        </div>
                        {draft.mediaAttached && (
                          <div className="flex items-center gap-1 text-gray-500">
                            {draft.mediaType === "image" ? (
                              <ImageIcon className="h-4 w-4" />
                            ) : (
                              <Video className="h-4 w-4" />
                            )}
                            <span className="text-xs">Media</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        {draft.status === "pending" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedDraft(draft)
                                setReviewMode(true)
                              }}
                              className="flex-1"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(draft.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedDraft(draft)
                              setReviewMode(true)
                            }}
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Weekly Content Schedule</h2>
                <span className="text-sm text-gray-500">All scheduled content</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">{getCurrentWeekLabel()}</span>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={goToPreviousWeek} className="h-8 w-8 p-0 bg-transparent">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToNextWeek} className="h-8 w-8 p-0 bg-transparent">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {getWeeklyCalendarData().map((day) => (
              <Card key={day.dateString} className="border border-gray-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {day.dayName} {day.dayNumber}
                        {day.dayNumber === 1 || day.dayNumber === 21 || day.dayNumber === 31
                          ? "st"
                          : day.dayNumber === 2 || day.dayNumber === 22
                            ? "nd"
                            : day.dayNumber === 3 || day.dayNumber === 23
                              ? "rd"
                              : "th"}{" "}
                        {day.month}
                      </h3>
                      <p className="text-sm text-gray-500">{day.dateString}</p>
                    </div>
                    {!day.hasContent && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRequestContent(day.dateString)}
                        className="flex items-center gap-2 text-teal-600 border-teal-200 hover:bg-teal-50"
                      >
                        <span className="text-lg">+</span>
                        Request Content
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {day.hasContent ? (
                    <div className="space-y-4">
                      {day.drafts.map((draft) => (
                        <div key={draft.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">{draft.title}</h4>
                              <p className="text-sm text-gray-600 line-clamp-2">{draft.content.split("\n")[0]}...</p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Badge className={statusColors[draft.status as keyof typeof statusColors]}>
                                {draft.status}
                              </Badge>
                              <Badge className={funnelStageColors[draft.funnelStage as keyof typeof funnelStageColors]}>
                                {draft.funnelStage}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>09:00 • LinkedIn</span>
                              </div>
                              {draft.mediaAttached && (
                                <div className="flex items-center gap-1">
                                  {draft.mediaType === "image" ? (
                                    <ImageIcon className="h-4 w-4" />
                                  ) : (
                                    <Video className="h-4 w-4" />
                                  )}
                                  <span>Media</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {draft.status === "pending" ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedDraft(draft)
                                      setReviewMode(true)
                                    }}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    Review
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleApprove(draft.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedDraft(draft)
                                    setReviewMode(true)
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Preview
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No content scheduled for this day</p>
                      <p className="text-sm">Click "Request Content" to add posts</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
