"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchJobs } from "@/lib/api"
import type { JobListing } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { MapPin, Search } from "lucide-react"

export default function JobsPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [jobs, setJobs] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    query: initialQuery,
    location: "",
    type: "",
    sort: "newest",
  })

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true)
        const jobsData = await fetchJobs(filters)
        setJobs(jobsData)
      } catch (error) {
        console.error("Failed to fetch jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [filters.sort, filters.type, filters.location])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    fetchJobs(filters)
      .then(setJobs)
      .finally(() => setLoading(false))
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Listings</h1>
          <p className="text-muted-foreground">
            Browse all available job opportunities and find your next career move.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      type="search"
                      placeholder="Job title or keyword"
                      className="pl-8"
                      value={filters.query}
                      onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Any location"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Job Type</Label>
                  <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Any type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any type</SelectItem>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sort">Sort By</Label>
                  <Select value={filters.sort} onValueChange={(value) => setFilters({ ...filters, sort: value })}>
                    <SelectTrigger id="sort">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="relevance">Relevance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Apply Filters
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {loading ? (
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
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
                ))
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <Card key={job._id}>
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="line-clamp-1">{job.title}</CardTitle>
                        <div className="text-sm text-muted-foreground">{job.company}</div>
                      </div>
                      <Badge variant="secondary">{job.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="mr-1 h-3 w-3" />
                      {job.location}
                    </div>
                    <p className="line-clamp-2 text-sm">{job.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">
                        Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                      </Badge>
                      <Badge variant="outline">Deadline: {new Date(job.deadline).toLocaleDateString()}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between">
                    <div className="text-sm text-muted-foreground">{job.applications} applications</div>
                    <Button asChild size="sm">
                      <Link href={`/jobs/${job._id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <h3 className="text-lg font-semibold">No jobs found</h3>
                <p className="text-muted-foreground">Try adjusting your search filters to find more results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
