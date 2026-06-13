"use client";

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Sparkles, BookOpen, Flame, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "art-of-digital-spraying-nigerian-weddings",
    title: "The Art of Digital Spraying: Redefining Owambe Traditions in the Digital Age",
    excerpt: "How high-society hosts are digitizing the legendary spraying tradition with zero-commission peer-to-peer transfers and live screen animations, bypassing CBN cash restrictions and security risks.",
    category: "Traditions",
    date: "June 15, 2026",
    author: "Kael Felix",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80",
    tags: ["Digital Spraying", "Owambe", "Nigerian Weddings", "Cashless Economy"]
  },
  {
    slug: "ultimate-guide-to-qr-code-access-control-events",
    title: "The Ultimate Guide to QR Code Access Control for Elite Celebrations",
    excerpt: "Eliminate gatecrashers, fake invites, and messy paper lists. Learn how professional planners use high-fidelity digital passes for seamless red carpet check-ins in Lagos and Abuja.",
    category: "Logistics",
    date: "June 10, 2026",
    author: "EventHub Editorial",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80",
    tags: ["Access Control", "QR Code Pass", "Event Security", "Lagos Events"]
  },
  {
    slug: "choosing-perfect-rsvp-theme-owambe",
    title: "Bespoke Aesthetics: Choosing the Perfect RSVP Theme for Your Owambe",
    excerpt: "From Midnight Noir to Royal Heritage, discover how to align your digital invitation's visual DNA with the prestige of your physical venue to make an unforgettable first impression.",
    category: "Design",
    date: "June 05, 2026",
    author: "Aisha Bello",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80",
    tags: ["RSVP Themes", "Luxury Design", "Event Aesthetics", "Bespoke Invitations"]
  },
  {
    slug: "the-owambe-treasury-managing-event-budgets-safely",
    title: "The Owambe Treasury: Managing Event Budgets and Cash Gifts Safely",
    excerpt: "Solve the post-event accounting nightmare. How to track income, expenses, and digital sprays in a unified ledger, export clean CSVs for vendors, and secure your hard-earned gifts.",
    category: "Finance",
    date: "May 28, 2026",
    author: "Chidi Benson",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80",
    tags: ["Event Budgeting", "Financial Ledger", "Cash Gifts", "Secure Transfers"]
  },
  {
    slug: "the-vibe-screen-revolution-transforming-ballrooms",
    title: "The Vibe Screen Revolution: Transforming Ballrooms into Live Interactive Arenas",
    excerpt: "How to keep party energy high. Using live projection screens to display real-time guest arrivals, digital spray alerts, and interactive DJ playlists, turning passive attendees into active participants.",
    category: "Technology",
    date: "May 20, 2026",
    author: "Tunde Alabi",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80",
    tags: ["Vibe Screen", "Interactive Events", "Live Feed", "Ballroom Tech"]
  },
  {
    slug: "modern-hosts-playbook-seamless-whatsapp-dispatch",
    title: "The Modern Host's Playbook: Seamless WhatsApp Dispatch and Guest Communication",
    excerpt: "Solving the communication bottleneck. How to use automated, staccato-speed WhatsApp blasts to distribute digital passes, send venue updates, and coordinate seating without manual typing.",
    category: "Communication",
    date: "May 12, 2026",
    author: "Kael Felix",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80",
    tags: ["WhatsApp Blast", "Guest Communication", "Automated Dispatch", "Event Planning"]
  }
];

const BlogList = () => {
  useEffect(() => {
    document.title = "The Atelier Journal | Elite Event Planning & Tech Insights | EventHub NG";
    
    // Inject Blog Schema for AI Search Engines
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "The Atelier Journal",
      "description": "Nigeria's premier publication for luxury event planning, digital spraying traditions, and high-society orchestration.",
      "url": "https://www.theeventhub.com.ng/blog",
      "publisher": {
        "@type": "Organization",
        "name": "EventHub NG",
        "logo": "https://www.theeventhub.com.ng/hub-icon.png"
      },
      "blogPost": blogPosts.map(post => ({
        "@type": "BlogPosting",
        "headline": post.title,
        "alternativeHeadline": post.excerpt,
        "image": post.image,
        "genre": post.category,
        "url": `https://www.theeventhub.com.ng/blog/${post.slug}`,
        "datePublished": post.date,
        "author": {
          "@type": "Person",
          "name": post.author
        }
      }))
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-[#D4AF37] selection:text-black overflow-x-hidden transition-colors duration-500">
      <Navbar />

      {/* Editorial Header */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 text-center flex flex-col items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#D4AF3705_0%,transparent_70%)] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl space-y-6"
        >
          <span className="text-[#D4AF37] text-[10px] md:text-xs font-black uppercase tracking-[0.6em] block">
            The Atelier Journal
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif italic leading-tight">
            Thoughts on <span className="text-[#D4AF37]">Excellence</span>
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
            A curated collection of insights, design philosophies, and technical guides for orchestrating Nigeria's most prestigious celebrations.
          </p>
        </motion.div>
      </section>

      {/* Featured Post */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <Link to={`/blog/${blogPosts[0].slug}`} className="group block">
          <div className="grid lg:grid-cols-12 gap-12 items-center bg-card border border-border rounded-[3rem] overflow-hidden p-8 md:p-12 hover:border-[#D4AF37]/30 transition-all duration-500">
            <div className="lg:col-span-7 aspect-[16/10] overflow-hidden rounded-2xl bg-black">
              <img 
                src={blogPosts[0].image} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                alt={blogPosts[0].title} 
              />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-[#D4AF37] text-[9px] font-black uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-1 rounded-full">
                  {blogPosts[0].category}
                </span>
                <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                  {blogPosts[0].readTime}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif italic leading-tight text-foreground group-hover:text-[#D4AF37] transition-colors">
                {blogPosts[0].title}
              </h2>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">
                {blogPosts[0].excerpt}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {blogPosts[0].tags.map(tag => (
                  <span key={tag} className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground border border-border px-2.5 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div className="flex items-center gap-3 text-muted-foreground text-xs">
                  <User size={14} className="text-[#D4AF37]" />
                  <span>{blogPosts[0].author}</span>
                </div>
                <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                  Read Article <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post, index) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="group block h-full">
              <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden p-6 flex flex-col h-full hover:border-[#D4AF37]/30 transition-all duration-500">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-black mb-6">
                  <img 
                    src={post.image} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                    alt={post.title} 
                  />
                </div>
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <span className="text-[#D4AF37] text-[8px] font-black uppercase tracking-widest bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-muted-foreground text-[9px] font-bold uppercase tracking-widest">
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif italic leading-snug text-foreground group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-xs font-light leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[7px] font-bold uppercase tracking-widest text-muted-foreground">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-border mt-6">
                    <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                      {post.date}
                    </span>
                    <span className="text-[#D4AF37] text-[9px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                      Read <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogList;