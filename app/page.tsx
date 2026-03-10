import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { ValueProps } from '@/components/ValueProps'
import { FeaturedBrands } from '@/components/FeaturedBrands'
import { CategoryGrid } from '@/components/CategoryGrid'
import { FeaturedDeals } from '@/components/FeaturedDeals'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ValueProps />
        <FeaturedBrands />
        <CategoryGrid />
        <FeaturedDeals />
      </main>
      <Footer />
    </div>
  )
}
