"use client"
import { createContext, useContext, useState, useEffect } from "react"
import type React from "react"

type Direction = "ltr" | "rtl"
type Language = "en" | "ar"

// Flatten the translations object for easier access
const translations = {
  en: {
    "app.name": "vrajitor",
    "nav.home": "Home",
    "nav.categories": "Categories",
    "nav.browse": "Browse Services",
    "nav.projects": "Projects",
    "nav.photographers": "Photographers",
    "nav.freelancers": "Freelancers",
    "nav.dashboard": "Dashboard",
    "nav.profile": "Profile",
    "nav.messages": "Messages",
    "nav.orders": "Orders",
    "nav.settings": "Settings",
    "nav.signin": "Sign In",
    "nav.join": "Join",
    "nav.logout": "Log out",
    "nav.bids": "My Bids",
    "nav.howItWorks": "How It Works",

    "home.hero.title": "Find the perfect freelance services for your business",
    "home.hero.subtitle": "Connect with talented freelancers and get your projects done efficiently and affordably.",
    "home.hero.search": "Search for any service...",
    "home.hero.button": "Search",

    "home.categories.title": "Browse Popular Categories",
    "home.categories.subtitle": "Find the service that fits your needs",

    "home.services.title": "Popular Services",
    "home.services.subtitle": "Most in-demand services by our customers",
    "home.services.viewAll": "View All",

    "home.how.title": "How It Works",
    "home.how.subtitle": "Get your project done in 3 easy steps",
    "home.how.step1.title": "Post a Project",
    "home.how.step1.description": "Create a project and describe what you need",
    "home.how.step2.title": "Get Proposals",
    "home.how.step2.description": "Receive proposals from talented freelancers",
    "home.how.step3.title": "Choose & Collaborate",
    "home.how.step3.description": "Select the best freelancer and start working",

    "home.cta.title": "Ready to get started?",
    "home.cta.subtitle":
      "Join thousands of freelancers and clients who are already using our platform to connect and collaborate.",
    "home.cta.client": "Join as a Client",
    "home.cta.freelancer": "Join as a Freelancer",

    "footer.categories": "Categories",
    "footer.about": "About",
    "footer.support": "Support",
    "footer.rights": "All rights reserved",

    "auth.signIn": "Sign In",
    "auth.signUp": "Sign Up",
    "auth.signOut": "Sign Out",
    "auth.signingIn": "Signing In...",
    "auth.signingOut": "Signing Out...",
    "auth.signingUp": "Signing Up...",
    "auth.signInDesc": "Sign in to access your account",
    "auth.signUpDesc": "Create an account to get started",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.fullName": "Full Name",
    "auth.username": "Username",
    "auth.accountType": "Account Type",
    "auth.client": "Client",
    "auth.freelancer": "Freelancer",
    "auth.confirmEmail": "Confirm Your Email",
    "auth.confirmEmailDesc": "A confirmation email has been sent",
    "auth.checkYourEmail": "Please check your email",
    "auth.emailSentTo": "A confirmation link has been sent to",
    "auth.clickLinkToConfirm": "Click the link in the email to confirm your account",
    "auth.backToSignIn": "Back to Sign In",

    "auth.confirmation.verifying": "Verifying...",
    "auth.confirmation.verifyingDescription": "Please wait while we verify your email...",
    "auth.confirmation.success": "Email Confirmed",
    "auth.confirmation.successDescription": "Your email has been successfully confirmed!",
    "auth.confirmation.failed": "Email Confirmation Failed",
    "auth.confirmation.invalidLink": "Invalid confirmation link",
    "auth.confirmation.genericError": "An error occurred during email confirmation",
    "auth.confirmation.signIn": "Sign In",
    "auth.confirmation.goHome": "Go Home",

    "auth.emailConfirmed.title": "Email Confirmed",
    "auth.emailConfirmed.description": "Your email has been successfully confirmed!",
    "auth.emailConfirmed.welcomeBack": "Welcome back!",
    "auth.emailConfirmed.accountReady": "Your account is ready to use!",
    "auth.emailConfirmed.readyToSignIn": "Your email has been confirmed. You're ready to sign in!",
    "auth.emailConfirmed.goDashboard": "Go to Dashboard",
    "auth.emailConfirmed.signIn": "Sign In",
  },
  ar: {
    "app.name": "فراجيتور",
    "nav.home": "الرئيسية",
    "nav.categories": "الفئات",
    "nav.browse": "تصفح الخدمات",
    "nav.projects": "المشاريع",
    "nav.photographers": "المصورين",
    "nav.freelancers": "المستقلين",
    "nav.dashboard": "لوحة التحكم",
    "nav.profile": "الملف الشخصي",
    "nav.messages": "الرسائل",
    "nav.orders": "الطلبات",
    "nav.settings": "الإعدادات",
    "nav.signin": "تسجيل الدخول",
    "nav.join": "انضم",
    "nav.logout": "تسجيل الخروج",
    "nav.bids": "عروضي",
    "nav.howItWorks": "كيف يعمل",

    "home.hero.title": "ابحث عن خدمات العمل الحر المثالية لعملك",
    "home.hero.subtitle": "تواصل مع المستقلين الموهوبين وأنجز مشاريعك بكفاءة وبأسعار معقولة.",
    "home.hero.search": "ابحث عن أي خدمة...",
    "home.hero.button": "بحث",

    "home.categories.title": "تصفح الفئات الشائعة",
    "home.categories.subtitle": "ابحث عن الخدمة التي تناسب احتياجاتك",

    "home.services.title": "الخدمات الشائعة",
    "home.services.subtitle": "الخدمات الأكثر طلبًا من قبل عملائنا",
    "home.services.viewAll": "عرض الكل",

    "home.how.title": "كيف يعمل",
    "home.how.subtitle": "أنجز مشروعك في 3 خطوات سهلة",
    "home.how.step1.title": "انشر مشروعًا",
    "home.how.step1.description": "أنشئ مشروعًا وصف ما تحتاجه",
    "home.how.step2.title": "احصل على عروض",
    "home.how.step2.description": "تلقى عروضًا من المستقلين الموهوبين",
    "home.how.step3.title": "اختر وتعاون",
    "home.how.step3.description": "اختر أفضل مستقل وابدأ العمل",

    "home.cta.title": "هل أنت مستعد للبدء؟",
    "home.cta.subtitle": "انضم إلى آلاف المستقلين والعملاء الذين يستخدمون منصتنا بالفعل للتواصل والتعاون.",
    "home.cta.client": "انضم كعميل",
    "home.cta.freelancer": "انضم كمستقل",

    "footer.categories": "الفئات",
    "footer.about": "حول",
    "footer.support": "الدعم",
    "footer.rights": "جميع الحقوق محفوظة",

    "auth.signIn": "تسجيل الدخول",
    "auth.signUp": "إنشاء حساب",
    "auth.signOut": "تسجيل الخروج",
    "auth.signingIn": "جاري تسجيل الدخول...",
    "auth.signingOut": "جاري تسجيل الخروج...",
    "auth.signingUp": "جاري التسجيل...",
    "auth.signInDesc": "سجل دخولك إلى حسابك",
    "auth.signUpDesc": "أنشئ حسابًا لتبدأ",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.fullName": "الاسم الكامل",
    "auth.username": "اسم المستخدم",
    "auth.accountType": "نوع الحساب",
    "auth.client": "عميل",
    "auth.freelancer": "مستقل",
    "auth.confirmEmail": "تأكيد بريدك الإلكتروني",
    "auth.confirmEmailDesc": "تم إرسال رسالة تأكيد إلى بريدك الإلكتروني",
    "auth.checkYourEmail": "يرجى التحقق من بريدك الإلكتروني",
    "auth.emailSentTo": "تم إرسال رابط التأكيد إلى",
    "auth.clickLinkToConfirm": "انقر فوق الرابط في البريد الإلكتروني لتأكيد حسابك",
    "auth.backToSignIn": "العودة إلى تسجيل الدخول",

    "auth.confirmation.verifying": "جارٍ التحقق...",
    "auth.confirmation.verifyingDescription": "الرجاء الانتظار بينما نقوم بالتحقق من بريدك الإلكتروني...",
    "auth.confirmation.success": "تم تأكيد البريد الإلكتروني",
    "auth.confirmation.successDescription": "تم تأكيد بريدك الإلكتروني بنجاح!",
    "auth.confirmation.failed": "فشل تأكيد البريد الإلكتروني",
    "auth.confirmation.invalidLink": "رابط تأكيد غير صالح",
    "auth.confirmation.genericError": "حدث خطأ أثناء تأكيد البريد الإلكتروني",
    "auth.confirmation.signIn": "تسجيل الدخول",
    "auth.confirmation.goHome": "العودة إلى الصفحة الرئيسية",

    "auth.emailConfirmed.title": "تم تأكيد البريد الإلكتروني",
    "auth.emailConfirmed.description": "تم تأكيد بريدك الإلكتروني بنجاح!",
    "auth.emailConfirmed.welcomeBack": "أهلًا بك مرة أخرى!",
    "auth.emailConfirmed.accountReady": "حسابك جاهز للاستخدام!",
    "auth.emailConfirmed.readyToSignIn": "تم تأكيد بريدك الإلكتروني. أنت جاهز لتسجيل الدخول!",
    "auth.emailConfirmed.goDashboard": "انتقل إلى لوحة التحكم",
    "auth.emailConfirmed.signIn": "تسجيل الدخول",
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  direction: Direction
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Try to get the language from localStorage, default to browser language or 'en'
  const [language, setLanguage] = useState<Language>("en")
  const [direction, setDirection] = useState<Direction>("ltr")

  useEffect(() => {
    // Check localStorage first
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
      setLanguage(savedLanguage)
    } else {
      // Check browser language
      const browserLang = navigator.language.split("-")[0]
      if (browserLang === "ar") {
        setLanguage("ar")
      }
    }
  }, [])

  useEffect(() => {
    // Set direction based on language
    setDirection(language === "ar" ? "rtl" : "ltr")

    // Save to localStorage
    localStorage.setItem("language", language)

    // Set HTML dir attribute
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = language
  }, [language])

  // Translation function - returns a string or the key if not found
  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, direction, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
