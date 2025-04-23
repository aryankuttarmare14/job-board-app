"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { fetchJobApplications, updateApplicationStatus } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import type { JobApplication } from "@/lib/types"
import { format } from "date-fns"
import { ArrowLeft, Download, FileText } from "lucide-react"

export default function JobApplicationsPage({ params }: { params: { id: string } }) {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState("")
  const [processingId, setProcessingId] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true)
        const applicationsData = await fetchJobApplications(params.id)
        setApplications(applicationsData)
      } catch (error) {
        console.error("Failed to fetch applications:", error)
        toast({
          title: "Error",
          description: "Failed to load applications",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (user?.role === "employer") {
      loadApplications()
    }
  }, [params.id, user, toast])

  const handleUpdateStatus = async (applicationId: string, status: "accepted" | "rejected") => {
    try {
      setProcessingId(applicationId)
      await updateApplicationStatus(applicationId, status, feedback)

      // Update local state
      setApplications(
        applications.map((app) =>
          app._id === applicationId ? { ...app, status, feedback, updatedAt: new Date().toISOString() } : app,
        ),
      )

      toast({
        title: `Application ${status}`,
        description: `The application has been ${status} successfully`,
      })

      setFeedback("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  if (user?.role !== "employer") {
    return (
      <div className="container py-8 md:py-12">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>This page is only available to employers.</CardDescription>
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

  const pendingApplications = applications.filter((app) => app.status === "pending")
  const reviewedApplications = applications.filter((app) => app.status !== "pending")

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/employer">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to dashboard</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Job Applications</h1>
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
                      <Skeleton className="h-32 w-full" />
                    </CardContent>
                    <CardFooter className="p-4 flex justify-between">
                      <Skeleton className="h-4 w-1/3" />
                      <div className="flex gap-2">
                        <Skeleton className="h-9 w-20" />
                        <Skeleton className="h-9 w-20" />
                      </div>
                    </CardFooter>
                  </Card>
                ))
            ) : pendingApplications.length > 0 ? (
              pendingApplications.map((application) => (
                <Card key={application._id}>
                  <CardHeader className="p-4">
                    <CardTitle>Application from {application.job.title}</CardTitle>
                    <CardDescription>Applied {format(new Date(application.createdAt), "MMM d, yyyy")}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium">Cover Letter</h3>
                        <p className="mt-1 whitespace-pre-line">{application.coverLetter}</p>
                      </div>
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        <span className="text-sm font-medium">Resume</span>
                        <Button variant="ghost" size="sm" className="ml-2">
                          <Download className="mr-1 h-3 w-3" />
                          Download
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Feedback (optional)</h3>
                        <Textarea
                          placeholder="Provide feedback to the applicant"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-end gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleUpdateStatus(application._id, "rejected")}
                      disabled={processingId === application._id}
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleUpdateStatus(application._id, "accepted")}
                      disabled={processingId === application._id}
                    >
                      Accept
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No pending applications</CardTitle>
                  <CardDescription>There are no pending applications for this job.</CardDescription>
                </CardHeader>
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
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>Application from {application.job.title}</CardTitle>
                        <CardDescription>
                          Applied {format(new Date(application.createdAt), "MMM d, yyyy")}
                        </CardDescription>
                      </div>
                      <Badge variant={application.status === "accepted" ? "default" : "destructive"}>
                        {application.status === "accepted" ? "Accepted" : "Rejected"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium">Cover Letter</h3>
                        <p className="mt-1 whitespace-pre-line">{application.coverLetter}</p>
                      </div>
                      {application.feedback && (
                        <div>
                          <h3 className="text-sm font-medium">Feedback</h3>
                          <p className="mt-1 whitespace-pre-line">{application.feedback}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      Updated: {format(new Date(application.updatedAt), "MMM d, yyyy")}
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-1 h-3 w-3" />
                      Download Resume
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No reviewed applications</CardTitle>
                  <CardDescription>You haven't reviewed any applications for this job yet.</CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
