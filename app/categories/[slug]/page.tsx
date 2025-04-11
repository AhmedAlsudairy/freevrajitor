"use client"

import { AvatarFallback } from "@/components/ui/avatar"

import { AvatarImage } from "@/components/ui/avatar"

import { Avatar } from "@/components/ui/avatar"

import { useParams } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, Star, ChevronDown } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// Mock data for categories
const categoriesData = {
  "programming-tech": {
    title: "Programming & Tech",
    description: "Get expert help with coding, development, and technical tasks",
    subcategories: [
      { id: "web-dev", name: "Web Development" },
      { id: "mobile-dev", name: "Mobile Development" },
      { id: "desktop-dev", name: "Desktop Applications" },
      { id: "game-dev", name: "Game Development" },
      { id: "ai-ml", name: "AI & Machine Learning" },
      { id: "devops", name: "DevOps & Cloud" },
      { id: "qa-testing", name: "QA & Testing" },
      { id: "databases", name: "Databases" },
    ],
    items: [
      {
        id: 1,
        title: "I will develop a responsive website with React and Next.js",
        image: "/placeholder.svg?height=200&width=300",
        price: 150,
        rating: 4.9,
        reviews: 124,
        seller: "CodeMaster",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["React", "Next.js", "Responsive"],
      },
      {
        id: 2,
        title: "I will create a custom mobile app for iOS and Android",
        image: "/placeholder.svg?height=200&width=300",
        price: 300,
        rating: 4.8,
        reviews: 89,
        seller: "AppDeveloper",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Mobile", "iOS", "Android"],
      },
      {
        id: 3,
        title: "I will fix bugs in your JavaScript code",
        image: "/placeholder.svg?height=200&width=300",
        price: 50,
        rating: 4.7,
        reviews: 215,
        seller: "BugHunter",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["JavaScript", "Debugging", "Code Review"],
      },
      {
        id: 4,
        title: "I will build a custom WordPress website",
        image: "/placeholder.svg?height=200&width=300",
        price: 120,
        rating: 4.6,
        reviews: 178,
        seller: "WPMaster",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["WordPress", "Web Design", "CMS"],
      },
      {
        id: 5,
        title: "I will develop a RESTful API with Node.js",
        image: "/placeholder.svg?height=200&width=300",
        price: 100,
        rating: 4.8,
        reviews: 92,
        seller: "APIExpert",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Node.js", "API", "Backend"],
      },
      {
        id: 6,
        title: "I will create a database schema and optimize queries",
        image: "/placeholder.svg?height=200&width=300",
        price: 80,
        rating: 4.7,
        reviews: 64,
        seller: "DBWizard",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["SQL", "Database", "Optimization"],
      },
    ],
  },
  "graphics-design": {
    title: "Graphics & Design",
    description: "Find the perfect design services for your business",
    subcategories: [
      { id: "logo-design", name: "Logo Design" },
      { id: "web-design", name: "Web Design" },
      { id: "app-design", name: "App Design" },
      { id: "illustration", name: "Illustration" },
      { id: "branding", name: "Branding" },
      { id: "print-design", name: "Print Design" },
      { id: "packaging", name: "Packaging" },
      { id: "social-media", name: "Social Media Design" },
    ],
    items: [
      {
        id: 1,
        title: "I will design a professional logo for your business",
        image: "/placeholder.svg?height=200&width=300",
        price: 80,
        rating: 4.9,
        reviews: 342,
        seller: "LogoArtist",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Logo", "Branding", "Vector"],
      },
      {
        id: 2,
        title: "I will create custom illustrations for your project",
        image: "/placeholder.svg?height=200&width=300",
        price: 120,
        rating: 4.8,
        reviews: 156,
        seller: "IllustrationPro",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Illustration", "Digital Art", "Character Design"],
      },
      {
        id: 3,
        title: "I will design a modern UI for your website or app",
        image: "/placeholder.svg?height=200&width=300",
        price: 200,
        rating: 4.9,
        reviews: 98,
        seller: "UIDesigner",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["UI/UX", "Web Design", "App Design"],
      },
      {
        id: 4,
        title: "I will create social media graphics for your brand",
        image: "/placeholder.svg?height=200&width=300",
        price: 60,
        rating: 4.7,
        reviews: 211,
        seller: "SocialMediaArtist",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Social Media", "Instagram", "Facebook"],
      },
      {
        id: 5,
        title: "I will design a professional business card",
        image: "/placeholder.svg?height=200&width=300",
        price: 40,
        rating: 4.8,
        reviews: 187,
        seller: "PrintDesigner",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Business Card", "Print", "Branding"],
      },
      {
        id: 6,
        title: "I will create a custom packaging design",
        image: "/placeholder.svg?height=200&width=300",
        price: 150,
        rating: 4.9,
        reviews: 76,
        seller: "PackagePro",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Packaging", "Product Design", "3D Mockup"],
      },
    ],
  },
  "writing-translation": {
    title: "Writing & Translation",
    description: "Get your content written or translated by experts",
    subcategories: [
      { id: "articles-blog", name: "Articles & Blog Posts" },
      { id: "translation", name: "Translation" },
      { id: "proofreading", name: "Proofreading & Editing" },
      { id: "resume-cv", name: "Resume & Cover Letters" },
      { id: "creative-writing", name: "Creative Writing" },
      { id: "business-writing", name: "Business Writing" },
      { id: "technical-writing", name: "Technical Writing" },
      { id: "transcription", name: "Transcription" },
    ],
    items: [
      {
        id: 1,
        title: "I will write SEO-optimized blog posts and articles",
        image: "/placeholder.svg?height=200&width=300",
        price: 50,
        rating: 4.8,
        reviews: 231,
        seller: "ContentWriter",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["SEO", "Blog", "Content Writing"],
      },
      {
        id: 2,
        title: "I will translate your content from English to Arabic",
        image: "/placeholder.svg?height=200&width=300",
        price: 40,
        rating: 4.9,
        reviews: 178,
        seller: "TranslationPro",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Translation", "English", "Arabic"],
      },
      {
        id: 3,
        title: "I will proofread and edit your document",
        image: "/placeholder.svg?height=200&width=300",
        price: 30,
        rating: 4.7,
        reviews: 156,
        seller: "EditorExpert",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Proofreading", "Editing", "Grammar"],
      },
      {
        id: 4,
        title: "I will write a professional resume and cover letter",
        image: "/placeholder.svg?height=200&width=300",
        price: 60,
        rating: 4.8,
        reviews: 124,
        seller: "ResumeWriter",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Resume", "Cover Letter", "Job Application"],
      },
      {
        id: 5,
        title: "I will write creative short stories or fiction",
        image: "/placeholder.svg?height=200&width=300",
        price: 70,
        rating: 4.9,
        reviews: 87,
        seller: "CreativeAuthor",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Creative Writing", "Fiction", "Storytelling"],
      },
      {
        id: 6,
        title: "I will write technical documentation or manuals",
        image: "/placeholder.svg?height=200&width=300",
        price: 80,
        rating: 4.7,
        reviews: 65,
        seller: "TechWriter",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Technical Writing", "Documentation", "Manuals"],
      },
    ],
  },
  "digital-marketing": {
    title: "Digital Marketing",
    description: "Grow your business with expert digital marketing services",
    subcategories: [
      { id: "social-media", name: "Social Media Marketing" },
      { id: "seo", name: "Search Engine Optimization" },
      { id: "content-marketing", name: "Content Marketing" },
      { id: "email-marketing", name: "Email Marketing" },
      { id: "ppc", name: "PPC & Paid Advertising" },
      { id: "market-research", name: "Market Research" },
      { id: "influencer", name: "Influencer Marketing" },
      { id: "analytics", name: "Web Analytics" },
    ],
    items: [
      {
        id: 1,
        title: "I will manage your social media accounts",
        image: "/placeholder.svg?height=200&width=300",
        price: 200,
        rating: 4.8,
        reviews: 156,
        seller: "SocialMediaGuru",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Social Media", "Content Creation", "Community Management"],
      },
      {
        id: 2,
        title: "I will improve your website's SEO ranking",
        image: "/placeholder.svg?height=200&width=300",
        price: 150,
        rating: 4.9,
        reviews: 187,
        seller: "SEOExpert",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["SEO", "Keyword Research", "Backlinks"],
      },
      {
        id: 3,
        title: "I will create and manage Google Ads campaigns",
        image: "/placeholder.svg?height=200&width=300",
        price: 120,
        rating: 4.7,
        reviews: 98,
        seller: "PPCSpecialist",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Google Ads", "PPC", "SEM"],
      },
      {
        id: 4,
        title: "I will create an email marketing strategy",
        image: "/placeholder.svg?height=200&width=300",
        price: 100,
        rating: 4.8,
        reviews: 76,
        seller: "EmailMarketer",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Email Marketing", "Newsletters", "Automation"],
      },
      {
        id: 5,
        title: "I will conduct market research for your business",
        image: "/placeholder.svg?height=200&width=300",
        price: 180,
        rating: 4.9,
        reviews: 54,
        seller: "MarketAnalyst",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Market Research", "Competitor Analysis", "Consumer Insights"],
      },
      {
        id: 6,
        title: "I will set up Google Analytics and create reports",
        image: "/placeholder.svg?height=200&width=300",
        price: 80,
        rating: 4.7,
        reviews: 87,
        seller: "AnalyticsExpert",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Google Analytics", "Data Analysis", "Reporting"],
      },
    ],
  },
  business: {
    title: "Business",
    description: "Professional services to help your business grow",
    subcategories: [
      { id: "business-plans", name: "Business Plans" },
      { id: "financial-consulting", name: "Financial Consulting" },
      { id: "legal-consulting", name: "Legal Consulting" },
      { id: "virtual-assistant", name: "Virtual Assistant" },
      { id: "market-research", name: "Market Research" },
      { id: "business-tips", name: "Business Tips" },
      { id: "presentations", name: "Presentations" },
      { id: "career-advice", name: "Career Advice" },
    ],
    items: [
      {
        id: 1,
        title: "I will write a professional business plan",
        image: "/placeholder.svg?height=200&width=300",
        price: 200,
        rating: 4.9,
        reviews: 124,
        seller: "BusinessConsultant",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Business Plan", "Startup", "Entrepreneurship"],
      },
      {
        id: 2,
        title: "I will be your virtual assistant for administrative tasks",
        image: "/placeholder.svg?height=200&width=300",
        price: 25,
        rating: 4.8,
        reviews: 231,
        seller: "VirtualAssistantPro",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Virtual Assistant", "Admin Support", "Data Entry"],
      },
      {
        id: 3,
        title: "I will provide financial analysis and consulting",
        image: "/placeholder.svg?height=200&width=300",
        price: 150,
        rating: 4.9,
        reviews: 87,
        seller: "FinancialAdvisor",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Financial Analysis", "Consulting", "Budgeting"],
      },
      {
        id: 4,
        title: "I will create professional PowerPoint presentations",
        image: "/placeholder.svg?height=200&width=300",
        price: 60,
        rating: 4.7,
        reviews: 156,
        seller: "PresentationDesigner",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["PowerPoint", "Presentations", "Pitch Deck"],
      },
      {
        id: 5,
        title: "I will provide legal advice for your business",
        image: "/placeholder.svg?height=200&width=300",
        price: 100,
        rating: 4.8,
        reviews: 76,
        seller: "LegalAdvisor",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Legal Advice", "Contracts", "Business Law"],
      },
      {
        id: 6,
        title: "I will provide career coaching and resume review",
        image: "/placeholder.svg?height=200&width=300",
        price: 80,
        rating: 4.9,
        reviews: 98,
        seller: "CareerCoach",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Career Coaching", "Resume Review", "Interview Prep"],
      },
    ],
  },
  "music-audio": {
    title: "Music & Audio",
    description: "Find professional audio and music services",
    subcategories: [
      { id: "voice-over", name: "Voice Over" },
      { id: "mixing-mastering", name: "Mixing & Mastering" },
      { id: "producers-composers", name: "Producers & Composers" },
      { id: "singers-vocalists", name: "Singers & Vocalists" },
      { id: "session-musicians", name: "Session Musicians" },
      { id: "jingles", name: "Jingles & Intros" },
      { id: "sound-effects", name: "Sound Effects" },
      { id: "audio-editing", name: "Audio Editing" },
    ],
    items: [
      {
        id: 1,
        title: "I will record a professional voice over",
        image: "/placeholder.svg?height=200&width=300",
        price: 50,
        rating: 4.9,
        reviews: 231,
        seller: "VoiceArtist",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Voice Over", "Narration", "Commercial"],
      },
      {
        id: 2,
        title: "I will mix and master your music track",
        image: "/placeholder.svg?height=200&width=300",
        price: 80,
        rating: 4.8,
        reviews: 156,
        seller: "AudioEngineer",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Mixing", "Mastering", "Audio Production"],
      },
      {
        id: 3,
        title: "I will compose original music for your project",
        image: "/placeholder.svg?height=200&width=300",
        price: 120,
        rating: 4.9,
        reviews: 98,
        seller: "MusicComposer",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Composition", "Original Music", "Soundtrack"],
      },
      {
        id: 4,
        title: "I will sing vocals for your song",
        image: "/placeholder.svg?height=200&width=300",
        price: 70,
        rating: 4.7,
        reviews: 124,
        seller: "ProfessionalSinger",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Vocals", "Singing", "Backing Vocals"],
      },
      {
        id: 5,
        title: "I will create a custom jingle or intro",
        image: "/placeholder.svg?height=200&width=300",
        price: 60,
        rating: 4.8,
        reviews: 87,
        seller: "JingleCreator",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Jingle", "Intro", "Sound Logo"],
      },
      {
        id: 6,
        title: "I will create custom sound effects",
        image: "/placeholder.svg?height=200&width=300",
        price: 40,
        rating: 4.7,
        reviews: 76,
        seller: "SoundDesigner",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Sound Effects", "Foley", "Sound Design"],
      },
    ],
  },
  "video-animation": {
    title: "Video & Animation",
    description: "Bring your ideas to life with video and animation services",
    subcategories: [
      { id: "video-editing", name: "Video Editing" },
      { id: "animation", name: "Animation" },
      { id: "motion-graphics", name: "Motion Graphics" },
      { id: "explainer-videos", name: "Explainer Videos" },
      { id: "intros-outros", name: "Intros & Outros" },
      { id: "3d-animation", name: "3D Animation" },
      { id: "visual-effects", name: "Visual Effects" },
      { id: "video-ads", name: "Video Ads & Commercials" },
    ],
    items: [
      {
        id: 1,
        title: "I will edit your video professionally",
        image: "/placeholder.svg?height=200&width=300",
        price: 70,
        rating: 4.8,
        reviews: 187,
        seller: "VideoEditor",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Video Editing", "Post-Production", "Color Grading"],
      },
      {
        id: 2,
        title: "I will create a 2D animated explainer video",
        image: "/placeholder.svg?height=200&width=300",
        price: 150,
        rating: 4.9,
        reviews: 124,
        seller: "AnimationStudio",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["2D Animation", "Explainer Video", "Motion Graphics"],
      },
      {
        id: 3,
        title: "I will create a 3D animation or product visualization",
        image: "/placeholder.svg?height=200&width=300",
        price: 200,
        rating: 4.8,
        reviews: 98,
        seller: "3DArtist",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["3D Animation", "Product Visualization", "Rendering"],
      },
      {
        id: 4,
        title: "I will create motion graphics for your brand",
        image: "/placeholder.svg?height=200&width=300",
        price: 120,
        rating: 4.7,
        reviews: 156,
        seller: "MotionDesigner",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Motion Graphics", "After Effects", "Animation"],
      },
      {
        id: 5,
        title: "I will create a YouTube intro or outro",
        image: "/placeholder.svg?height=200&width=300",
        price: 50,
        rating: 4.9,
        reviews: 231,
        seller: "IntroMaker",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["YouTube", "Intro", "Outro"],
      },
      {
        id: 6,
        title: "I will create a promotional video ad",
        image: "/placeholder.svg?height=200&width=300",
        price: 180,
        rating: 4.8,
        reviews: 87,
        seller: "VideoProducer",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Video Ad", "Commercial", "Promotion"],
      },
    ],
  },
  lifestyle: {
    title: "Lifestyle",
    description: "Services to enhance your personal and professional life",
    subcategories: [
      { id: "online-tutoring", name: "Online Tutoring" },
      { id: "fitness-lessons", name: "Fitness Lessons" },
      { id: "life-coaching", name: "Life Coaching" },
      { id: "astrology", name: "Astrology & Psychics" },
      { id: "gaming", name: "Gaming" },
      { id: "arts-crafts", name: "Arts & Crafts" },
      { id: "relationship-advice", name: "Relationship Advice" },
      { id: "cooking-lessons", name: "Cooking Lessons" },
    ],
    items: [
      {
        id: 1,
        title: "I will be your personal fitness trainer",
        image: "/placeholder.svg?height=200&width=300",
        price: 40,
        rating: 4.9,
        reviews: 156,
        seller: "FitnessCoach",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Fitness", "Personal Training", "Workout Plans"],
      },
      {
        id: 2,
        title: "I will provide life coaching sessions",
        image: "/placeholder.svg?height=200&width=300",
        price: 60,
        rating: 4.8,
        reviews: 124,
        seller: "LifeCoach",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Life Coaching", "Personal Development", "Goal Setting"],
      },
      {
        id: 3,
        title: "I will teach you to cook delicious meals",
        image: "/placeholder.svg?height=200&width=300",
        price: 30,
        rating: 4.7,
        reviews: 187,
        seller: "ChefInstructor",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Cooking", "Recipes", "Culinary Skills"],
      },
      {
        id: 4,
        title: "I will tutor you in mathematics or science",
        image: "/placeholder.svg?height=200&width=300",
        price: 25,
        rating: 4.9,
        reviews: 231,
        seller: "MathTutor",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Tutoring", "Mathematics", "Science"],
      },
      {
        id: 5,
        title: "I will provide an astrology reading",
        image: "/placeholder.svg?height=200&width=300",
        price: 35,
        rating: 4.8,
        reviews: 98,
        seller: "Astrologer",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Astrology", "Horoscope", "Zodiac"],
      },
      {
        id: 6,
        title: "I will coach you in your favorite video game",
        image: "/placeholder.svg?height=200&width=300",
        price: 20,
        rating: 4.7,
        reviews: 156,
        seller: "GamingCoach",
        sellerImage: "/placeholder.svg?height=40&width=40",
        tags: ["Gaming", "Coaching", "eSports"],
      },
    ],
  },
}

