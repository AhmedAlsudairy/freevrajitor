"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, Code, Paintbrush, PenTool, MessageSquare, FileText, Music, Video, CheckCircle } from "lucide-react"
import CategoryCard from "@/components/category-card"
import PopularServices from "@/components/popular-services"
import HowItWorks from "@/components/how-it-works"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const { t, direction } = useLanguage()
  const { toast } = useToast()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if the URL contains email_verified parameter (coming from auth callback)
    const emailVerified = searchParams.get("email_verified") === "true"
    
    if (emailVerified) {
      // Show a toast notification for email verification
      toast({
        title: "Email Verified Successfully!",
        description: "Your email has been verified and your account is now active.",
        variant: "default",
        duration: 5000,
        action: <CheckCircle className="h-5 w-5 text-green-500" />
      })
    }
  }, [searchParams, toast])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-100 to-white dark:from-slate-900 dark:to-slate-800 py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  {t("home.hero.title")}
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  {t("home.hero.subtitle")}
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <div className="relative w-full">
                  <Search
                    className={`absolute ${direction === "rtl" ? "right-2.5" : "left-2.5"} top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400`}
                  />
                  <input
                    type="search"
                    placeholder={t("home.hero.search")}
                    className={`flex h-10 w-full rounded-md border border-input bg-background py-2 ${direction === "rtl" ? "pr-8" : "pl-8"} text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                  />
                </div>
                <Button className="w-full min-[400px]:w-auto">{t("home.hero.button")}</Button>
              </div>
            </div>
            <div className="mx-auto max-w-full">
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=500&width=600"
                  width={600}
                  height={500}
                  alt="Hero Image"
                  className="aspect-[4/3] object-cover w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-12 px-4 md:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("home.categories.title")}</h2>
            <p className="text-muted-foreground">{t("home.categories.subtitle")}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            <CategoryCard icon={<Code className="h-8 w-8" />} title="Programming & Tech" count={4502} />
            <CategoryCard icon={<Paintbrush className="h-8 w-8" />} title="Graphics & Design" count={3241} />
            <CategoryCard icon={<PenTool className="h-8 w-8" />} title="Writing & Translation" count={2198} />
            <CategoryCard icon={<MessageSquare className="h-8 w-8" />} title="Digital Marketing" count={1876} />
            <CategoryCard icon={<FileText className="h-8 w-8" />} title="Business" count={1543} />
            <CategoryCard icon={<Music className="h-8 w-8" />} title="Music & Audio" count={985} />
            <CategoryCard icon={<Video className="h-8 w-8" />} title="Video & Animation" count={1245} />
            <CategoryCard icon={<PenTool className="h-8 w-8" />} title="Lifestyle" count={872} />
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <PopularServices />

      {/* How it Works */}
      <HowItWorks />

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("home.cta.title")}</h2>
          <p className="mb-8 max-w-2xl mx-auto">{t("home.cta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/sign-up?type=client">{t("home.cta.client")}</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-transparent border-white hover:bg-white hover:text-primary"
              asChild
            >
              <Link href="/sign-up?type=freelancer">{t("home.cta.freelancer")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
