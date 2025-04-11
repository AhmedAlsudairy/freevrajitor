"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Paintbrush, PenTool, MessageSquare, FileText, Music, Video, Heart } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// Category data
const categories = [
  {
    id: "programming-tech",
    title: "Programming & Tech",
    icon: <Code className="h-12 w-12" />,
    description: "Web, mobile & software development, IT & networking",
    subcategories: ["Web Development", "Mobile Apps", "Desktop Software", "Game Development"],
  },
  {
    id: "graphics-design",
    title: "Graphics & Design",
    icon: <Paintbrush className="h-12 w-12" />,
    description: "Logo design, web design, art & illustration",
    subcategories: ["Logo Design", "Web Design", "Illustration", "Branding"],
  },
  {
    id: "writing-translation",
    title: "Writing & Translation",
    icon: <PenTool className="h-12 w-12" />,
    description: "Content writing, translation, transcription",
    subcategories: ["Articles & Blog Posts", "Translation", "Proofreading", "Creative Writing"],
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    icon: <MessageSquare className="h-12 w-12" />,
    description: "Social media, SEO, content marketing",
    subcategories: ["Social Media", "SEO", "Email Marketing", "PPC Advertising"],
  },
  {
    id: "business",
    title: "Business",
    icon: <FileText className="h-12 w-12" />,
    description: "Business plans, financial consulting, legal services",
    subcategories: ["Business Plans", "Financial Consulting", "Legal Consulting", "Virtual Assistant"],
  },
  {
    id: "music-audio",
    title: "Music & Audio",
    icon: <Music className="h-12 w-12" />,
    description: "Voice over, mixing & mastering, producers & composers",
    subcategories: ["Voice Over", "Mixing & Mastering", "Music Composition", "Sound Effects"],
  },
  {
    id: "video-animation",
    title: "Video & Animation",
    icon: <Video className="h-12 w-12" />,
    description: "Video editing, animation, motion graphics",
    subcategories: ["Video Editing", "Animation", "Motion Graphics", "Explainer Videos"],
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    icon: <Heart className="h-12 w-12" />,
    description: "Online tutoring, fitness, life coaching",
    subcategories: ["Online Tutoring", "Fitness Lessons", "Life Coaching", "Gaming"],
  },
]

// Translations
const translations = {
  en: {
    categories: {
      title: "Browse All Categories",
      subtitle: "Explore our wide range of services",
      subcategories: "Popular subcategories:",
      viewAll: "View All",
    },
  },
  ar: {
    categories: {
      title: "تصفح جميع الفئات",
      subtitle: "استكشف مجموعتنا الواسعة من الخدمات",
      subcategories: "الفئات الفرعية الشائعة:",
      viewAll: "عرض الكل",
    },
  },
}

export default function CategoriesPage() {
  const { language, direction } = useLanguage()
  const t = translations[language as keyof typeof translations].categories

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link href={`/categories/${category.id}`} key={category.id}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">{category.icon}</div>
                  <h2 className="text-xl font-semibold mb-2">{category.title}</h2>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  <div className="w-full">
                    <p className="text-sm font-medium mb-2">{t.subcategories}</p>
                    <ul className="text-sm text-muted-foreground">
                      {category.subcategories.map((subcategory, index) => (
                        <li key={index} className="mb-1">
                          {subcategory}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
