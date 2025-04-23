"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { deleteJob, fetchEmployerJobs } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import type { JobListing } from "@/lib/types"
import { format } from "date-fns"
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react"

export default function EmployerDashboardPage() {
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true)
        const jobsData = await fetchEmployerJobs()
        setJobs(jobsData)
      } catch (error) {
        console.error("Failed to fetch jobs:", error)
        toast({
          title: "Error",
          description: "Failed to load your job listings",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (user?.role === "employer") {
      loadJobs()
    }
  }, [user, toast])

  const handleDeleteJob = async (jobId: string) => {
    try {
      await deleteJob(jobId)
      setJobs(jobs.filter((job) => job._id !== jobId))
      toast({
        title: "Job deleted",
        description: "The job listing has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the job listing",
        variant: "destructive",
      })
    }
  }

  const activeJobs = jobs.filter((job) => new Date(job.deadline) >= new Date())
  const expiredJobs = jobs.filter((job) => new Date(job.deadline) < new Date())

  if (user?.role !== "employer") {
    return (
      <div className="container py-8 md:py-12">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>This dashboard is only available to employers.</CardDescription>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employer Dashboard</h1>
            <p className="text-muted-foreground">Manage your job listings and view applications</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/employer/jobs/new">
              <Plus className="mr-2 h-4 w-4" />
              Post New Job
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Jobs ({activeJobs.length})</TabsTrigger>
            <TabsTrigger value="expired">Expired Jobs ({expiredJobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 mt-4">
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
            ) : activeJobs.length > 0 ? (
              activeJobs.map((job) => (
                <Card key={job._id}>
                  <CardHeader className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription>{job.location}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/employer/jobs/${job._id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteJob(job._id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{job.type}</Badge>
                      <Badge variant="outline">Posted: {format(new Date(job.createdAt), "MMM d, yyyy")}</Badge>
                      <Badge variant="outline">Deadline: {format(new Date(job.deadline), "MMM d, yyyy")}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between">
                    <div className="text-sm">{job.applications} applications received</div>
                    <Button asChild size="sm">
                      <Link href={`/dashboard/employer/jobs/${job._id}/applications`}>View Applications</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No active job listings</CardTitle>
                  <CardDescription>You don't have any active job listings at the moment.</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild>
                    <Link href="/dashboard/employer/jobs/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Post New Job
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="expired" className="space-y-4 mt-4">
            {loading ? (
              <Skeleton className="h-32 w-full" />
            ) : expiredJobs.length > 0 ? (
              expiredJobs.map((job) => (
                <Card key={job._id}>
                  <CardHeader className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription>{job.location}</CardDescription>
                      </div>
                      <Badge variant="outline" className="text-muted-foreground">
                        Expired
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{job.type}</Badge>
                      <Badge variant="outline">Posted: {format(new Date(job.createdAt), "MMM d, yyyy")}</Badge>
                      <Badge variant="outline">Expired: {format(new Date(job.deadline), "MMM d, yyyy")}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between">
                    <div className="text-sm">{job.applications} applications received</div>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/dashboard/employer/jobs/${job._id}/applications`}>View Applications</Link>
                      </Button>
                      <Button asChild size="sm">
                        <Link href={`/dashboard/employer/jobs/${job._id}/repost`}>Repost Job</Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No expired job listings</CardTitle>
                  <CardDescription>You don't have any expired job listings.</CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
