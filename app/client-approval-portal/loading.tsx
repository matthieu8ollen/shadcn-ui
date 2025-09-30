import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-8">
        <div>
          <Skeleton className="h-6 w-48 mb-4" />
          <Card>
            <CardContent className="p-4">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>

        <div>
          <Skeleton className="h-6 w-36 mb-4" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-full mb-2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
