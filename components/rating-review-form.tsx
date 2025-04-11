"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RatingReviewFormProps {
  freelancerId: string
  projectId?: string
  onSuccess?: () => void
}

export default function RatingReviewForm({ freelancerId, projectId, onSuccess }: RatingReviewFormProps) {
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting your review",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Review Submitted",
      description: "Your review has been successfully submitted",
    })

    // Reset form
    setRating(0)
    setReview("")
    setIsSubmitting(false)

    // Call onSuccess callback if provided
    if (onSuccess) {
      onSuccess()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate & Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-2">Your Rating</div>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer transition-colors ${
                    star <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Your Review</div>
            <Textarea
              placeholder="Share your experience working with this freelancer..."
              className="min-h-[120px]"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            "Submitting..."
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Review
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
