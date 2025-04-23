"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchFeaturedJobs } from "@/lib/api"
import type { JobListing } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { MapPin } from "lucide-react"

export function FeaturedJobs() {
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const featuredJobs = await fetchFeaturedJobs()
        setJobs(featuredJobs)
      } catch (error) {
        console.error("Failed to fetch featured jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="p-4 flex justify-between">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-9 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
      {jobs.map((job) => (
        <Card key={job._id} className="overflow-hidden">
          <CardHeader className="p-4">
            <CardTitle className="line-clamp-1">{job.title}</CardTitle>
            <div className="text-sm text-muted-foreground">{job.company}</div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <MapPin className="mr-1 h-3 w-3" />
              {job.location}
            </div>
            <p className="line-clamp-2 text-sm mb-2">{job.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary">{job.type}</Badge>
              <Badge variant="outline">
                Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="p-4 flex justify-between">
            <div className="text-sm text-muted-foreground">Deadline: {new Date(job.deadline).toLocaleDateString()}</div>
            <Button asChild size="sm">
              <Link href={`/jobs/${job._id}`}>View</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
