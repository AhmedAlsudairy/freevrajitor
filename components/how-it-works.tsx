"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Search, FileCheck, CreditCard } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function HowItWorks() {
  const { t } = useLanguage()

  return (
    <section className="py-12 px-4 md:py-16 lg:py-20">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("home.how.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("home.how.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("home.how.step1.title")}</h3>
            <p className="text-muted-foreground">{t("home.how.step1.description")}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FileCheck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("home.how.step2.title")}</h3>
            <p className="text-muted-foreground">{t("home.how.step2.description")}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("home.how.step3.title")}</h3>
            <p className="text-muted-foreground">{t("home.how.step3.description")}</p>
          </div>
        </div>
        <div className="text-center mt-10">
          <Button size="lg" asChild>
            <Link href="/explore">Find Services</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
