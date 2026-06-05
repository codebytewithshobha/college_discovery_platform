import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Search, TrendingUp, Shield, ArrowRight, Award, MessageCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="hero-gradient text-white">
        <div className="container mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm mb-6 backdrop-blur">
            <GraduationCap className="h-4 w-4" />
            180+ colleges across 86 Indian cities
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Find Your Dream College
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Discover, compare, and save colleges across India. Explore courses, fees,
            placements, and student reviews in one place.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/colleges">
              <Button size="lg" variant="secondary" className="gap-2 shadow-lg">
                <Search className="h-5 w-5" />
                Start Exploring
              </Button>
            </Link>
            <Link href="/compare">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/40 text-white hover:bg-white/10 hover:text-white"
              >
                Compare Colleges
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/predictor">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/40 text-white hover:bg-white/10 hover:text-white"
              >
                Predictor Tool
              </Button>
            </Link>
            <Link href="/discussions">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/40 text-white hover:bg-white/10 hover:text-white"
              >
                Discussions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-20">
        <h2 className="text-3xl font-bold text-center mb-3">
          Everything you need to decide
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          Search by city or state, filter by fees and rating, then save or compare your shortlist.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Search,
              title: "Smart Search",
              desc: "Filter by city, state, rating, and fees. Supports aliases like Bengaluru and Gurgaon.",
            },
            {
              icon: TrendingUp,
              title: "Compare Side by Side",
              desc: "Add up to 3 colleges and compare fees, packages, courses, and reviews instantly.",
            },
            {
              icon: Shield,
              title: "Save & Track",
              desc: "Bookmark colleges on your device. View full details including courses and recruiters.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

      <section className="container mx-auto px-4 py-16 md:py-20">
        <h2 className="text-3xl font-bold text-center mb-3">New tools to help you decide</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          Use the predictor for exam/rank recommendations, and join discussions to ask questions and share answers.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: Award,
              title: "Predictor Tool",
              desc: "Enter your exam and rank to get recommended colleges from the local dataset.",
              link: '/predictor',
            },
            {
              icon: MessageCircle,
              title: "Q&A Discussions",
              desc: "Ask questions, answer peers, and browse active conversations about college admissions.",
              link: '/discussions',
            },
          ].map(({ icon: Icon, title, desc, link }) => (
            <div
              key={title}
              className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 mb-4">
                <Icon className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{desc}</p>
              <Link href={link} className="text-primary font-medium hover:underline">
                Explore {title}
              </Link>
            </div>
          ))}
        </div>
      </section>
      </section>

      <section className="border-t bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "180+", label: "Colleges" },
              { value: "86", label: "Cities" },
              { value: "1000+", label: "Reviews" },
              { value: "50+", label: "Recruiters" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CollegeHub. Built for college discovery in India.</p>
        </div>
      </footer>
    </div>
  );
}
