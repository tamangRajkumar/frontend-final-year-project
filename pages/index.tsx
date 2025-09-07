import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Carousel from "../src/components/common/Carousel";
import { HiArrowRight, HiCalendar, HiCheckCircle, HiClock, HiLocationMarker, HiSparkles, HiStar } from "react-icons/hi";

interface FeaturedContent {
  featuredProposals: any[];
  featuredBusinesses: any[];
  featuredEvents: any[];
}

const Home: NextPage = () => {
  const [featuredContent, setFeaturedContent] = useState<FeaturedContent>({
    featuredProposals: [],
    featuredBusinesses: [],
    featuredEvents: [],
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);

  useEffect(() => {
    // Lazy import to avoid SSR axios issues from pages/api
    import("./api").then(({ getFeaturedContent }) => {
      (async () => {
        try {
          setLoading(true);
          const { data } = await getFeaturedContent();
          if (data?.success && data?.data) setFeaturedContent(data.data);
        } catch (e) {
          // silent fail -> sections will render with zero state
          console.error(e);
        } finally {
          setLoading(false);
        }
      })();
    });
  }, []);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const formatTime = (timeString: string) =>
    new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  const brand = "#f26722";

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      {/* Decorative animated blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-30 animate-pulse"
             style={{ background: `radial-gradient(600px 60px at 10% 10%, ${brand}, transparent)` }} />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-30 animate-pulse"
             style={{ background: `radial-gradient(600px 60px at 90% 90%, #22d3ee, transparent)` }} />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="relative z-10 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-white/10 backdrop-blur-md border border-white/20">
              <HiSparkles className="h-4 w-4 text-white" /> LinkCofounders
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(90deg, ${brand}, #fff)` }}>
              Find the Right Cofounder, Faster
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-zinc-200">
              Discover aligned partners, validate ideas, and build together with confidence.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/proposals">
                <a className="px-6 py-3 rounded-xl font-semibold text-white shadow-xl transition transform hover:-translate-y-0.5"
                   style={{ background: `linear-gradient(135deg, ${brand}, #ff8f57)` }}>
                  Find Cofounders Now
                </a>
              </Link>
              <Link href="/auth/signup">
                <a className="px-6 py-3 rounded-xl font-semibold border border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 transition">
                  Create Your Profile
                </a>
              </Link>
            </div>
          </div>

          <div className="relative mt-12 mx-auto max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 shadow-2xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-zinc-200">
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-2xl font-bold" style={{ color: brand }}>10k+</div>
                <div className="text-sm">Connections Made</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-2xl font-bold" style={{ color: brand }}>2k+</div>
                <div className="text-sm">Active Founders</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-2xl font-bold" style={{ color: brand }}>500+</div>
                <div className="text-sm">Live Proposals</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-2xl font-bold" style={{ color: brand }}>120+</div>
                <div className="text-sm">Events & Workshops</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pb-20">
          {/* Featured Proposals Carousel */}
          {featuredContent.featuredProposals.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Featured Business Proposals</h2>
                <Link href="/proposals"><a className="text-zinc-300 hover:text-white flex items-center">View All <HiArrowRight className="ml-1 h-5 w-5" /></a></Link>
              </div>
              <Carousel>
                {featuredContent.featuredProposals.map((proposal) => (
                  <div key={proposal._id} className="h-full">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
                          {proposal.postedBy?.userProfileImage?.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={proposal.postedBy.userProfileImage.url} alt={proposal.postedBy.fname} className="h-full w-full object-cover" />
                          ) : (
                            <span className="font-semibold">{proposal.postedBy?.fname?.[0]}{proposal.postedBy?.lname?.[0]}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold">{proposal.postedBy?.businessInfo?.businessName || `${proposal.postedBy?.fname} ${proposal.postedBy?.lname}`}</div>
                          <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/20"><HiStar className="h-4 w-4 mr-1" /> Featured</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{proposal.title}</h3>
                      <p className="text-zinc-300 line-clamp-3 mb-4">{proposal.description}</p>
                      <button onClick={() => router.push(`/proposals/${proposal._id}`)}
                        className="px-4 py-2 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition"
                        style={{ background: `linear-gradient(135deg, ${brand}, #ff8f57)` }}>
                        View Proposal
                      </button>
                    </div>
                  </div>
                ))}
              </Carousel>
            </section>
          )}

          {/* Featured Businesses Carousel */}
          {featuredContent.featuredBusinesses.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Featured Businesses</h2>
                <Link href="/users"><a className="text-zinc-300 hover:text-white flex items-center">Browse <HiArrowRight className="ml-1 h-5 w-5" /></a></Link>
              </div>
              <Carousel>
                {featuredContent.featuredBusinesses.map((biz) => (
                  <div key={biz._id} className="h-full">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl h-full text-center">
                      <div className="mx-auto h-16 w-16 rounded-full bg-white/10 overflow-hidden mb-4">
                        {biz.userProfileImage?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={biz.userProfileImage.url} alt={biz.fname} className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <h3 className="text-lg font-semibold">{biz.businessInfo?.businessName || `${biz.fname} ${biz.lname}`}</h3>
                      <p className="text-sm text-zinc-300 mb-4">{biz.businessInfo?.businessType}</p>
                      <Link href={`/users/${biz._id}`}>
                        <a className="inline-block px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition">View Profile</a>
                      </Link>
                    </div>
                  </div>
                ))}
              </Carousel>
            </section>
          )}

          {/* Featured Events Carousel */}
          {featuredContent.featuredEvents.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Featured Events</h2>
                <Link href="/events"><a className="text-zinc-300 hover:text-white flex items-center">See Events <HiArrowRight className="ml-1 h-5 w-5" /></a></Link>
              </div>
              <Carousel>
                {featuredContent.featuredEvents.map((evt) => (
                  <div key={evt._id} className="h-full">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-xl h-full">
                      {evt.image?.url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={evt.image.url} alt={evt.title} className="w-full h-48 object-cover" />
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-1">{evt.title}</h3>
                        <p className="text-sm text-zinc-300 line-clamp-2 mb-3">{evt.description}</p>
                        <div className="grid grid-cols-3 gap-2 text-xs text-zinc-300">
                          <div className="flex items-center"><HiCalendar className="h-4 w-4 mr-1" /> {formatDate(evt.startDate)}</div>
                          <div className="flex items-center"><HiClock className="h-4 w-4 mr-1" /> {formatTime(evt.startTime)}</div>
                          <div className="flex items-center"><HiLocationMarker className="h-4 w-4 mr-1" /> {evt.location}</div>
                        </div>
                        <Link href={`/events/${evt._id}`}>
                          <a className="mt-4 inline-block px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition">View Details</a>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </section>
          )}

          {/* Recent Proposals Grid */}
          {featuredContent.featuredProposals.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Recent Proposals</h2>
                <Link href="/proposals"><a className="text-zinc-300 hover:text-white flex items-center">View All <HiArrowRight className="ml-1 h-5 w-5" /></a></Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredContent.featuredProposals.slice(0, 6).map((p) => (
                  <div key={p._id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition">
                    <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                    <p className="text-sm text-zinc-300 line-clamp-3 mb-4">{p.description}</p>
                    <Link href={`/proposals/${p._id}`}>
                      <a className="inline-flex items-center text-white" style={{ color: brand }}>
                        Read more <HiArrowRight className="ml-1 h-4 w-4" />
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* How It Works */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {["Post Proposal", "Connect", "Match", "Build Together"].map((step, idx) => (
                <div key={step} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center shadow-xl hover:-translate-y-0.5 transition transform">
                  <div className="mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-3"
                       style={{ background: `linear-gradient(135deg, ${brand}, #ff8f57)` }}>
                    <span className="font-bold">{idx + 1}</span>
                  </div>
                  <div className="font-semibold">{step}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Success Stories */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Success Stories</h2>
            <Carousel>
              {[{
                id: 1,
                text: "We met on LinkCofounders and launched our MVP in 6 weeks.",
                name: "Ava & Noah",
                role: "Product & Engineering"
              }, {
                id: 2,
                text: "Found a marketing cofounder who truly complements my skills.",
                name: "Mia",
                role: "Founder, Fintech"
              }, {
                id: 3,
                text: "The platform made it easy to filter and connect with aligned partners.",
                name: "Liam",
                role: "CTO, HealthTech"
              }].map((t) => (
                <div key={t.id} className="h-full">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl h-full">
                    <p className="text-lg">“{t.text}”</p>
                    <div className="mt-4 text-sm text-zinc-300">{t.name} · {t.role}</div>
                  </div>
                </div>
              ))}
            </Carousel>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold mb-4">FAQ</h2>
            <div className="space-y-3">
              {[{
                q: "How do matches work?",
                a: "Create a profile, post or browse proposals, and use filters to find aligned partners. You can message and schedule calls right from the platform."
              }, {
                q: "Is there a fee to join?",
                a: "Creating an account and browsing is free. Premium features may be offered for advanced discovery and analytics."
              }, {
                q: "How do you keep the community safe?",
                a: "Profiles and proposals are moderated. You can report issues, and we verify profiles and activity for quality."
              }].map((item, i) => (
                <details key={i} className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                  <summary className="cursor-pointer list-none flex items-center justify-between font-medium">
                    <span>{item.q}</span>
                    <HiCheckCircle className="h-5 w-5 opacity-60 group-open:rotate-45 transition" />
                  </summary>
                  <p className="mt-2 text-zinc-300">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Newsletter */}
          <section className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold">Stay in the loop</h3>
                <p className="text-zinc-300">Get updates on new proposals, events, and success stories.</p>
              </div>
              <form className="flex w-full md:w-auto gap-3" onSubmit={(e) => { e.preventDefault(); alert("Subscribed"); }}>
                <input type="email" required placeholder="Your email"
                       className="flex-1 md:w-96 px-4 py-3 rounded-xl bg-white/10 border border-white/20 placeholder-zinc-400 focus:outline-none" />
                <button type="submit" className="px-5 py-3 rounded-xl font-semibold text-white shadow"
                        style={{ background: `linear-gradient(135deg, ${brand}, #ff8f57)` }}>
                  Subscribe
                </button>
              </form>
            </div>
          </section>

          {/* CTA Banner */}
          <section>
            <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 border border-white/20 bg-white/10 backdrop-blur-xl text-center">
              <h2 className="text-3xl font-extrabold mb-3">Ready to build together?</h2>
              <p className="text-zinc-300 mb-6">Post your proposal or join an existing team today.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup"><a className="px-6 py-3 rounded-xl font-semibold text-white shadow-xl" style={{ background: `linear-gradient(135deg, ${brand}, #ff8f57)` }}>Sign Up</a></Link>
                <Link href="/proposals"><a className="px-6 py-3 rounded-xl font-semibold border border-white/30 bg-white/10 hover:bg-white/20 transition">Browse Proposals</a></Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer stays as existing component */}
    </div>
  );
};

export default Home;
