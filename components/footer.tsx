"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-muted">
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="font-bold text-xl">{t("app.name")}</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              {t("app.name")} connects businesses with talented freelancers offering services across hundreds of
              categories. Get work done efficiently and affordably.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm tracking-wide uppercase mb-4">{t("footer.categories")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/programming" className="text-muted-foreground hover:text-primary">
                  Programming & Tech
                </Link>
              </li>
              <li>
                <Link href="/categories/design" className="text-muted-foreground hover:text-primary">
                  Graphics & Design
                </Link>
              </li>
              <li>
                <Link href="/categories/writing" className="text-muted-foreground hover:text-primary">
                  Writing & Translation
                </Link>
              </li>
              <li>
                <Link href="/categories/marketing" className="text-muted-foreground hover:text-primary">
                  Digital Marketing
                </Link>
              </li>
              <li>
                <Link href="/categories/business" className="text-muted-foreground hover:text-primary">
                  Business
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary">
                  View All Categories
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm tracking-wide uppercase mb-4">{t("footer.about")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-muted-foreground hover:text-primary">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-muted-foreground hover:text-primary">
                  Press & News
                </Link>
              </li>
              <li>
                <Link href="/partnerships" className="text-muted-foreground hover:text-primary">
                  Partnerships
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm tracking-wide uppercase mb-4">{t("footer.support")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link href="/trust-safety" className="text-muted-foreground hover:text-primary">
                  Trust & Safety
                </Link>
              </li>
              <li>
                <Link href="/selling" className="text-muted-foreground hover:text-primary">
                  Selling on {t("app.name")}
                </Link>
              </li>
              <li>
                <Link href="/buying" className="text-muted-foreground hover:text-primary">
                  Buying on {t("app.name")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} {t("app.name")}. {t("footer.rights")}
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-muted-foreground hover:text-primary">
                Cookies Settings
              </Link>
              <Link href="/accessibility" className="text-muted-foreground hover:text-primary">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
