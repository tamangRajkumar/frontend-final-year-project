import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Carousel from "../src/components/common/Carousel";
import { HiArrowRight, HiCalendar, HiCheckCircle, HiClock, HiLocationMarker, HiSparkles, HiStar, HiBriefcase, HiUsers, HiLightningBolt } from "react-icons/hi";

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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      {/* Decorative animated blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-30 animate-pulse"
             style={{ background: `radial-gradient(600px 60px at 10% 10%, ${brand}, transparent)` }} />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-30 animate-pulse"
             style={{ background: `radial-gradient(600px 60px at 90% 90%, #22d3ee, transparent)` }} />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 ">
          <div className="relative z-10 grid lg:grid-cols-2 items-center gap-8 mt-16 mb-24">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-white/60 backdrop-blur-sm border border-gray-200 text-gray-900">
                <HiSparkles className="h-4 w-4 text-orange-500" /> LinkCofounders
              </span>
              <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(90deg, ${brand}, #1f2937)` }}>
                Find the Right Cofounder, Faster
              </h1>
              <p className="mt-4 max-w-2xl mx-auto lg:mx-0 text-lg text-gray-600">
                Discover aligned partners, validate ideas, and build together with confidence.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
                <Link href="/proposals">
                  <a className="px-6 py-3 rounded-xl font-semibold text-white shadow-xl transition transform hover:-translate-y-0.5"
                     style={{ background: `linear-gradient(135deg, ${brand}, #ff8f57)` }}>
                    Find Cofounders Now
                  </a>
                </Link>
                <Link href="/auth/signup">
                  <a className="px-6 py-3 rounded-xl font-semibold border border-gray-200 bg-white/60 backdrop-blur-sm hover:bg-white/70 transition text-gray-900">
                    Create Your Profile
                  </a>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative z-0">
              <img src="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Cofounders collaborating" className="w-full h-64 sm:h-80 object-cover rounded-3xl shadow-lg" />
            </div>
          </div>

          <div className="relative mt-12 mx-auto max-w-5xl bg-white/60 backdrop-blur-sm border border-gray-200 rounded-3xl p-4 sm:p-6 shadow-2xl ">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-gray-600">
              <div className="rounded-2xl bg-white/80 p-4">
                <div className="text-2xl font-bold" style={{ color: brand }}>10k+</div>
                <div className="text-sm">Connections Made</div>
              </div>
              <div className="rounded-2xl bg-white/80 p-4">
                <div className="text-2xl font-bold" style={{ color: brand }}>2k+</div>
                <div className="text-sm">Active Founders</div>
              </div>
              <div className="rounded-2xl bg-white/80 p-4">
                <div className="text-2xl font-bold" style={{ color: brand }}>500+</div>
                <div className="text-sm">Live Proposals</div>
              </div>
              <div className="rounded-2xl bg-white/80 p-4">
                <div className="text-2xl font-bold" style={{ color: brand }}>120+</div>
                <div className="text-sm">Events & Workshops</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Feature Cards */}
      <section className="relative z-10 pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Discover & Connect
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore opportunities, find partners, and build the future together
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Business Card */}
            <Link href="/users">
              <a className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f26722] to-[#ff8f57] p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <HiUsers className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Business Profiles</h3>
                  <p className="text-white/90 mb-6 leading-relaxed">
                    Connect with verified entrepreneurs and discover potential cofounders who share your vision and values.
                  </p>
                  <div className="flex items-center text-white/80 font-semibold group-hover:text-white transition-colors">
                    Explore Businesses
                    <HiArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
              </a>
            </Link>

            {/* Proposals Card */}
            <Link href="/proposals">
              <a className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 p-8 text-gray-900 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-[#f26722]/20">
                <div className="w-16 h-16 bg-gradient-to-br from-[#f26722] to-[#ff8f57] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <HiBriefcase className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Business Proposals</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Browse innovative business ideas and investment opportunities. Find the perfect project to join or get inspired.
                </p>
                <div className="flex items-center text-[#f26722] font-semibold group-hover:text-[#ff8f57] transition-colors">
                  View Proposals
                  <HiArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-[#f26722]/10 to-[#ff8f57]/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
              </a>
            </Link>

            {/* Events Card */}
            <Link href="/events">
              <a className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f26722]/20 to-[#ff8f57]/20 group-hover:from-[#f26722]/30 group-hover:to-[#ff8f57]/30 transition-all duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#f26722] to-[#ff8f57] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <HiCalendar className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Events & Workshops</h3>
                  <p className="text-white/90 mb-6 leading-relaxed">
                    Join networking events, workshops, and meetups. Learn, connect, and grow with like-minded entrepreneurs.
                  </p>
                  <div className="flex items-center text-white/80 font-semibold group-hover:text-white transition-colors">
                    Discover Events
                    <HiArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#f26722]/20 to-[#ff8f57]/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
              </a>
            </Link>
          </div>
        </div>
      </section>

      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pb-20">
          {/* Featured Proposals Section */}
          {featuredContent.featuredProposals.length > 0 && (
            <section className="bg-white r overflow-hidden">
              {/* Section Header */}
              <div className="bg-gradient-to-r p-8 text-black">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#ff8f57] rounded-2xl flex items-center justify-center">
                      <HiBriefcase className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Featured Proposals</h2>
                      <p className="text-black mt-1">Handpicked business opportunities</p>
                    </div>
                  </div>
                  <Link href="/proposals">
                    
                     <a className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#f26722] to-[#ff8f57] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200">
                      View All
                      <HiArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </Link>
                </div>
              </div>

              {/* Proposals Grid */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredContent.featuredProposals.slice(0, 6).map((proposal) => (
                    <div key={proposal._id} className="group bg-gray-50 hover:bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#f26722]/20 hover:shadow-lg transition-all duration-300">
                      {/* Image Section */}
                      {proposal.image?.url && (
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={proposal.image.url} 
                            alt={proposal.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          <div className="absolute top-4 left-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#f26722] text-white text-xs font-semibold">
                              <HiStar className="h-3 w-3 mr-1" />
                              Featured
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f26722] to-[#ff8f57] flex items-center justify-center text-white font-semibold text-sm">
                              {proposal.postedBy?.fname?.[0]}{proposal.postedBy?.lname?.[0]}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">
                                {proposal.postedBy?.businessInfo?.businessName || `${proposal.postedBy?.fname} ${proposal.postedBy?.lname}`}
                              </div>
                              {!proposal.image?.url && (
                                <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-[#f26722]/10 text-[#f26722] font-medium">
                                  <HiStar className="h-3 w-3 mr-1" />
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#f26722] transition-colors">
                          {proposal.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                          {proposal.description}
                        </p>

                        {proposal.businessProposal && (
                          <div className="mb-4 p-3 bg-gray-100 rounded-xl">
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span className="font-medium">Industry: {proposal.businessProposal.industry}</span>
                              <span className="font-semibold text-[#f26722]">
                                ${proposal.businessProposal.investmentAmount?.min || 0} - ${proposal.businessProposal.investmentAmount?.max || 0}
                              </span>
                            </div>
                          </div>
                        )}

                        <button 
                          onClick={() => router.push(`/proposals/${proposal._id}`)}
                          className="w-full bg-gradient-to-r from-[#f26722] to-[#ff8f57] text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                        >
                          View Proposal
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
                    <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-3xl p-6 shadow-xl h-full text-center">
                      <div className="mx-auto h-16 w-16 rounded-full bg-white/60 overflow-hidden mb-4">
                        {biz.userProfileImage?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={biz.userProfileImage.url} alt={biz.fname} className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <h3 className="text-lg font-semibold">{biz.businessInfo?.businessName || `${biz.fname} ${biz.lname}`}</h3>
                      <p className="text-sm text-zinc-300 mb-4">{biz.businessInfo?.businessType}</p>
                      <Link href={`/users/${biz._id}`}>
                        <a className="inline-block px-4 py-2 rounded-lg bg-white/60 border border-gray-200 hover:bg-white/20 transition">View Profile</a>
                      </Link>
                    </div>
                  </div>
                ))}
              </Carousel>
            </section>
          )}

          {/* Featured Events Section */}
          {featuredContent.featuredEvents.length > 0 && (
            <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Section Header */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#f26722]/20 to-[#ff8f57]/20"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#f26722] to-[#ff8f57] rounded-2xl flex items-center justify-center">
                      <HiCalendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Featured Events</h2>
                      <p className="text-white/90 mt-1">Exclusive networking & learning opportunities</p>
                    </div>
                  </div>
                  <Link href="/events">
                    <a className="inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all duration-200 hover:scale-105">
                      See All Events
                      <HiArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </Link>
                </div>
              </div>

              {/* Events Grid */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredContent.featuredEvents.slice(0, 6).map((evt) => (
                    <div key={evt._id} className="group bg-gray-50 hover:bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#f26722]/20 hover:shadow-lg transition-all duration-300">
                      {evt.image?.url && (
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={evt.image.url} 
                            alt={evt.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          <div className="absolute top-4 left-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#f26722] text-white text-xs font-semibold">
                              <HiStar className="h-3 w-3 mr-1" />
                              Featured
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#f26722] transition-colors">
                          {evt.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                          {evt.description}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-xs text-gray-600">
                            <HiCalendar className="h-4 w-4 mr-2 text-[#f26722]" />
                            <span className="font-medium">{formatDate(evt.startDate)}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <HiClock className="h-4 w-4 mr-2 text-[#f26722]" />
                            <span className="font-medium">{formatTime(evt.startTime)}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <HiLocationMarker className="h-4 w-4 mr-2 text-[#f26722]" />
                            <span className="font-medium truncate">{evt.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <HiUsers className="h-4 w-4 mr-1" />
                              {evt.registeredUsers?.length || 0} registered
                            </span>
                            {evt.registrationFee > 0 && (
                              <span className="font-semibold text-[#f26722]">
                                ${evt.registrationFee}
                              </span>
                            )}
                          </div>
                        </div>

                        <button 
                          onClick={() => router.push(`/events/${evt._id}`)}
                          className="w-full mt-4 bg-gradient-to-r from-[#f26722] to-[#ff8f57] text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                        >
                          Register Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Recent Proposals Section */}
          {featuredContent.featuredProposals.length > 0 && (
            <section className="bg-white  overflow-hidden">
              {/* Section Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 ">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#ff8f57] flex items-center justify-center rounded-2xl">
                      <HiLightningBolt className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">Recent Proposals</h2>
                      <p className="text-gray-600 mt-1">Latest business opportunities</p>
                    </div>
                  </div>
                  <Link href="/proposals">
                    <a className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#f26722] to-[#ff8f57] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200">
                      View All
                      <HiArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </Link>
                </div>
              </div>

              {/* Proposals Grid */}
              <div className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredContent.featuredProposals.slice(0, 6).map((p) => (
                    <div key={p._id} className="group bg-gray-50 hover:bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#f26722]/20 hover:shadow-lg transition-all duration-300">
                      {/* Image Section */}
                      {p.image?.url && (
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={p.image.url} 
                            alt={p.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          <div className="absolute top-4 left-4">
                            <div className="text-xs text-white bg-black/50 px-2 py-1 rounded-full">
                              {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f26722] to-[#ff8f57] flex items-center justify-center text-white font-semibold text-sm">
                              {p.postedBy?.fname?.[0]}{p.postedBy?.lname?.[0]}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">
                                {p.postedBy?.businessInfo?.businessName || `${p.postedBy?.fname} ${p.postedBy?.lname}`}
                              </div>
                              {!p.image?.url && (
                                <div className="text-xs text-gray-500">
                                  {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#f26722] transition-colors">
                          {p.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                          {p.description}
                        </p>

                        {p.businessProposal && (
                          <div className="mb-4 p-3 bg-gray-100 rounded-xl">
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span className="font-medium">Industry: {p.businessProposal.industry}</span>
                              <span className="font-semibold text-[#f26722]">
                                ${p.businessProposal.investmentAmount?.min || 0} - ${p.businessProposal.investmentAmount?.max || 0}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <Link href={`/proposals/${p._id}`}>
                            <a className="inline-flex items-center text-[#f26722] font-semibold hover:text-[#ff8f57] transition-colors">
                              Read More
                              <HiArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                          </Link>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span className="flex items-center">
                              <HiUsers className="h-3 w-3 mr-1" />
                              {p.businessProposal?.interestedParties?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* How It Works */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {["Post Proposal", "Connect", "Match", "Build Together"].map((step, idx) => (
                <div key={step} className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-3xl p-6 text-center shadow-xl hover:-translate-y-0.5 transition transform">
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
          {/* <section>
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
                  <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-3xl p-6 shadow-xl h-full">
                    <p className="text-lg">“{t.text}”</p>
                    <div className="mt-4 text-sm text-zinc-300">{t.name} · {t.role}</div>
                  </div>
                </div>
              ))}
            </Carousel>
          </section> */}

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
                <details key={i} className="group bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-4">
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
          <section className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold">Stay in the loop</h3>
                <p className="text-zinc-300">Get updates on new proposals, events, and success stories.</p>
              </div>
              <form className="flex w-full md:w-auto gap-3" onSubmit={(e) => { e.preventDefault(); alert("Subscribed"); }}>
                <input type="email" required placeholder="Your email"
                       className="flex-1 md:w-96 px-4 py-3 rounded-xl bg-white/60 border border-gray-200 placeholder-zinc-400 focus:outline-none" />
                <button type="submit" className="px-5 py-3 rounded-xl font-semibold text-white shadow"
                        style={{ background: `linear-gradient(135deg, ${brand}, #ff8f57)` }}>
                  Subscribe
                </button>
              </form>
            </div>
          </section>

          {/* CTA Banner */}
          <section>
            <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 border border-gray-200 bg-white/60 backdrop-blur-sm text-center">
              <h2 className="text-3xl font-extrabold mb-3">Ready to build together?</h2>
              <p className="text-zinc-300 mb-6">Post your proposal or join an existing team today.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup"><a className="px-6 py-3 rounded-xl font-semibold text-white shadow-xl" style={{ background: `linear-gradient(135deg, ${brand}, #ff8f57)` }}>Sign Up</a></Link>
                <Link href="/proposals"><a className="px-6 py-3 rounded-xl font-semibold border border-white/30 bg-white/60 hover:bg-white/20 transition">Browse Proposals</a></Link>
              </div>
            </div>
          </section>
        </div>
      </main>

    </div>
  );
};

export default Home;
