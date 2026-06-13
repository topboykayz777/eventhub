"use client";

import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Sparkles, BookOpen, Share2, Clock, ChevronRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { blogPosts } from './BlogList';
import { showSuccess } from '@/utils/toast';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.slug === slug);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | The Atelier Journal | EventHub NG`;
      
      // Inject Article Schema for AI Search Engines
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        "@context": "https://schema.org",
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
        },
        "publisher": {
          "@type": "Organization",
          "name": "EventHub NG",
          "logo": "https://www.theeventhub.com.ng/hub-icon.png"
        },
        "description": post.excerpt,
        "keywords": post.tags.join(", ")
      });
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
      };
    }
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-serif italic">Article Not Found</h1>
          <Link to="/blog">
            <Button variant="outline" className="border-white/10 text-white rounded-none px-8 py-6 text-[10px] font-bold uppercase tracking-widest">
              Return to Journal
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showSuccess("Article link copied to clipboard.");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
      <Navbar />

      {/* Article Hero */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/blog')} 
            className="text-gray-400 hover:text-[#D4AF37] p-0 flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Journal
          </Button>

          <div className="flex items-center gap-4">
            <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-gray-500 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Clock size={12} /> {post.readTime}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif italic leading-tight text-white">
            {post.title}
          </h1>

          <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between pt-8 border-t border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                <User size={16} className="text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{post.author}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{post.date}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleShare}
              className="border-white/10 text-white rounded-full w-12 h-12 p-0 hover:bg-white/5"
            >
              <Share2 size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* Article Image */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="aspect-[21/9] overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl">
          <img src={post.image} className="w-full h-full object-cover" alt={post.title} />
        </div>
      </section>

      {/* Article Content */}
      <section className="max-w-3xl mx-auto px-6 pb-32">
        <article className="prose prose-invert max-w-none space-y-8 text-gray-300 font-light leading-relaxed text-lg">
          {post.slug === "art-of-digital-spraying-nigerian-weddings" && (
            <>
              <p>
                Nigerian weddings, or <em>Owambes</em>, are legendary for their grandeur, fashion, and the iconic tradition of spraying money. For decades, spraying crisp Naira notes has been the ultimate gesture of honor, celebration, and joy. However, as the world transitions into a cashless, digital-first economy, this beloved tradition is undergoing a sophisticated evolution.
              </p>
              <h2 className="text-2xl font-serif italic text-white mt-12 mb-4">The Logistical Challenge of Cash</h2>
              <p>
                While spraying physical cash is visually spectacular, it comes with significant logistical hurdles. Hosts often spend hours after their celebration sorting through crumpled notes, dealing with currency exchange fees, and worrying about security. Furthermore, the physical handling of currency has faced regulatory scrutiny, prompting planners to seek elegant, compliant alternatives.
              </p>
              <h2 className="text-2xl font-serif italic text-white mt-12 mb-4">Enter Digital Spraying</h2>
              <p>
                Digital Spraying bridges the gap between tradition and technology. By utilizing secure, peer-to-peer (P2P) transfers, guests can spray the host directly from their banking apps. The magic happens on the ballroom screens: as soon as a transfer is verified, a cinematic, high-energy animation is triggered on the LED walls, announcing the guest's name and the sprayed amount with explosive confetti.
              </p>
              <blockquote className="border-l-2 border-[#D4AF37] pl-6 italic text-white my-8">
                "Digital Spraying doesn't replace the vibe; it amplifies it. It allows guests from anywhere in the world to join the celebration and honor the host in real-time."
              </blockquote>
              <h2 className="text-2xl font-serif italic text-white mt-12 mb-4">Zero Commission, Maximum Honor</h2>
              <p>
                Unlike basic payment platforms that take heavy cuts from your gifts, EventHub's Digital Spraying protocol operates on a <strong>0% commission</strong> model. Because the funds move directly from the guest's bank account to the host's treasury, every single Naira sprayed goes exactly where it belongs—to the celebrants.
              </p>
            </>
          )}

          {post.slug === "ultimate-guide-to-qr-code-access-control-events" && (
            <>
              <p>
                The red carpet is the first impression of any elite celebration. Yet, all too often, this crucial touchpoint is marred by long queues, unverified guest lists, and the persistent challenge of gatecrashers. For high-society weddings and galas, professional planners are turning to a surgical solution: high-fidelity QR code access control.
              </p>
              <h2 className="text-2xl font-serif italic text-white mt-12 mb-4">The Friction of Traditional Guest Lists</h2>
              <p>
                Paper guest lists are slow, prone to human error, and easily bypassed. They create bottlenecks at the entrance, reducing the premium feel of the event before guests even step inside. Digital spreadsheets are a step up, but searching for names manually still takes valuable seconds per guest.
              </p>
              <h2 className="text-2xl font-serif italic text-white mt-12 mb-4">The QR Pass Protocol</h2>
              <p>
                By issuing a unique, secure QR pass to every confirmed guest upon RSVP, planners can automate the check-in process entirely. A quick scan at the door using any smartphone instantly verifies the guest's identity, checks them into the registry, and even displays their assigned table number.
              </p>
              <blockquote className="border-l-2 border-[#D4AF37] pl-6 italic text-white my-8">
                "A seamless entry experience sets the tone for the entire evening. It tells your guests that their presence is valued and that the event is orchestrated with the utmost professionalism."
              </blockquote>
              <h2 className="text-2xl font-serif italic text-white mt-12 mb-4">Real-time Seating & Security</h2>
              <p>
                The benefits of QR access control extend far beyond the gate. Because the check-in data is synchronized in real-time, hosts and planners can monitor guest arrival velocity directly from their dashboards. If a guest is assigned to Table 5, the ushering team is notified instantly upon scan, ensuring they are guided to their seat without delay.
              </p>
            </>
          )}

          {post.slug === "choosing-perfect-rsvp-theme-owambe" && (
            <>
              <p>
                Your digital invitation is the opening act of your celebration. It is the first glimpse your guests will have into the atmosphere, prestige, and visual DNA of your event. For Nigeria's elite, a generic link or a basic PDF invite is no longer sufficient. Your digital presence must be as bespoke as your physical venue.
              </p>
              <h2 className="text-2xl font-serif italic text-white mt-12 mb-4">The Power of Visual DNA</h2>
              <p>
                A visual theme does more than just set colors; it establishes a mood. Whether you are hosting a grand traditional wedding in Lagos or an intimate gala in Abuja, your digital invitation should reflect that specific aesthetic. From the typography to the background animations, every element must be curated.
              </p>
              <h2 className="text-2xl font-serif italic text-white mt-12 mb-4">Bespoke Themes for Every Celebration</h2>
              <p>
                EventHub offers a library of 20+ premium visual themes, each designed to capture a unique atmosphere:
              </p>
              <ul className="list-disc list-inside space-y-3 pl-4 my-6">
                <li><strong>Midnight Noir</strong>: Deep, high-contrast luxury for modern evening galas.</li>
                <li><strong>Royal Heritage</strong>: Rich emerald and gold tones for prestigious traditional weddings.</li>
                <li><strong>Pure Ivory</strong>: Clean, minimalist elegance for sophisticated white weddings.</li>
                <li><strong>Sahara Gold</strong>: Warm, sun-drenched amber tones for vibrant celebrations.</li>
              </ul>
              <blockquote className="border-l-2 border-[#D4AF37] pl-6 italic text-white my-8">
                "Your event page is a digital monument. It should feel like a natural extension of your physical celebration, preparing your guests for the luxury that awaits them."
              </blockquote>
              <h2 className="text-2xl font-serif italic text-white mt-12 mb-4">Immersive Media Backdrops</h2>
              <p>
                To truly elevate your digital invitation, consider using cinematic video loops instead of static photos. A 15-second, high-definition loop of your pre-wedding shoot or venue setup creates an immersive, living backdrop that instantly captivates your guests the moment they open the link.
              </p>
            </>
          )}

          {post.slug === "the-owambe-treasury-managing-event-budgets-safely" && (
            <>
              <p>
                Behind every successful high-society event lies a complex web of financial transactions. From securing the venue to paying caterers, decorators, and entertainment, managing an event budget can quickly become an accounting nightmare. For hosts, keeping a clear, secure record of all income and expenses is vital to ensuring a stress-free celebration.
              </p>
              <h2 className="text-2xl font-serif italic text-white mt-12 mb-4">The Post-Event Accounting Nightmare</h2>
              <p>
                Traditionally, hosts rely on scattered bank alerts, paper receipts, and mental notes to track their event finances. This lack of centralization often leads to double payments, missed vendor balances, and a general sense of financial anxiety during what should be a joyful occasion.
              </p>
              <h2 className="text-2xl font-serif italic text-white mt-12 mb-4">The Unified Ledger Solution</h2>
              <p>
                EventHub's Financial Suite introduces a secure, real-time ledger designed specifically for event hosts. By centralizing all transactions—including approved digital sprays and manual vendor payments—hosts can monitor their cash flow with surgical precision.
              </p>
              <blockquote className="border-l-2 border-[#D4AF37] pl-6 italic text-white my-8">
                "A clear financial picture is the ultimate peace of mind. By tracking every Naira in real-time, hosts can focus on celebrating rather than worrying about vendor balances."
              </blockquote>
              <h2 className="text-2xl font-serif italic text-white mt-12 mb-4">Exportable Manifests for Seamless Coordination</h2>
              <p>
                When the event concludes, the ledger can be exported instantly as a clean CSV file. This allows hosts to share precise financial summaries with their planning teams, accountants, or co-hosts, ensuring complete transparency and seamless post-event reconciliation.
              </p>
            </>
          )}

          {post.slug === "the-vibe-screen-revolution-transforming-ballrooms" && (
            <>
              <p>
                The energy of an Owambe is its heartbeat. From the moment the music starts to the final dance, keeping guests engaged and excited is the ultimate goal of any host. In the digital age, planners are leveraging interactive technology to transform traditional ballrooms into immersive, high-energy arenas.
              </p>
              <h2 className="text-2xl font-serif italic text-white mt-12 mb-4">The Challenge of Passive Attendance</h2>
              <p>
                At large celebrations, guests seated far from the main stage can often feel disconnected from the action. This passive experience can lead to early departures and a drop in overall party energy. Planners need a way to bring every corner of the ballroom into the heart of the celebration.
              </p>
              <h2 className="text-2xl font-serif italic text-white mt-12 mb-4">The Live Vibe Screen</h2>
              <p>
                The Vibe Screen is a live, full-screen feed designed to be projected onto ballroom TVs or LED walls. It acts as the digital pulse of the party, displaying real-time guest arrivals, verified digital spray alerts, and interactive DJ playlists.
              </p>
              <blockquote className="border-l-2 border-[#D4AF37] pl-6 italic text-white my-8">
                "Technology should bring people together, not distract them. The Vibe Screen turns passive onlookers into active participants, amplifying the collective joy of the room."
              </blockquote>
              <h2 className="text-2xl font-serif italic text-white mt-12 mb-4">Cinematic Spray Animations</h2>
              <p>
                When a guest sprays the host digitally, the Vibe Screen triggers a custom, high-energy animation. The guest's name and sprayed amount are displayed in elegant typography, accompanied by explosive digital confetti. This instant recognition encourages other guests to join in, creating a fun, gamified cycle of celebration.
              </p>
            </>
          )}

          {post.slug === "modern-hosts-playbook-seamless-whatsapp-dispatch" && (
            <>
              <p>
                Communication is the glue that holds an event together. From distributing invitations to sending venue updates and seating assignments, keeping hundreds of guests informed is a massive logistical challenge. For the modern host, manual messaging is no longer a viable option.
              </p>
              <h2 className="text-2xl font-serif italic text-white mt-12 mb-4">The Communication Bottleneck</h2>
              <p>
                Sending individual messages to a guest list of 500 people is incredibly time-consuming. Copying and pasting texts, attaching digital passes, and double-checking phone numbers often leads to mistakes, missed guests, and immense pre-event stress.
              </p>
              <h2 className="text-2xl font-serif italic text-white mt-12 mb-4">The Industrial Dispatcher</h2>
              <p>
                EventHub's WhatsApp Blast tool introduces an automated, staccato-speed dispatch system. By linking directly to your guest registry, the tool formats personalized messages—complete with the guest's name, table number, and a direct link to their digital pass—and prepares them for instant sending.
              </p>
              <blockquote className="border-l-2 border-[#D4AF37] pl-6 italic text-white my-8">
                "Efficiency is the ultimate luxury. By automating guest communication, hosts can save dozens of hours and ensure every attendee receives their official credentials flawlessly."
              </blockquote>
              <h2 className="text-2xl font-serif italic text-white mt-12 mb-4">Auto-Advance Protocol</h2>
              <p>
                To maximize speed, the dispatcher features an optional 'Auto-Advance' protocol. Once a message is sent and the host returns to the dashboard, the system automatically queues up the next guest in line, allowing for a continuous, high-speed flow of invitations.
              </p>
            </>
          )}
        </article>

        {/* Call to Action */}
        <div className="mt-20 p-12 rounded-[3rem] bg-white/[0.01] border border-white/5 text-center space-y-6">
          <Sparkles className="text-[#D4AF37] w-10 h-10 mx-auto animate-pulse" />
          <h3 className="text-2xl font-serif italic">Orchestrate Your Legacy</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto font-light">
            Ready to bring elite digital spraying, QR check-ins, and bespoke RSVP themes to your own celebration?
          </p>
          <Link to="/create-event" className="inline-block pt-4">
            <Button className="bg-[#D4AF37] hover:bg-[#B8860B] text-black px-10 py-6 rounded-none text-[10px] font-bold uppercase tracking-widest">
              Begin Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;