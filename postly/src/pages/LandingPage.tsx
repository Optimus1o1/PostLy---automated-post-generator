import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Link } from "@tanstack/react-router"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col scroll-smooth">
      {/* ── STICKY NAVBAR with Glassmorphism ── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-3 flex items-center justify-between border-b border-white/40 bg-white/70 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-[#FF7A45] to-[#FF5722] rounded-xl flex items-center justify-center shadow-lg shadow-orange-200/50">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-xl text-[#1A1A1A] tracking-tight">Postly</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <a href="#how-it-works" className="text-[#888] hover:text-[#1A1A1A] transition-colors duration-200">How it works</a>
          <a href="#pricing" className="text-[#888] hover:text-[#1A1A1A] transition-colors duration-200">Pricing</a>
          <a href="#faq" className="text-[#888] hover:text-[#1A1A1A] transition-colors duration-200">FAQ</a>
        </nav>
        <div className="flex gap-3">
          <Link to="/login">
            <Button variant="ghost" className="text-[#666] hover:text-[#1A1A1A] font-medium">Log in</Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-gradient-to-r from-[#FF7A45] to-[#FF5722] hover:from-[#E66A35] hover:to-[#E64A19] text-white rounded-xl px-5 shadow-md shadow-orange-200/40 hover:shadow-lg hover:shadow-orange-200/60 transition-all duration-300 hover:-translate-y-0.5">Get started</Button>
          </Link>
        </div>
      </header>

      {/* Spacer to offset the fixed header */}
      <div className="h-16" />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-28 pb-20 px-6 text-center max-w-5xl mx-auto flex flex-col items-center overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />

          <div className="relative z-10 flex flex-col items-center">
            <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-200/60 bg-white/80 backdrop-blur-sm text-sm mb-8 text-[#666] shadow-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>AI generated captions + images, ready to post</span>
            </div>
            
            <h1 className="animate-fade-up text-5xl sm:text-6xl md:text-[76px] font-extrabold tracking-tight mb-6 text-[#1A1A1A] leading-[1.08]" style={{ animationDelay: '0.1s' }}>
              30 days of social media<br/>posts. <span className="text-gradient">In 5 minutes.</span>
            </h1>
            
            <p className="animate-fade-up text-lg md:text-xl text-[#555] mb-10 max-w-2xl leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Tell us about your business. We’ll write your captions, design your images, and 
              hand you a ready-to-publish content calendar — built for Indian businesses & creators.
            </p>
            
            <div className="animate-fade-up flex flex-col sm:flex-row gap-4 mb-6" style={{ animationDelay: '0.3s' }}>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-[#FF7A45] to-[#FF5722] hover:from-[#E66A35] hover:to-[#E64A19] text-white px-10 py-6 rounded-2xl text-[17px] font-semibold shadow-lg shadow-orange-300/30 glow-orange transition-all duration-300 hover:-translate-y-1">
                  Generate my calendar — free
                </Button>
              </Link>
              <a href="#pricing">
                <Button variant="outline" className="px-10 py-6 rounded-2xl text-[17px] font-medium border-gray-200 text-[#1A1A1A] hover:bg-white/80 hover:border-gray-300 transition-all duration-300">
                  See pricing
                </Button>
              </a>
            </div>
            
            <p className="animate-fade-up text-sm text-[#999]" style={{ animationDelay: '0.4s' }}>No credit card required for free 7-day sample</p>

            {/* Social Proof Stats */}
            <div className="animate-fade-up mt-16 flex flex-wrap justify-center gap-12 text-center" style={{ animationDelay: '0.5s' }}>
              <div>
                <p className="text-3xl font-bold text-[#1A1A1A]">500+</p>
                <p className="text-sm text-[#888] mt-1">Calendars generated</p>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <p className="text-3xl font-bold text-[#1A1A1A]">15,000+</p>
                <p className="text-sm text-[#888] mt-1">Posts created</p>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <p className="text-3xl font-bold text-[#1A1A1A]">4.9/5</p>
                <p className="text-sm text-[#888] mt-1">User rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-[#1A1A1A]">How it works</h2>
          <p className="text-xl text-[#666666] mb-16">Three steps to a month of content.</p>
          
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {/* Step 1 */}
            <div className="border border-gray-100 rounded-3xl p-10 bg-white shadow-sm card-hover">
              <div className="w-14 h-14 mb-8 flex items-center justify-center text-[#FF7A45] bg-orange-50 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#1A1A1A]">1. Tell us your brand</h3>
              <p className="text-[#666] leading-relaxed">
                Business name, niche, tone, audience. Save it once and reuse for every campaign.
              </p>
            </div>

            {/* Step 2 */}
            <div className="border border-gray-100 rounded-3xl p-10 bg-white shadow-sm card-hover">
              <div className="w-14 h-14 mb-8 flex items-center justify-center text-[#FF7A45] bg-orange-50 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#1A1A1A]">2. AI builds your calendar</h3>
              <p className="text-[#666] leading-relaxed">
                Captions, hashtags, post types, AND on-brand images for every single day.
              </p>
            </div>

            {/* Step 3 */}
            <div className="border border-gray-100 rounded-3xl p-10 bg-white shadow-sm card-hover">
              <div className="w-14 h-14 mb-8 flex items-center justify-center text-[#FF7A45] bg-orange-50 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#1A1A1A]">3. Edit & export</h3>
              <p className="text-[#666666] leading-relaxed">
                Tweak any post, then download as CSV for Meta Business Suite or post directly (coming soon).
              </p>
            </div>
          </div>
        </section>

        {/* REAL POSTS SECTION */}
        <section className="py-24 px-6 max-w-6xl mx-auto border-t border-gray-100">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left side: Text and Checklist */}
            <div className="text-left">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-[#1A1A1A]">
                Not just ideas. <span className="text-[#FF7A45]">Real posts.</span>
              </h2>
              <p className="text-lg text-[#666666] mb-8 leading-relaxed">
                Most "AI calendars" give you topic ideas. Postly hands you the finished post — caption, hashtags, and a generated image — for every day of the month.
              </p>
              <ul className="space-y-4">
                {[
                  "Platform-aware captions for Instagram, LinkedIn, Facebook, X",
                  "AI-generated images on-brand with your colour & logo",
                  "Indian festivals & seasonality baked in",
                  "Inline editing + one-click regeneration per post",
                  "CSV export ready for Meta Business Suite"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#1A1A1A]">
                    <svg className="w-6 h-6 text-green-500 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right side: Post Preview Card */}
            <div className="border border-gray-100 rounded-3xl p-6 bg-white shadow-lg relative">
              <div className="flex items-center gap-2 text-xs text-[#888888] font-medium mb-4 uppercase tracking-wider">
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                Generated post preview
              </div>
              
              {/* Image Placeholder */}
              <div className="aspect-square bg-[#FFDDC1] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-16 h-16 text-[#FF7A45]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              </div>

              {/* Post Content */}
              <div className="space-y-4">
                <p className="text-[#1A1A1A] leading-relaxed">
                  "Monsoon menu drop! ☔ Try our masala chai with hot pakoras — only this week. #Pune #Monsoon"
                </p>
                <p className="text-[#888888] text-sm">
                  #chai #pune #foodie #monsoon
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-24 px-6 text-center max-w-5xl mx-auto border-t">
          <h2 className="text-4xl font-bold tracking-tight mb-4 text-[#1A1A1A]">Simple pricing</h2>
          <p className="text-xl text-[#666666] mb-16">Start free. Upgrade when you're ready.</p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {/* Free Tier */}
            <div className="border border-gray-100 rounded-3xl p-10 bg-white shadow-sm">
              <h3 className="text-2xl font-bold mb-2 text-[#1A1A1A]">Free</h3>
              <div className="text-5xl font-bold mb-4 text-[#1A1A1A]">₹0</div>
              <p className="text-[#666666] mb-10">One 7-day sample calendar</p>
              <Button variant="outline" className="w-full py-6 rounded-xl text-md font-semibold border-gray-200">Try free</Button>
            </div>

            {/* Starter Tier */}
            <div className="border-2 border-[#FF7A45] rounded-3xl p-10 bg-white relative shadow-xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FF7A45] text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
                Most popular
              </div>
              <h3 className="text-2xl font-bold mb-2 text-[#1A1A1A]">Starter</h3>
              <div className="text-5xl font-bold mb-2 text-[#1A1A1A]">₹999<span className="text-lg text-[#666666] font-normal">/month</span></div>
              <p className="text-[#666666] mb-10 mt-4">Unlimited 30-day calendars + images</p>
              <Button className="w-full bg-[#FF7A45] hover:bg-[#E66A35] text-white py-6 rounded-xl text-md font-semibold">Get Starter</Button>
            </div>

            {/* One-Off */}
            <div className="border border-gray-100 rounded-3xl p-10 bg-white shadow-sm">
              <h3 className="text-2xl font-bold mb-2 text-[#1A1A1A]">One-off</h3>
              <div className="text-5xl font-bold mb-4 text-[#1A1A1A]">₹500</div>
              <p className="text-[#666666] mb-10">Single 15-day campaign</p>
              <Button variant="outline" className="w-full py-6 rounded-xl text-md font-semibold border-gray-200">Buy credit</Button>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-24 px-6 max-w-3xl mx-auto border-t">
          <h2 className="text-4xl font-bold tracking-tight mb-4 text-[#1A1A1A] text-center">Frequently Asked Questions</h2>
          <p className="text-xl text-[#666666] mb-12 text-center">Everything you need to know about Postly.</p>
          
          <Accordion type="single" collapsible className="w-full text-left">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold text-[#1A1A1A]">Is it really free?</AccordionTrigger>
              <AccordionContent className="text-[#666666] text-base leading-relaxed">
                Yes! You can generate a 7-day sample content calendar absolutely free. No credit card required. 
                This lets you test our AI and see if the brand voice and content style matches your expectations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold text-[#1A1A1A]">Does it automatically post to my accounts?</AccordionTrigger>
              <AccordionContent className="text-[#666666] text-base leading-relaxed">
                Currently, Postly generates your entire calendar and allows you to download it as a highly-formatted CSV. 
                You can upload this directly into Meta Business Suite to schedule a whole month of posts at once. 
                Direct auto-posting via API is coming soon!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold text-[#1A1A1A]">How does the AI know what to write?</AccordionTrigger>
              <AccordionContent className="text-[#666666] text-base leading-relaxed">
                When you create a "Brand Profile", we ask you for your business name, niche, target audience, 
                and specific brand voice (e.g., Professional, Humorous, Educational). Our AI engine uses these 
                exact guidelines to ensure every post sounds like you.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold text-[#1A1A1A]">What social platforms do you support?</AccordionTrigger>
              <AccordionContent className="text-[#666666] text-base leading-relaxed">
                Our AI can generate highly optimized content specifically tailored for Instagram (Reels, Carousels, Static posts), 
                LinkedIn, Facebook, and Twitter. It understands the unique requirements and character limits for each.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="py-20 px-6 bg-gradient-to-br from-[#FF7A45] to-[#FF5722] text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ready to level up your content?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">Join thousands of Indian businesses and creators who save hours every week with Postly.</p>
          <Link to="/signup">
            <Button className="bg-white text-[#FF7A45] hover:bg-gray-100 px-10 py-6 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">Start for free →</Button>
          </Link>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1A1A1A] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-[#FF7A45] to-[#FF5722] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="font-bold text-xl">Postly</span>
              </div>
              <p className="text-[#888] text-sm leading-relaxed">AI-powered content calendars for Indian businesses and creators.</p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-[#666]">Product</h4>
              <ul className="space-y-3 text-sm text-[#AAA]">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-[#666]">Company</h4>
              <ul className="space-y-3 text-sm text-[#AAA]">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-[#666]">Legal</h4>
              <ul className="space-y-3 text-sm text-[#AAA]">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#333] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#666]">© {new Date().getFullYear()} Postly. All rights reserved.</p>
            <p className="text-sm text-[#666]">Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
