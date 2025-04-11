"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Database } from "@/types/supabase"
import { useAuth } from "@/components/auth/client-auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import DashboardLayout from "@/components/dashboard-layout"
import { X, Upload, Plus, Info, AlertCircle, Loader2, Check } from "lucide-react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { ProfileCheck } from "@/components/profile/profile-check"

// Now using the enhanced ProfileCheck component instead
// which provides better role management functionality

// Form schema definition for gig creation
const gigFormSchema = z.object({
  title: z.string().min(10, {
    message: "Title must be at least 10 characters.",
  }).max(80, {
    message: "Title cannot be longer than 80 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  subcategory: z.string({
    required_error: "Please select a subcategory.",
  }),
  description: z.string().min(100, {
    message: "Description must be at least 100 characters.",
  }).max(5000, {
    message: "Description cannot be longer than 5000 characters.",
  }),
  
  // Pricing options
  basic_package_name: z.string().min(5, { message: "Package name is required" }),
  basic_package_description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  basic_package_price: z.number().min(5, { message: "Minimum price is $5" }),
  basic_package_delivery_time: z.number().min(1, { message: "Delivery time must be at least 1 day" }),
  basic_package_revisions: z.number().min(0),
  
  standard_package_enabled: z.boolean().default(false),
  standard_package_name: z.string().optional(),
  standard_package_description: z.string().optional(),
  standard_package_price: z.number().optional(),
  standard_package_delivery_time: z.number().optional(),
  standard_package_revisions: z.number().optional(),
  
  premium_package_enabled: z.boolean().default(false),
  premium_package_name: z.string().optional(),
  premium_package_description: z.string().optional(),
  premium_package_price: z.number().optional(),
  premium_package_delivery_time: z.number().optional(),
  premium_package_revisions: z.number().optional(),
  
  // Requirements from buyers
  requirements: z.string().max(500, { message: "Requirements cannot exceed 500 characters" }).optional(),
}).refine(
  (data) => {
    if (data.standard_package_enabled) {
      return !!data.standard_package_name && 
             !!data.standard_package_description && 
             !!data.standard_package_price && 
             !!data.standard_package_delivery_time;
    }
    return true;
  },
  {
    message: "Standard package requires all fields to be filled",
    path: ["standard_package_name"],
  }
).refine(
  (data) => {
    if (data.premium_package_enabled) {
      return !!data.premium_package_name && 
             !!data.premium_package_description && 
             !!data.premium_package_price && 
             !!data.premium_package_delivery_time;
    }
    return true;
  },
  {
    message: "Premium package requires all fields to be filled",
    path: ["premium_package_name"],
  }
);

type GigFormValues = z.infer<typeof gigFormSchema>;

// Debug helper function
function debugLog(...args: any[]) {
  console.log("[CreateGigPage]", ...args)
}

