import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Star, DollarSign, BarChart, ShoppingCart } from "lucide-react"
// We now use the dashboard layout from layout.tsx
import { formatDistanceToNow, format } from "date-fns"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/utils/supabase/cookies-client"

// Define types for data from the database
type Order = {
  id: string
  title: string
  buyer: string
  buyer_id: string
  date: string
  amount: number
  status: string
}

// Define types for the Supabase query responses
type OrderData = {
  id: string
  title: string | null
  amount: number
  status: string
  created_at: string
  client_id: string
  profiles: {
    full_name: string | null
  } | null
}

type Message = {
  id: string
  sender_id: string
  sender_name: string
  sender_avatar: string
  preview: string
  time: string
  unread: boolean
}

type Service = {
  id: string
  title: string
  description: string
  price: number
  image_url: string
  rating: number
  reviews_count: number
}

async function getDashboardData() {
  // Use our utility function to create a Supabase client with proper cookie handling
  const supabase = await createSupabaseServerClient()
  
  // Get authenticated user with the new method
  const { data: { user } } = await supabase.auth.getUser()
  // Authentication check is now handled in dashboard/layout.tsx
  
  if (!user) {
    throw new Error('User is not authenticated')
  }
  
  const userId = user.id
  
  // Get the user profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  // Get freelancer profile if the user is a freelancer
  const { data: freelancerData } = profileData?.is_freelancer
    ? await supabase
        .from('freelancer_profiles')
        .select('*')
        .eq('id', userId)
        .single()
    : { data: null }

  // Get orders statistics
  const { data: ordersData } = await supabase
    .from('orders')
    .select('status')
    .eq(profileData?.is_freelancer ? 'freelancer_id' : 'client_id', userId)
  
  const orderStats = {
    pending: ordersData?.filter(order => order.status === 'pending').length ?? 0,
    inProgress: ordersData?.filter(order => order.status === 'in_progress').length ?? 0,
    completed: ordersData?.filter(order => order.status === 'completed').length ?? 0,
    cancelled: ordersData?.filter(order => order.status === 'cancelled').length ?? 0,
  }

  // Get recent orders
  const { data: recentOrdersData } = await supabase
    .from('orders')
    .select(`
      id,
      title,
      amount,
      status,
      created_at,
      client_id,
      profiles!client_id(full_name)
    `)
    .eq(profileData?.is_freelancer ? 'freelancer_id' : 'client_id', userId)
    .order('created_at', { ascending: false })
    .limit(5) as { data: OrderData[] | null }

  // Format recent orders
  const recentOrders: Order[] = recentOrdersData?.map(order => ({
    id: order.id,
    title: order.title || 'Unnamed Order',
    buyer: order.profiles?.full_name || 'Unknown Client',
    buyer_id: order.client_id,
    date: format(new Date(order.created_at), 'MMM d, yyyy'),
    amount: order.amount,
    status: order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' '),
  })) || []

  // Get recent messages
  const { data: conversationsData } = await supabase
    .from('conversation_participants')
    .select(`
      conversation_id,
      conversations!inner(id, updated_at)
    `)
    .eq('user_id', userId)
    .order('conversations.updated_at', { ascending: false })
    .limit(5)

  const conversationIds = conversationsData?.map(conv => conv.conversation_id) || []
  
  const messages: Message[] = []
  
  // For each conversation, get the latest message and the other participant
  if (conversationIds.length > 0) {
    for (const convId of conversationIds) {
      // Get latest message in conversation
      const { data: latestMessage } = await supabase
        .from('messages')
        .select('id, content, sender_id, created_at, is_read')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (latestMessage) {
        // Get other participant in conversation
        const { data: otherParticipant } = await supabase
          .from('conversation_participants')
          .select('user_id, profiles:profiles(full_name, avatar_url)')
          .eq('conversation_id', convId)
          .neq('user_id', userId)
          .single()
        
        if (otherParticipant && otherParticipant.profiles) {
          const profile = otherParticipant.profiles as any;
          messages.push({
            id: convId,
            sender_id: otherParticipant.user_id,
            sender_name: profile.full_name || 'Unknown User',
            sender_avatar: profile.avatar_url || '/placeholder.svg?height=36&width=36',
            preview: latestMessage.content.length > 40 
              ? `${latestMessage.content.substring(0, 40)}...` 
              : latestMessage.content,
            time: formatDistanceToNow(new Date(latestMessage.created_at), { addSuffix: true }),
            unread: !latestMessage.is_read && latestMessage.sender_id !== userId,
          })
        }
      }
    }
  }

  // Get services/gigs
  const { data: servicesData } = await supabase
    .from('services')
    .select(`
      id,
      title,
      description,
      price,
      service_images!inner(image_url, is_primary)
    `)
    .eq('freelancer_id', userId)
    .eq('status', 'active')
    .eq('service_images.is_primary', true)
    .limit(3)

  // For each service, get the average rating
  const services: Service[] = []
  if (servicesData) {
    for (const service of servicesData) {
      // Get reviews for this service (via orders)
      // First get orders for this service
      const { data: serviceOrders } = await supabase
        .from('orders')
        .select('id')
        .eq('service_id', service.id)
      
      // Then get reviews for those orders
      const orderIds = serviceOrders?.map(order => order.id) || []
      const { data: reviewsData, count: reviewsCount } = orderIds.length > 0
        ? await supabase
            .from('reviews')
            .select('rating', { count: 'exact' })
            .eq('reviewee_id', userId)
            .in('order_id', orderIds)
        : { data: [], count: 0 }
      
      // Calculate average rating
      const avgRating = reviewsData && reviewsData.length > 0
        ? reviewsData.reduce((acc, review) => acc + review.rating, 0) / reviewsData.length
        : 0
      
      services.push({
        id: service.id,
        title: service.title,
        description: service.description,
        price: service.price,
        image_url: service.service_images[0]?.image_url || '/placeholder.svg',
        rating: parseFloat(avgRating.toFixed(1)),
        reviews_count: reviewsCount || 0
      })
    }
  }

  // Calculate total earnings (for freelancers)
  const totalEarnings = freelancerData?.total_earnings || 0

  // Get completion rate
  const totalOrders = orderStats.completed + orderStats.cancelled
  const completionRate = totalOrders > 0 
    ? Math.round((orderStats.completed / totalOrders) * 100) 
    : 100

  // Get average rating
  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('rating')
    .eq('reviewee_id', userId)
  
  const avgRating = reviewsData && reviewsData.length > 0
    ? (reviewsData.reduce((acc, review) => acc + review.rating, 0) / reviewsData.length).toFixed(1)
    : '0.0'

  return {
    profile: profileData,
    orderStats,
    recentOrders,
    messages,
    services,
    totalEarnings,
    completionRate,
    avgRating
  }
}

