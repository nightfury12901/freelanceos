import { Navbar } from '@/components/landing/navbar'
import { HeroScrollytelling } from '@/components/landing/HeroScrollytelling'
import { Features } from '@/components/landing/features'
import { Pricing } from '@/components/landing/pricing'
import { Testimonials } from '@/components/landing/testimonials'
import { Footer } from '@/components/landing/footer'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroScrollytelling />
      <Features />
      <Pricing />
      <Testimonials />
      <Footer />
    </>
  )
}