export default function CreateGigPage() {
  const router = useRouter()
  const { user, supabase, isFreelancer } = useAuth()
  const { toast } = useToast()
  
  // State for file uploads and UI
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null)
  const [galleryImages, setGalleryImages] = useState<File[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [categories, setCategories] = useState<any[]>([])
  const [subcategories, setSubcategories] = useState<any[]>([])
  
  // Form initialization
  const form = useForm<GigFormValues>({
    resolver: zodResolver(gigFormSchema),
    defaultValues: {
      title: "",
      category: "",
      subcategory: "",
      description: "",
      basic_package_name: "Basic",
      basic_package_description: "",
      basic_package_price: 5,
      basic_package_delivery_time: 3,
      basic_package_revisions: 1,
      standard_package_enabled: false,
      premium_package_enabled: false,
      requirements: "",
    },
  })

  // Load categories from the database
  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
      
      if (error) {
        console.error('Error loading categories:', error)
      } else if (data) {
        setCategories(data)
      }
    }
    
    loadCategories()
  }, [])
  
  // Load subcategories when category changes
  const selectedCategory = form.watch('category')
  useEffect(() => {
    async function loadSubcategories() {
      if (!selectedCategory) {
        setSubcategories([])
        return
      }
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('parent_id', selectedCategory)
      
      if (error) {
        console.error('Error loading subcategories:', error)
      } else if (data) {
        setSubcategories(data)
      }
    }
    
    loadSubcategories()
  }, [selectedCategory, supabase])

  const addTag = () => {
    if (newTag && !tags.includes(newTag) && tags.length < 5) {
      setTags([...tags, newTag])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }
  
  // Handle main image upload
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMainImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setMainImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  // Handle gallery image uploads
  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      // Limit to 8 images total
      const newFiles = [...galleryImages, ...files].slice(0, 8)
      setGalleryImages(newFiles)
      
      // Generate previews for all images
      Promise.all(
        files.map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => {
              resolve(e.target?.result as string)
            }
            reader.readAsDataURL(file)
          })
        })
      ).then((newPreviews) => {
        setGalleryPreviews([...galleryPreviews, ...newPreviews].slice(0, 8))
      })
    }
  }
  
  // Remove gallery image
  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index))
    setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index))
  }
  
  // Remove main image
  const removeMainImage = () => {
    setMainImage(null)
    setMainImagePreview(null)
  }
  
  // Navigate between tabs
  const goToTab = (tab: string) => {
    setActiveTab(tab)
  }
  
  // Form submission handler
  async function onSubmit(data: GigFormValues) {
    try {
      setIsSubmitting(true)
      
      // Validation checks
      if (!mainImage) {
        toast({
          title: "Error",
          description: "Please upload a main image for your service",
          variant: "destructive",
        })
        setActiveTab("gallery")
        setIsSubmitting(false)
        return
      }
      
      if (galleryImages.length < 2) {
        toast({
          title: "Error",
          description: "Please upload at least 2 gallery images",
          variant: "destructive",
        })
        setActiveTab("gallery")
        setIsSubmitting(false)
        return
      }
      
      if (tags.length < 2) {
        toast({
          title: "Error",
          description: "Please add at least 2 tags to your service",
          variant: "destructive",
        })
        setActiveTab("overview")
        setIsSubmitting(false)
        return
      }
      
      // Get current user info
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a service",
          variant: "destructive",
        })
        router.push("/login")
        return
      }
      
      // Check if user has a freelancer profile
      const { data: freelancerProfile, error: profileError } = await supabase
        .from("freelancer_profiles")
        .select("*")
        .eq("id", user.id)
        .single()
      
      if (profileError || !freelancerProfile) {
        toast({
          title: "Error",
          description: "You need to set up a freelancer profile first",
          variant: "destructive",
        })
        router.push("/profile/freelancer")
        return
      }
      
      // Upload images to Supabase Storage
      // 1. Upload main image
      const mainImageExt = mainImage.name.split(".").pop()
      const mainImageName = `${user.id}-${Date.now()}-main.${mainImageExt}`
      const mainImagePath = `services/${mainImageName}`
      
      const { error: mainImageError } = await supabase.storage
        .from("vrajitor")
        .upload(mainImagePath, mainImage)
      
      if (mainImageError) {
        throw new Error(`Error uploading main image: ${mainImageError.message}`)
      }
      
      const mainImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/vrajitor/${mainImagePath}`
      
      // 2. Upload gallery images
      const galleryUrls = await Promise.all(
        galleryImages.map(async (image, index) => {
          const ext = image.name.split(".").pop()
          const imageName = `${user.id}-${Date.now()}-${index}.${ext}`
          const imagePath = `services/${imageName}`
          
          const { error: uploadError } = await supabase.storage
            .from("vrajitor")
            .upload(imagePath, image)
          
          if (uploadError) {
            throw new Error(`Error uploading gallery image: ${uploadError.message}`)
          }
          
          return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/vrajitor/${imagePath}`
        })
      )
      
      // 3. Create service in database
      const { data: service, error: serviceError } = await supabase
        .from("services")
        .insert({
          freelancer_id: user.id,
          title: data.title,
          description: data.description,
          category_id: data.category,
          subcategory_id: data.subcategory,
          tags: tags,
          requirements: data.requirements || null,
          status: "pending", // Will require admin approval
        })
        .select()
        .single()
      
      if (serviceError) {
        throw new Error(`Error creating service: ${serviceError.message}`)
      }
      
      // 4. Create service packages
      // Basic package (required)
      await supabase
        .from("service_packages")
        .insert({
          service_id: service.id,
          name: data.basic_package_name,
          description: data.basic_package_description,
          price: data.basic_package_price,
          delivery_time: data.basic_package_delivery_time,
          revisions: data.basic_package_revisions,
          package_type: "basic",
          features: [], // Add features if needed
        })
      
      // Standard package (optional)
      if (data.standard_package_enabled) {
        await supabase
          .from("service_packages")
          .insert({
            service_id: service.id,
            name: data.standard_package_name,
            description: data.standard_package_description,
            price: data.standard_package_price,
            delivery_time: data.standard_package_delivery_time,
            revisions: data.standard_package_revisions,
            package_type: "standard",
            features: [],
          })
      }
      
      // Premium package (optional)
      if (data.premium_package_enabled) {
        await supabase
          .from("service_packages")
          .insert({
            service_id: service.id,
            name: data.premium_package_name,
            description: data.premium_package_description,
            price: data.premium_package_price,
            delivery_time: data.premium_package_delivery_time,
            revisions: data.premium_package_revisions,
            package_type: "premium",
            features: [],
          })
      }
      
      // 5. Store images info
      // Main image
      await supabase
        .from("service_images")
        .insert({
          service_id: service.id,
          image_url: mainImageUrl,
          is_primary: true,
        })
      
      // Gallery images
      await Promise.all(
        galleryUrls.map(async (url) => {
          return supabase
            .from("service_images")
            .insert({
              service_id: service.id,
              image_url: url,
              is_primary: false,
            })
        })
      )
      
      toast({
        title: "Service created successfully!",
        description: "Your service has been submitted for review.",
      })
      
      // Redirect to services dashboard
      router.push("/dashboard/services")
    } catch (error) {
      console.error("Error creating service:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    debugLog("Component mounted")
    // Check if the user is a freelancer using the auth context
    async function checkUserProfile() {
      try {
        debugLog("Checking user profile from auth context")
        
        if (!user) {
          debugLog("No authenticated user found")
          return false
        }
        
        debugLog("User authenticated, checking freelancer status", user.id)
        
        // Use the isFreelancer flag directly from the auth context
        if (isFreelancer) {
          debugLog("User is a freelancer")
          return true
        } else {
          debugLog("User is NOT a freelancer")
          // Here we could show UI to let them become a freelancer
          return false
        }
      } catch (error) {
        debugLog("Error in auth context profile check:", error)
        return false
      }
    }
    
    checkUserProfile()
    return () => {
      debugLog("Component unmounting")
    }
  }, [supabase, user, isFreelancer])
  
  return (
    <ProfileCheck requiredType="freelancer">
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Create a New Service</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Service Overview</CardTitle>
                <CardDescription>Provide basic information about your service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Service Title</Label>
                  <Input
                    id="title"
                    placeholder="I will design a professional website for your business"
                    className="max-w-2xl"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your title should be attention-grabbing and accurately describe your service (maximum 80 characters)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web-development">Web Development</SelectItem>
                        <SelectItem value="design">Graphics & Design</SelectItem>
                        <SelectItem value="writing">Writing & Translation</SelectItem>
                        <SelectItem value="marketing">Digital Marketing</SelectItem>
                        <SelectItem value="video">Video & Animation</SelectItem>
                        <SelectItem value="music">Music & Audio</SelectItem>
                        <SelectItem value="programming">Programming & Tech</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website-development">Website Development</SelectItem>
                        <SelectItem value="ecommerce">E-Commerce Development</SelectItem>
                        <SelectItem value="wordpress">WordPress</SelectItem>
                        <SelectItem value="landing-page">Landing Page</SelectItem>
                        <SelectItem value="web-app">Web Applications</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Service Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tags (press enter or click add)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                    />
                    <Button type="button" onClick={addTag} variant="secondary">
                      Add
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-2 py-1 text-sm flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-muted-foreground hover:text-foreground ml-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {tags.length === 0 && (
                      <p className="text-xs text-muted-foreground">Add up to 5 tags to help buyers find your service</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Save Draft</Button>
                <Button>Continue to Pricing</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Service Packages</CardTitle>
                <CardDescription>Set up your service tiers and pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {["Basic", "Standard", "Premium"].map((tier) => (
                    <Card key={tier} className="relative">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{tier}</CardTitle>
                        <div className="absolute right-4 top-4">
                          <Badge variant={tier === "Standard" ? "default" : "outline"}>
                            {tier === "Standard" ? "Popular" : ""}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`${tier.toLowerCase()}-price`}>Price ($)</Label>
                          <Input
                            id={`${tier.toLowerCase()}-price`}
                            type="number"
                            min="5"
                            defaultValue={tier === "Basic" ? "50" : tier === "Standard" ? "100" : "200"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${tier.toLowerCase()}-name`}>Package Name</Label>
                          <Input id={`${tier.toLowerCase()}-name`} defaultValue={`${tier} Package`} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${tier.toLowerCase()}-description`}>Short Description</Label>
                          <Textarea
                            id={`${tier.toLowerCase()}-description`}
                            rows={2}
                            placeholder="What's included in this package"
                            defaultValue={
                              tier === "Basic"
                                ? "Entry-level service for small projects"
                                : tier === "Standard"
                                  ? "Complete solution for most clients"
                                  : "Premium service with all features included"
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`${tier.toLowerCase()}-delivery`}>Delivery Time (days)</Label>
                            <Input
                              id={`${tier.toLowerCase()}-delivery`}
                              type="number"
                              min="1"
                              defaultValue={tier === "Basic" ? "3" : tier === "Standard" ? "5" : "7"}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${tier.toLowerCase()}-revisions`}>Revisions</Label>
                            <Input
                              id={`${tier.toLowerCase()}-revisions`}
                              type="number"
                              min="1"
                              defaultValue={tier === "Basic" ? "2" : tier === "Standard" ? "5" : "Unlimited"}
                            />
                          </div>
                        </div>
                      </CardContent>
                      <Separator />
                      <CardContent className="pt-3">
                        <Label>What's Included</Label>
                        <div className="space-y-2 mt-2">
                          {[
                            tier === "Basic"
                              ? ["3 pages", "Responsive design", "Contact form"]
                              : tier === "Standard"
                                ? [
                                    "5 pages",
                                    "Responsive design",
                                    "Contact form",
                                    "SEO optimization",
                                    "Social media integration",
                                  ]
                                : [
                                    "10 pages",
                                    "Responsive design",
                                    "Contact form",
                                    "SEO optimization",
                                    "Social media integration",
                                    "E-commerce functionality",
                                    "Custom features",
                                  ],
                          ]
                            .flat()
                            .map((feature, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <Checkbox id={`${tier.toLowerCase()}-feature-${index}`} defaultChecked />
                                <Label
                                  htmlFor={`${tier.toLowerCase()}-feature-${index}`}
                                  className="text-sm font-normal"
                                >
                                  {feature}
                                </Label>
                              </div>
                            ))}
                          <Button variant="ghost" size="sm" className="text-primary flex items-center mt-1">
                            <Plus className="h-3 w-3 mr-1" />
                            Add Feature
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex items-start space-x-2 p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800 dark:text-blue-400">Pricing Tips</p>
                    <p className="text-blue-700 dark:text-blue-300">
                      Strategic pricing can significantly affect your success. Consider the market rates, your expertise
                      level, and the value you provide when setting prices for your packages.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Previous</Button>
                <Button>Continue to Description</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Description Tab */}
          <TabsContent value="description">
            <Card>
              <CardHeader>
                <CardTitle>Service Description</CardTitle>
                <CardDescription>Provide detailed information about your service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your service in detail..."
                    className="min-h-[200px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Be specific about what your service includes, your process, and the value you provide to clients
                    (minimum 120 characters)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements From Buyer</Label>
                  <Textarea
                    id="requirements"
                    placeholder="What do you need from the buyer to get started?"
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Specify what information or materials you need from clients to complete the service
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="faqs">Frequently Asked Questions</Label>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="space-y-2 mb-4">
                        <Label htmlFor="faq-question-1">Question</Label>
                        <Input id="faq-question-1" defaultValue="How long does it take to complete a website?" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="faq-answer-1">Answer</Label>
                        <Textarea
                          id="faq-answer-1"
                          defaultValue="Typically, a basic website takes 1-2 weeks to complete, while more complex projects may take 3-4 weeks. The exact timeline depends on the scope and your specific requirements."
                        />
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another FAQ
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Previous</Button>
                <Button>Continue to Gallery</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle>Service Gallery</CardTitle>
                <CardDescription>Upload images and videos showcasing your work</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Service Thumbnail</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="mb-1 font-medium">Drag & drop your main image here</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      This will be the main image displayed in search results (JPG, PNG, 700x400px recommended)
                    </p>
                    <Button variant="secondary" size="sm">
                      Choose File
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Gallery Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((index) => (
                      <div key={index} className="relative aspect-video rounded-lg border overflow-hidden">
                        <Image
                          src={`/placeholder.svg?height=200&width=300&text=Image ${index}`}
                          alt={`Gallery image ${index}`}
                          fill
                          className="object-cover"
                        />
                        <button className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-black/80">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    <div className="border-2 border-dashed rounded-lg aspect-video flex flex-col items-center justify-center text-center p-4">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">Add more images (up to 8)</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        Upload
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload 3-8 high-quality images that showcase your service
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Video (Optional)</Label>
                    <span className="text-xs text-muted-foreground">Maximum 1 video, 75MB</span>
                  </div>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="mb-1 font-medium">Drag & drop your video here</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Add a short video introducing yourself or demonstrating your service (MP4 format, max 75MB)
                    </p>
                    <Button variant="secondary" size="sm">
                      Choose File
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-2 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800 dark:text-yellow-400">Gallery Tips</p>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      High-quality images significantly increase your chances of getting hired. Make sure your photos
                      are well-lit, professionally composed, and clearly showcase your work.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Previous</Button>
                <Button>Submit for Review</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
            </form>
          </Form>
        </div>
      </DashboardLayout>
    </ProfileCheck>
  )
}