export default async function DashboardPage() {
  const { 
    profile, 
    orderStats, 
    recentOrders, 
    messages, 
    services,
    totalEarnings,
    completionRate,
    avgRating
  } = await getDashboardData()
  return (
    <div className="flex flex-col gap-6">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center rounded-lg border p-4 md:p-6 bg-card">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {profile && typeof profile.full_name === 'string' ? profile.full_name.split(' ')[0] : 'User'}!
            </h1>
            <p className="text-muted-foreground">Monitor your performance and track your orders</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button asChild>
              <Link href="/gigs/create">Create New Gig</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/profile">View Profile</Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <h3 className="text-2xl font-bold">${totalEarnings.toLocaleString()}</h3>
                  <p className="text-xs text-neutral-500 mt-1">Lifetime earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Orders</p>
                  <h3 className="text-2xl font-bold">{orderStats.pending + orderStats.inProgress}</h3>
                  <p className="text-xs text-neutral-500 mt-1">↔ Same as last week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Rating</p>
                  <h3 className="text-2xl font-bold">{avgRating}</h3>
                  <p className="text-xs text-neutral-500 mt-1">From {recentOrders.length} orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <h3 className="text-2xl font-bold">{completionRate}%</h3>
                  <p className="text-xs text-neutral-500 mt-1">{orderStats.completed} completed orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Section */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>Order Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="current">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="current">
                    Current
                    <Badge className="ml-2 bg-primary/10 text-primary" variant="secondary">
                      {orderStats.pending + orderStats.inProgress}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed
                    <Badge className="ml-2 bg-primary/10 text-primary" variant="secondary">
                      {orderStats.completed}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="cancelled">
                    Cancelled
                    <Badge className="ml-2 bg-primary/10 text-primary" variant="secondary">
                      {orderStats.cancelled}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>

                <TabsContent value="current" className="pt-4">
                  <div className="space-y-4">
                    {recentOrders
                      .filter((order) => order.status === "In Progress")
                      .map((order) => (
                        <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                          <div className="flex items-start gap-4">
                            <div className="bg-muted p-2 rounded-md">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium">{order.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {order.buyer} • {order.date}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium">${order.amount}</div>
                            <Badge variant={order.status === "In Progress" ? "default" : "secondary"}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}

                    {recentOrders.filter((order) => order.status === "In Progress").length === 0 && (
                      <div className="text-center py-6 text-muted-foreground">No current orders</div>
                    )}

                    <div className="text-center pt-2">
                      <Button variant="outline" asChild>
                        <Link href="/orders">View All Orders</Link>
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="completed" className="pt-4">
                  <div className="space-y-4">
                    {recentOrders
                      .filter((order) => order.status === "Completed")
                      .map((order) => (
                        <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                          <div className="flex items-start gap-4">
                            <div className="bg-muted p-2 rounded-md">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium">{order.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {order.buyer} • {order.date}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium">${order.amount}</div>
                            <Badge variant="secondary">{order.status}</Badge>
                          </div>
                        </div>
                      ))}

                    <div className="text-center pt-2">
                      <Button variant="outline" asChild>
                        <Link href="/orders">View All Orders</Link>
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="cancelled" className="pt-4">
                  <div className="text-center py-6 text-muted-foreground">No cancelled orders</div>
                </TabsContent>

                <TabsContent value="all" className="pt-4">
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div className="flex items-start gap-4">
                          <div className="bg-muted p-2 rounded-md">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">{order.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {order.buyer} • {order.date}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">${order.amount}</div>
                          <Badge variant={order.status === "In Progress" ? "default" : "secondary"}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}

                    <div className="text-center pt-2">
                      <Button variant="outline" asChild>
                        <Link href="/orders">View All Orders</Link>
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

           {/* Messages Preview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.length > 0 ? messages.map((message) => (
                  <Link
                    key={message.id}
                    href={`/messages/${message.id}`}
                    className="flex items-start gap-3 pb-4 border-b last:border-0 group"
                  >
                    <div className="relative">
                      <Image
                        src={message.sender_avatar || "/placeholder.svg"}
                        alt={message.sender_name}
                        width={36}
                        height={36}
                        className="rounded-full"
                      />
                      {message.unread && (
                        <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{message.sender_name}</span>
                        <span className="text-xs text-muted-foreground">{message.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{message.preview}</p>
                    </div>
                  </Link>
                )) : (
                  <div className="text-center py-6 text-muted-foreground">No messages yet</div>
                )}

                <div className="text-center pt-2">
                  <Button variant="outline" asChild>
                    <Link href="/messages">View All Messages</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Freelancer-specific content */}
        {profile?.is_freelancer && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Your Gigs</CardTitle>
              <Button size="sm" asChild>
                <Link href="/gigs/create">Create New</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {services.length > 0 ? services.map((service) => (
                  <Card key={service.id} className="overflow-hidden">
                    <div className="relative aspect-video">
                      <Image
                        src={service.image_url || `/placeholder.svg?height=320&width=400&text=${encodeURIComponent(service.title)}`}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-1 line-clamp-1">{service.title}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{service.rating || 'New'}</span>
                        {service.reviews_count > 0 && (
                          <span className="text-xs text-muted-foreground">({service.reviews_count})</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">From</span>
                        <span className="font-semibold">${service.price}</span>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="col-span-3 text-center py-6 text-muted-foreground">No gigs created yet</div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Client-specific content */}
        {profile?.is_client && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Find Freelancers</CardTitle>
              <Button size="sm" asChild>
                <Link href="/search">Browse Services</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">Find skilled freelancers for your projects.</p>
                <div className="grid gap-4 grid-cols-2">
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                    <Link href="/search?category=design">
                      <span className="text-lg">Design</span>
                      <span className="text-xs text-muted-foreground">Logo, UI/UX, Graphics</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                    <Link href="/search?category=development">
                      <span className="text-lg">Development</span>
                      <span className="text-xs text-muted-foreground">Web, Mobile, Backend</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                    <Link href="/search?category=writing">
                      <span className="text-lg">Writing</span>
                      <span className="text-xs text-muted-foreground">Content, Copywriting</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                    <Link href="/search?category=marketing">
                      <span className="text-lg">Marketing</span>
                      <span className="text-xs text-muted-foreground">SEO, Social Media</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
  )
}
