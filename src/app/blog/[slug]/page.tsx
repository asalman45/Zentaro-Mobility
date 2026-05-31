import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock, ChevronRight, Zap } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloating } from "@/components/layout/WhatsAppFloating";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  bodyHtml: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
}

const staticPosts: Record<string, BlogPost> = {
  "is-electric-bike-saving-money-pakistan": {
    slug: "is-electric-bike-saving-money-pakistan",
    title: "Is Switching to an Electric Bike Worth It in Pakistan in 2026?",
    excerpt: "With petrol prices hovering around Rs 270+ per litre, we run down the exact numbers to see how fast a ZENTARO EV pays for itself.",
    category: "Financing & Savings",
    author: "ZENTARO Tech Labs",
    date: "May 29, 2026",
    readTime: "4 min read",
    bodyHtml: `
      <p class="text-base leading-relaxed text-muted mb-6">
        Pakistan has seen unprecedented volatility in fuel costs over the past few years. For an average commuter riding 45 km a day on a standard 70cc/125cc petrol motorcycle, fuel bills easily cross <strong>Rs 15,000 to Rs 22,000 every single month</strong>. When you add engine oil changes, spark plugs, filters, and periodic tuning, you are bleeding hard-earned money.
      </p>

      <h3 class="text-lg font-bold text-white mt-8 mb-4 uppercase tracking-wide">The Electrical Formula</h3>
      <p class="text-sm leading-relaxed text-muted mb-4">
        Let's look at the electrical equivalent. A ZENTARO electric bike uses a 72V 40Ah battery, which translates to a total capacity of <strong>2.88 kWh</strong>:
      </p>
      <div class="p-4 bg-black border border-border rounded-xl text-center font-mono text-white text-xs mb-6">
        Capacity = (72V * 40Ah) / 1000 = 2.88 kWh
      </div>

      <p class="text-sm leading-relaxed text-muted mb-4">
        At an average domestic electricity utility tariff of <strong>Rs 50 per unit (kWh)</strong>, a single full charge costs:
      </p>
      <div class="p-4 bg-black border border-border rounded-xl text-center font-mono text-white text-xs mb-6">
        Cost = 2.88 kWh * Rs 50 = Rs 144
      </div>

      <p class="text-sm leading-relaxed text-muted mb-6">
        This single charge powers a 120 km commute. That is a charging cost of <strong>Rs 1.20 per km</strong> compared to <strong>Rs 6.50+ per km</strong> on a traditional petrol motorcycle!
      </p>

      <h3 class="text-lg font-bold text-white mt-8 mb-4 uppercase tracking-wide">Return on Investment (ROI)</h3>
      <p class="text-sm leading-relaxed text-muted mb-6">
        Within 12 to 14 months of daily riding, the initial cost difference of purchasing an electric vehicle is completely recouped, leading to pure monthly savings. Switch to cleaner, cheaper, and hassle-free urban commutes today.
      </p>
    `,
  },
  "lfp-vs-graphene-which-battery-to-choose": {
    slug: "lfp-vs-graphene-which-battery-to-choose",
    title: "LFP vs Graphene Batteries: Which ZENTARO Variant is Best for You?",
    excerpt: "Unpacking the chemistry, cycle life, thermal safety, and pricing of LFP vs Graphene batteries to help you choose the right fit.",
    category: "Tech & Battery",
    author: "Product Engineering Team",
    date: "May 27, 2026",
    readTime: "6 min read",
    bodyHtml: `
      <p class="text-base leading-relaxed text-muted mb-6">
        Choosing the right battery chemistry is the most important decision when purchasing your electric two-wheeler. Let's unpack the core differences between LFP and Graphene cells.
      </p>

      <h3 class="text-lg font-bold text-white mt-8 mb-4 uppercase tracking-wide">1. Lithium Iron Phosphate (LFP) - The Gold Standard</h3>
      <p class="text-sm leading-relaxed text-muted mb-4">
        LFP batteries represent the absolute pinnacle of vehicle safety. Unlike traditional Lithium-Ion (NMC) batteries found in smartphones, LFP batteries do not undergo thermal runaway and cannot catch fire in hot temperatures.
      </p>
      <ul class="list-disc list-inside text-sm leading-relaxed text-muted space-y-2 pl-4 mb-6">
        <li><strong>Life Expectancy:</strong> 8+ Years (2500+ charge cycles)</li>
        <li><strong>Safety:</strong> High thermal stability (certified waterproof IP67)</li>
        <li><strong>Warranty:</strong> 36 to 48 Months comprehensive</li>
      </ul>

      <h3 class="text-lg font-bold text-white mt-8 mb-4 uppercase tracking-wide">2. Graphene Batteries - The Budget Commuter</h3>
      <p class="text-sm leading-relaxed text-muted mb-4">
        Graphene batteries are advanced lead-acid structures reinforced with graphene sheets, boosting energy density, charge rate capability, and lifetime cycles.
      </p>
      <ul class="list-disc list-inside text-sm leading-relaxed text-muted space-y-2 pl-4 mb-6">
        <li><strong>Life Expectancy:</strong> 3 Years (800 charge cycles)</li>
        <li><strong>Upfront Cost:</strong> ~Rs 100,000 cheaper than LFP</li>
        <li><strong>Warranty:</strong> 12 to 18 Months</li>
      </ul>

      <h3 class="text-lg font-bold text-white mt-8 mb-4 uppercase tracking-wide">The Verdict</h3>
      <p class="text-sm leading-relaxed text-muted mb-6">
        If you ride long distances daily and want zero battery degradation hassle for a decade, <strong>LFP is the clear winner</strong>. If you are looking for a low upfront entry cost for short neighborhood runs, <strong>Graphene is a highly cost-effective</strong> value.
      </p>
    `,
  },
  "pave-scheme-explained": {
    slug: "pave-scheme-explained",
    title: "PAVE Scheme Explained: Get Rs 80,000 Off Your Electric Bike",
    excerpt: "Pakistan's new EV subsidy program is here. Here's how to qualify and apply in under 10 minutes.",
    category: "Policy",
    author: "ZENTARO Policy Division",
    date: "May 12, 2026",
    readTime: "3 min read",
    bodyHtml: `
      <p class="text-base leading-relaxed text-muted mb-6">
        The Government of Pakistan has officially launched the PAVE EV subsidy program to encourage commuters to switch to electric mobility. Under this program, eligible buyers can receive a direct discount of <strong>Rs 80,000</strong> on certified electric two-wheelers.
      </p>
      <h3 class="text-lg font-bold text-white mt-8 mb-4 uppercase tracking-wide">How to Qualify</h3>
      <p class="text-sm leading-relaxed text-muted mb-4">
        To be eligible for the PAVE subsidy, applicants must meet the following criteria:
      </p>
      <ul class="list-disc list-inside text-sm leading-relaxed text-muted space-y-2 pl-4 mb-6">
        <li>Must hold a valid CNIC with Pakistani citizenship.</li>
        <li>One subsidy registration permitted per CNIC.</li>
        <li>Active registration through the certified dealer portal.</li>
      </ul>
      <p class="text-sm leading-relaxed text-muted mb-6">
        ZENTARO handles all processing automatically when you reserve your bike, ensuring you secure the Rs 80,000 PAVE discount instantly at delivery!
      </p>
    `,
  },
  "petrol-vs-electric-2026": {
    slug: "petrol-vs-electric-2026",
    title: "Petrol vs Electric in 2026: The Real Numbers",
    excerpt: "We tracked a Honda CD70 and a Zentaro Bolt for 90 days. The savings are bigger than you think.",
    category: "Comparison",
    author: "ZENTARO Commute Lab",
    date: "April 28, 2026",
    readTime: "5 min read",
    bodyHtml: `
      <p class="text-base leading-relaxed text-muted mb-6">
        To understand the real-world financial implications of shifting from petrol to electric, we tracked two riders traveling the same 40 km daily commute route in Karachi over a 90-day period.
      </p>
      <h3 class="text-lg font-bold text-white mt-8 mb-4 uppercase tracking-wide">Real Savings Log</h3>
      <p class="text-sm leading-relaxed text-muted mb-4">
        Our tracking log revealed massive economic benefits for the ZENTARO EV:
      </p>
      <ul class="list-disc list-inside text-sm leading-relaxed text-muted space-y-2 pl-4 mb-6">
        <li><strong>Honda CD70 Fuel Cost:</strong> Rs 24,800 total fuel consumed.</li>
        <li><strong>Zentaro Bolt charging Cost:</strong> Rs 3,920 total electricity consumed.</li>
        <li><strong>Net Savings:</strong> Over Rs 20,800 saved in a single quarter!</li>
      </ul>
      <p class="text-sm leading-relaxed text-muted mb-6">
        In addition, the petrol bike required three oil changes and engine tuning, incurring another Rs 3,500 in maintenance, while the Bolt had zero maintenance downtime.
      </p>
    `,
  },
  "lfp-battery-care": {
    slug: "lfp-battery-care",
    title: "LFP Battery Care: Make It Last 15 Years",
    excerpt: "Five simple habits that protect your battery and keep range at 100% for over a decade.",
    category: "Tips",
    author: "Battery Safety Group",
    date: "April 15, 2026",
    readTime: "4 min read",
    bodyHtml: `
      <p class="text-base leading-relaxed text-muted mb-6">
        Lithium Iron Phosphate (LFP) cells are extremely robust and hold up to 3000 charge cycles. With proper care habits, you can extend the battery service life to over 15 years.
      </p>
      <h3 class="text-lg font-bold text-white mt-8 mb-4 uppercase tracking-wide">Five Essential Tips</h3>
      <ol class="list-decimal list-inside text-sm leading-relaxed text-muted space-y-2 pl-4 mb-6">
        <li><strong>Avoid Deep Discharge:</strong> Try not to let the charge drop below 10% consistently.</li>
        <li><strong>Charge Regularly:</strong> LFP battery packs thrive when kept between 20% and 90%.</li>
        <li><strong>Cool Charging environment:</strong> Charge in a ventilated shade, away from direct sunlight.</li>
        <li><strong>Use Original Chargers:</strong> Always rely on the built-in smart BMS charger to avoid voltage surges.</li>
        <li><strong>Storage Charge:</strong> If storing the vehicle for a month, leave the battery state at 50%.</li>
      </ol>
    `,
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = staticPosts[slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-10 pb-24 text-xs font-semibold text-muted">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          
          {/* Header actions */}
          <div className="flex items-center space-x-2 text-xs text-muted mb-6">
            <Link href="/blog" className="hover:text-white flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Back to Blog
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-volt">{post.category}</span>
          </div>

          <article className="space-y-6">
            <h1 className="font-display text-3xl sm:text-5xl font-black text-white leading-tight">
              {post.title}
            </h1>

            {/* Meta bar */}
            <div className="flex flex-wrap items-center gap-4 py-4 border-y border-border text-[10px] text-muted">
              <span className="flex items-center">
                <User className="w-3.5 h-3.5 mr-1.5 text-volt" />
                By {post.author}
              </span>
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-volt" />
                {post.date}
              </span>
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-volt" />
                {post.readTime}
              </span>
            </div>

            {/* Graphic mock banner */}
            <div className="w-full h-44 sm:h-64 bg-gradient-to-b from-[#1a1a1f] to-transparent rounded-2xl border border-border flex items-center justify-center overflow-hidden">
              <div className="text-center space-y-2">
                <Zap className="w-12 h-12 text-volt/25 animate-pulse mx-auto" />
                <span className="text-[10px] text-muted font-bold tracking-widest uppercase block">
                  Article Graphics Render
                </span>
              </div>
            </div>

            {/* Article html body content */}
            <div
              className="prose prose-invert max-w-none text-xs text-muted font-medium pt-4"
              dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
            />
          </article>

          {/* Inline CTA block */}
          <div className="p-6 bg-card border border-border rounded-2xl mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="font-bold text-white uppercase text-sm block">Run the Math Yourself</span>
              <p className="text-xs text-muted font-medium">
                Try our fuel savings calculator to project exact PKR benefits for your commute.
              </p>
            </div>
            <Link
              href="/savings-calculator"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-volt hover:bg-volt-hover text-background text-xs font-bold uppercase tracking-wide shadow-[0_0_12px_rgba(191,255,0,0.3)] transition-all"
            >
              Savings Calculator
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
