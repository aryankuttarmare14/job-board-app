"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { applyToJob, fetchJobById } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import type { JobListing } from "@/lib/types"
import { format } from "date-fns"
import { ArrowLeft, Building, Calendar, Clock, MapPin, Upload } from "lucide-react"

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<JobListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [resume, setResume] = useState<File | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true)
        const jobData = await fetchJobById(params.id)
        setJob(jobData)
      } catch (error) {
        console.error("Failed to fetch job:", error)
        toast({
          title: "Error",
          description: "Failed to load job details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadJob()
  }, [params.id, toast])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        })
        return
      }
      setResume(file)
    }
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to apply for this job",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    if (user.role !== "jobseeker") {
      toast({
        title: "Not allowed",
        description: "Only job seekers can apply for jobs",
        variant: "destructive",
      })
      return
    }

    if (!resume) {
      toast({
        title: "Resume required",
        description: "Please upload your resume",
        variant: "destructive",
      })
      return
    }

    try {
      setApplying(true)
      await applyToJob(params.id, {
        coverLetter,
        resume,
      })
      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully",
      })
      router.push("/dashboard/jobseeker")
    } catch (error) {
      toast({
        title: "Application failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" disabled>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Skeleton className="h-8 w-40" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Separator />
              <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/jobs">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to jobs</span>
            </Link>
          </Button>
          <Card>
            <CardHeader>
              <CardTitle>Job not found</CardTitle>
              <CardDescription>The job you are looking for does not exist or has been removed.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href="/jobs">Browse all jobs</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  const isDeadlinePassed = new Date(job.deadline) < new Date()

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/jobs">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to jobs</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Job Details</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{job.title}</CardTitle>
            <CardDescription className="flex items-center">
              <Building className="mr-1 h-4 w-4" />
              {job.company}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <Badge className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job.location}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {job.type}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Deadline: {format(new Date(job.deadline), "MMM d, yyyy")}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Job Description</h3>
              <div className="whitespace-pre-line">{job.description}</div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Requirements</h3>
              <ul className="list-disc pl-5 space-y-1">
                {job.requirements?.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Responsibilities</h3>
              <ul className="list-disc pl-5 space-y-1">
                {job.responsibilities?.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            {user?.role === "jobseeker" ? (
              isDeadlinePassed ? (
                <Button disabled className="w-full">
                  Application deadline has passed
                </Button>
              ) : (
                <Button
                  onClick={() => document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth" })}
                  className="w-full"
                >
                  Apply for this position
                </Button>
              )
            ) : user?.role === "employer" ? (
              <Button disabled className="w-full">
                Employers cannot apply to jobs
              </Button>
            ) : (
              <Button asChild className="w-full">
                <Link href="/auth/login">Log in to apply</Link>
              </Button>
            )}
          </CardFooter>
        </Card>

        {user?.role === "jobseeker" && !isDeadlinePassed && (
          <Card id="application-form">
            <CardHeader>
              <CardTitle>Apply for this position</CardTitle>
              <CardDescription>Complete the form below to submit your application</CardDescription>
            </CardHeader>
            <form onSubmit={handleApply}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter</Label>
                  <Textarea
                    id="coverLetter"
                    placeholder="Tell us why you're a good fit for this position"
                    rows={6}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume (PDF)</Label>
                  <div className="flex items-center gap-2">
                    <Input id="resume" type="file" accept=".pdf" onChange={handleFileChange} className="flex-1" />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Please upload your resume in PDF format, max 5MB</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={applying}>
                  {applying ? "Submitting application..." : "Submit Application"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  )
}
