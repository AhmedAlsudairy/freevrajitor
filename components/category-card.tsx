import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface CategoryCardProps {
  icon: React.ReactNode
  title: string
  count: number
}

export default function CategoryCard({ icon, title, count }: CategoryCardProps) {
  // Convert title to slug
  const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "")

  return (
    <Link href={`/categories/${slug}`}>
      <Card className="transition-all hover:shadow-md">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">{icon}</div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{count.toLocaleString()} services</p>
        </CardContent>
      </Card>
    </Link>
  )
}
