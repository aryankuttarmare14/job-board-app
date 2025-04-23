"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { fetchJobSeekerApplications } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import type { JobApplication } from "@/lib/types"
import { format } from "date-fns"
import { Building, Calendar, ExternalLink } from "lucide-react"

export default function JobSeekerDashboardPage() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true)
        const applicationsData = await fetchJobSeekerApplications()
        setApplications(applicationsData)
      } catch (error) {
        console.error("Failed to fetch applications:", error)
        toast({
          title: "Error",
          description: "Failed to load your applications",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (user?.role === "jobseeker") {
      loadApplications()
    }
  }, [user, toast])

  const pendingApplications = applications.filter((app) => app.status === "pending")
  const reviewedApplications = applications.filter((app) => app.status !== "pending")

  if (user?.role !== "jobseeker") {
    return (
      <div className="container py-8 md:py-12">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>This dashboard is only available to job seekers.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/">Go to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
          <p className="text-muted-foreground">Track and manage your job applications</p>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingApplications.length})</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed ({reviewedApplications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-4">
            {loading ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="p-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 flex justify-between">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-9 w-20" />
                    </CardFooter>
                  </Card>
                ))
            ) : pendingApplications.length > 0 ? (
              pendingApplications.map((application) => (
                <Card key={application._id}>
                  <CardHeader className="p-4">
                    <CardTitle>{application.job.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Building className="mr-1 h-4 w-4" />
                      {application.job.company}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{application.job.type}</Badge>
                      <Badge variant="outline" className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        Applied: {format(new Date(application.createdAt), "MMM d, yyyy")}
                      </Badge>
                      <Badge>Pending Review</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between">
                    <div className="text-sm text-muted-foreground">Your application is being reviewed</div>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/jobs/${application.job._id}`}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Job
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No pending applications</CardTitle>
                  <CardDescription>You don't have any pending job applications at the moment.</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild>
                    <Link href="/jobs">Browse Jobs</Link>
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reviewed" className="space-y-4 mt-4">
            {loading ? (
              <Skeleton className="h-32 w-full" />
            ) : reviewedApplications.length > 0 ? (
              reviewedApplications.map((application) => (
                <Card key={application._id}>
                  <CardHeader className="p-4">
                    <CardTitle>{application.job.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Building className="mr-1 h-4 w-4" />
                      {application.job.company}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{application.job.type}</Badge>
                      <Badge variant="outline" className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        Applied: {format(new Date(application.createdAt), "MMM d, yyyy")}
                      </Badge>
                      <Badge variant={application.status === "accepted" ? "default" : "destructive"}>
                        {application.status === "accepted" ? "Accepted" : "Rejected"}
                      </Badge>
                    </div>
                    {application.feedback && (
                      <div className="mt-4 p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium">Feedback:</p>
                        <p className="text-sm">{application.feedback}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      Updated: {format(new Date(application.updatedAt), "MMM d, yyyy")}
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/jobs/${application.job._id}`}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Job
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No reviewed applications</CardTitle>
                  <CardDescription>None of your applications have been reviewed yet.</CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
