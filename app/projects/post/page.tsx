"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, DollarSign, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function PostProjectPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [projectType, setProjectType] = useState<string>("fixed")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit the form data to the server
    // For now, we'll just redirect to the projects page
    router.push("/projects")
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-6">Post a Project</h1>
      <p className="text-muted-foreground mb-8">
        Post your project and receive competitive bids from talented freelancers within minutes.
      </p>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Provide detailed information about your project to attract the right freelancers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input id="title" placeholder="e.g., Website Redesign for Small Business" required />
              <p className="text-sm text-muted-foreground">Keep it clear and concise (maximum 80 characters)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web-development">Web Development</SelectItem>
                  <SelectItem value="design">Graphics & Design</SelectItem>
                  <SelectItem value="writing">Writing & Translation</SelectItem>
                  <SelectItem value="marketing">Digital Marketing</SelectItem>
                  <SelectItem value="video">Video & Animation</SelectItem>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="music">Music & Audio</SelectItem>
                  <SelectItem value="programming">Programming & Tech</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your project in detail..."
                className="min-h-[200px]"
                required
              />
              <p className="text-sm text-muted-foreground">
                Include all details about your project requirements, goals, and expectations.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Required Skills</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  "HTML/CSS",
                  "JavaScript",
                  "React",
                  "Node.js",
                  "WordPress",
                  "Photoshop",
                  "Illustrator",
                  "Content Writing",
                  "SEO",
                ].map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox id={`skill-${skill}`} />
                    <Label htmlFor={`skill-${skill}`} className="text-sm font-normal">
                      {skill}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Budget & Timeline</CardTitle>
            <CardDescription>Set your budget and timeline for the project.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Project Type</Label>
              <RadioGroup defaultValue="fixed" onValueChange={setProjectType}>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="fixed" className="font-medium">
                      Fixed Price
                    </Label>
                    <p className="text-sm text-muted-foreground">Pay a fixed price for the entire project</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="hourly" id="hourly" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="hourly" className="font-medium">
                      Hourly Rate
                    </Label>
                    <p className="text-sm text-muted-foreground">Pay by the hour for ongoing work</p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {projectType === "fixed" ? (
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="budget" type="number" min="5" className="pl-9" placeholder="Enter your budget" required />
                </div>
                <p className="text-sm text-muted-foreground">Set a realistic budget to attract quality freelancers</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hourly-rate">Hourly Rate</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="hourly-rate" type="number" min="5" className="pl-9" placeholder="e.g., 25" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimated-hours">Estimated Hours</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="estimated-hours"
                      type="number"
                      min="1"
                      className="pl-9"
                      placeholder="e.g., 40"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a deadline"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="attachments">Attachments (Optional)</Label>
              <Input id="attachments" type="file" multiple />
              <p className="text-sm text-muted-foreground">
                Upload any files that might help freelancers understand your project better
              </p>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="terms" required />
              <div className="grid gap-1.5">
                <Label htmlFor="terms" className="text-sm font-normal">
                  I agree to the Terms of Service and understand that my project will be public
                </Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">Post Project</Button>
          </CardFooter>
        </Card>
      </form>

      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg flex items-start space-x-2">
        <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-blue-800 dark:text-blue-400">Tips for getting great bids</p>
          <ul className="list-disc list-inside text-blue-700 dark:text-blue-300 mt-1 space-y-1">
            <li>Be as specific as possible about your requirements</li>
            <li>Set a realistic budget and timeline</li>
            <li>Respond quickly to questions from freelancers</li>
            <li>Check freelancer profiles and reviews before accepting a bid</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
