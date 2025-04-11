"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, MessageSquare, Star, ThumbsUp } from "lucide-react"

interface Bid {
  id: string
  freelancer: {
    id: string
    name: string
    avatar: string
    rating: number
    reviews: number
    level: string
  }
  amount: number
  deliveryTime: string
  message: string
  timestamp: string
  status: "pending" | "accepted" | "rejected"
}

interface BidListProps {
  bids: Bid[]
  projectId: string
  isClient?: boolean
  onAcceptBid?: (bidId: string) => void
}

export default function BidList({ bids, projectId, isClient = false, onAcceptBid }: BidListProps) {
  return (
    <div className="space-y-4">
      {bids.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No bids yet. Be the first to bid on this project!</div>
      ) : (
        bids.map((bid) => (
          <Card key={bid.id} className={bid.status === "accepted" ? "border-green-500" : ""}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-1/4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={bid.freelancer.avatar} alt={bid.freelancer.name} />
                      <AvatarFallback>{bid.freelancer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link href={`/freelancers/${bid.freelancer.id}`} className="font-medium hover:underline">
                        {bid.freelancer.name}
                      </Link>
                      <div className="flex items-center text-sm">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{bid.freelancer.rating}</span>
                        <span className="text-muted-foreground ml-1">({bid.freelancer.reviews})</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <Badge variant="outline">{bid.freelancer.level}</Badge>

                    <div className="flex items-center text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                      <span className="font-bold">${bid.amount}</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                      <span>{bid.deliveryTime}</span>
                    </div>

                    <div className="text-xs text-muted-foreground">Bid placed {bid.timestamp}</div>
                  </div>
                </div>

                <div className="md:w-3/4">
                  <div className="mb-4">
                    {bid.status === "accepted" && <Badge className="bg-green-500 mb-2">Accepted</Badge>}
                    {bid.status === "rejected" && (
                      <Badge variant="destructive" className="mb-2">
                        Rejected
                      </Badge>
                    )}
                    <p className="text-muted-foreground">{bid.message}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {isClient && bid.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => onAcceptBid && onAcceptBid(bid.id)}>
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Accept Bid
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </>
                    )}

                    {!isClient && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/messages?project=${projectId}&freelancer=${bid.freelancer.id}`}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Client
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