// Translations for category pages
const translations = {
  en: {
    category: {
      filters: "Filters",
      sort: "Sort By",
      all: "All",
      price: "Price",
      delivery: "Delivery Time",
      rating: "Rating",
      level: "Seller Level",
      languages: "Languages",
      popular: "Popular Services",
      featured: "Featured Services",
      newest: "Newest",
      bestSelling: "Best Selling",
      highestRated: "Highest Rated",
      subcategories: "Subcategories",
      results: "results",
      from: "from",
      reviews: "reviews",
      startingAt: "Starting at",
    },
  },
  ar: {
    category: {
      filters: "تصفية",
      sort: "ترتيب حسب",
      all: "الكل",
      price: "السعر",
      delivery: "وقت التسليم",
      rating: "التقييم",
      level: "مستوى البائع",
      languages: "اللغات",
      popular: "الخدمات الشائعة",
      featured: "الخدمات المميزة",
      newest: "الأحدث",
      bestSelling: "الأكثر مبيعًا",
      highestRated: "الأعلى تقييمًا",
      subcategories: "الفئات الفرعية",
      results: "نتيجة",
      from: "من",
      reviews: "تقييمات",
      startingAt: "يبدأ من",
    },
  },
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const { t, language, direction } = useLanguage()
  const [activeSubcategory, setActiveSubcategory] = useState("all")

  // Get category data based on slug
  const categoryData = categoriesData[slug as keyof typeof categoriesData]

  if (!categoryData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold">Category not found</h1>
      </div>
    )
  }

  const { title, description, subcategories, items } = categoryData

  // Filter items based on active subcategory
  const filteredItems = activeSubcategory === "all" ? items : items.slice(0, 3) // Just for demo purposes

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-1/4">
          <div className="sticky top-20">
            <div className="bg-background rounded-lg border p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">{translations[language].category.filters}</h3>
                <Filter className="h-4 w-4" />
              </div>

              {/* Subcategories */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">{translations[language].category.subcategories}</h4>
                <div className="space-y-2">
                  <div
                    className={`cursor-pointer p-2 rounded-md ${activeSubcategory === "all" ? "bg-primary/10 text-primary" : "hover:bg-accent"}`}
                    onClick={() => setActiveSubcategory("all")}
                  >
                    {translations[language].category.all}
                  </div>
                  {subcategories.map((subcategory) => (
                    <div
                      key={subcategory.id}
                      className={`cursor-pointer p-2 rounded-md ${activeSubcategory === subcategory.id ? "bg-primary/10 text-primary" : "hover:bg-accent"}`}
                      onClick={() => setActiveSubcategory(subcategory.id)}
                    >
                      {subcategory.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">{translations[language].category.price}</h4>
                <div className="space-y-2">
                  <div className="cursor-pointer p-2 rounded-md hover:bg-accent">$5 - $50</div>
                  <div className="cursor-pointer p-2 rounded-md hover:bg-accent">$50 - $100</div>
                  <div className="cursor-pointer p-2 rounded-md hover:bg-accent">$100 - $200</div>
                  <div className="cursor-pointer p-2 rounded-md hover:bg-accent">$200+</div>
                </div>
              </div>

              {/* Delivery Time */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">{translations[language].category.delivery}</h4>
                <div className="space-y-2">
                  <div className="cursor-pointer p-2 rounded-md hover:bg-accent">24 hours</div>
                  <div className="cursor-pointer p-2 rounded-md hover:bg-accent">3 days</div>
                  <div className="cursor-pointer p-2 rounded-md hover:bg-accent">7 days</div>
                  <div className="cursor-pointer p-2 rounded-md hover:bg-accent">Anytime</div>
                </div>
              </div>

              {/* Seller Level */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">{translations[language].category.level}</h4>
                <div className="space-y-2">
                  <div className="cursor-pointer p-2 rounded-md hover:bg-accent">Top Rated</div>
                  <div className="cursor-pointer p-2 rounded-md hover:bg-accent">Level 2</div>
                  <div className="cursor-pointer p-2 rounded-md hover:bg-accent">Level 1</div>
                  <div className="cursor-pointer p-2 rounded-md hover:bg-accent">New Seller</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {/* Sorting and Results */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <p className="text-muted-foreground">
                {filteredItems.length} {translations[language].category.results}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">{translations[language].category.sort}:</span>
              <Button variant="outline" size="sm" className="h-8">
                {translations[language].category.bestSelling} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Link href={`/services/${item.id}`} key={item.id}>
                <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative aspect-video">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={item.sellerImage} alt={item.seller} />
                        <AvatarFallback>{item.seller.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{item.seller}</span>
                    </div>
                    <h3 className="font-medium line-clamp-2 mb-2">{item.title}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{item.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({item.reviews} {translations[language].category.reviews})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">{translations[language].category.startingAt}</div>
                      <div className="font-bold">${item.price}</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
