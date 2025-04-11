import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/dashboard-layout"
import { Search, Send } from "lucide-react"

// Sample data for messages
const conversations = [
  {
    id: 1,
    user: {
      name: "Jane Cooper",
      image: "/placeholder.svg?height=40&width=40",
      online: true,
    },
    lastMessage: "Hey, I was wondering if you could help with my project. I need a website for my new business.",
    time: "10:30 AM",
    unread: 3,
    active: true,
  },
  {
    id: 2,
    user: {
      name: "Darlene Robertson",
      image: "/placeholder.svg?height=40&width=40",
      online: false,
    },
    lastMessage: "Thanks for the quick delivery! The design looks great. I'll review it and get back to you soon.",
    time: "Yesterday",
    unread: 0,
    active: false,
  },
  {
    id: 3,
    user: {
      name: "Leslie Alexander",
      image: "/placeholder.svg?height=40&width=40",
      online: true,
    },
    lastMessage: "I've approved the delivery. Looking forward to working with you again in the future.",
    time: "Mar 15",
    unread: 0,
    active: false,
  },
  {
    id: 4,
    user: {
      name: "Robert Fox",
      image: "/placeholder.svg?height=40&width=40",
      online: false,
    },
    lastMessage: "Can you make some revisions to the logo? I'd like to see a different color palette.",
    time: "Mar 12",
    unread: 0,
    active: false,
  },
  {
    id: 5,
    user: {
      name: "Jacob Jones",
      image: "/placeholder.svg?height=40&width=40",
      online: false,
    },
    lastMessage: "Just messaged to discuss the details of our project. Let me know when you're available.",
    time: "Mar 10",
    unread: 0,
    active: false,
  },
]

// Mock messages for the active conversation
const messages = [
  {
    id: 1,
    sender: "user",
    content: "Hey, I was wondering if you could help with my project. I need a website for my new business.",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "me",
    content:
      "Hi Jane! I'd be happy to help with your website. Can you tell me more about your business and what you're looking for?",
    time: "10:32 AM",
  },
  {
    id: 3,
    sender: "user",
    content:
      "It's a small coffee shop that I'm opening next month. I need a simple website with information about our menu, location, and hours.",
    time: "10:35 AM",
  },
  {
    id: 4,
    sender: "me",
    content:
      "Sounds great! I have experience with restaurant websites. Would you like to include online ordering or just information?",
    time: "10:38 AM",
  },
  {
    id: 5,
    sender: "user",
    content:
      "Just information for now, but I might want to add online ordering in the future. How much would this cost and how long would it take?",
    time: "10:40 AM",
  },
  {
    id: 6,
    sender: "me",
    content:
      "For a basic informational website with 5-7 pages, my rate would be around $750-$950 depending on the exact requirements. I could have it completed in about 2 weeks. Would that work for you?",
    time: "10:45 AM",
  },
  {
    id: 7,
    sender: "user",
    content: "That sounds reasonable. Can you show me some examples of similar websites you've created?",
    time: "10:48 AM",
  },
]

export default function MessagesPage() {
  const activeConversation = conversations.find((conv) => conv.active)

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>

        <div className="flex flex-1 border rounded-lg overflow-hidden">
          {/* Conversation List */}
          <div className="w-1/3 border-r flex flex-col">
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search messages..." className="pl-8" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/messages/${conversation.id}`}
                  className={`flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors ${conversation.active ? "bg-muted" : ""}`}
                >
                  <div className="relative flex-shrink-0">
                    <Image
                      src={conversation.user.image || "/placeholder.svg"}
                      alt={conversation.user.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    {conversation.user.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium truncate">{conversation.user.name}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{conversation.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread > 0 && <Badge className="ml-2 flex-shrink-0">{conversation.unread}</Badge>}
                </Link>
              ))}
            </div>
          </div>

          {/* Active Conversation */}
          <div className="w-2/3 flex flex-col">
            {activeConversation ? (
              <>
                <div className="p-3 border-b flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src={activeConversation.user.image || "/placeholder.svg"}
                      alt={activeConversation.user.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    {activeConversation.user.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{activeConversation.user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {activeConversation.user.online ? "Online" : "Offline"}
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-lg ${
                          message.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div
                          className={`text-xs mt-1 ${
                            message.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          {message.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 border-t">
                  <form className="flex gap-2">
                    <Input className="flex-1" placeholder="Type a message..." />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-center p-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
