"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Sparkles, 
  UserPlus, 
  Layout, 
  CreditCard, 
  Share2, 
  Users, 
  PartyPopper,
  HelpCircle,
  ShieldCheck,
  Wallet,
  Camera,
  Zap,
  Gift
} from 'lucide-react';

const steps = [
  {
    title: "Join the Elite",
    desc: "Create your orchestration account in seconds. This is your portal to luxury event management.",
    icon: UserPlus,
    color: "bg-blue-500"
  },
  {
    title: "Design the Page",
    desc: "Provide event details, venue pins, and a host message to build your digital command center.",
    icon: Layout,
    color: "bg-purple-500"
  },
  {
    title: "Select Aesthetic",
    desc: "Choose from 20 bespoke themes to match your event's specific vibe and color palette.",
    icon: Sparkles,
    color: "bg-pink-500"
  },
  {
    title: "Unlock Activation",
    desc: "Select a tier and activate your page. Beta access is currently available at a special rate.",
    icon: CreditCard,
    color: "bg-green-500"
  },
  {
    title: "Mass Broadcast",
    desc: "Share your unique event link or use the Pro WhatsApp Blast tool to reach guests instantly.",
    icon: Share2,
    color: "bg-orange-500"
  },
  {
    title: "Real-time Ledger",
    desc: "Track every RSVP and monitor incoming digital sprays from your live financial suite.",
    icon: Users,
    color: "bg-yellow-500"
  },
  {
    title: "On-site Access",
    desc: "On the big day, use the built-in QR scanner for instant guest verification and check-in.",
    icon: PartyPopper,
    color: "bg-red-500"
  }
];

const faqSections = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "What is EventHub Nigeria?",
        a: "EventHub is a premium digital orchestration suite designed for high-society hosts and professional planners in Nigeria. We provide integrated tools for RSVPs, check-ins, and financial tracking."
      },
      {
        q: "What is the 'Beta Access' tier?",
        a: "Our Beta tier allows early adopters to test all foundational features at a significantly reduced rate (₦100) during our testing phase."
      }
    ]
  },
  {
    category: "Events & Customization",
    questions: [
      {
        q: "Can I edit details after the page is live?",
        a: "Yes. You can refine your event title, venue, theme, and gallery at any time from your dashboard. For security, event dates are locked after activation—contact support for reschedules."
      },
      {
        q: "What media formats are supported?",
        a: "Our Standard and Pro tiers support both high-resolution images and HD video files (up to 50MB per file) for your memory wall."
      }
    ]
  },
  {
    category: "Digital Spraying",
    questions: [
      {
        q: "How does the Digital Spray work?",
        a: "Guests honor the host by sending direct transfers. They upload a receipt or notify the host, which triggers a cinematic gift box explosion on the Vibe Screen once approved in the Ledger."
      },
      {
        q: "Is the spraying automated?",
        a: "We currently use a verified manual transfer system to ensure 100% of the funds reach the host's provided bank account without platform commissions on gifts."
      }
    ]
  },
  {
    category: "The Vibe Screen",
    questions: [
      {
        q: "What is the Vibe Screen for?",
        a: "The Vibe Screen is a live cinematic broadcast designed for venue projectors. it shows guest arrivals, digital sprays, and your curated media gallery in real-time."
      },
      {
        q: "How many activities are shown on the sidebar?",
        a: "The sidebar displays the 3 most recent activities (arrivals or sprays) to keep the layout clean and readable from a distance."
      }
    ]
  }
];

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-24 md:py-40 px-6">
        <div className="text-center mb-32">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block"
          >
            The Knowledge Base
          </motion.span>
          <motion.h1             initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-serif italic mb-8"
          >
            How to <span className="text-[#D4AF37]">Orchestrate</span>
          </motion.h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-light tracking-wide">
            The definitive guide to orchestrating your celebration on the EventHub platform.
          </p>
        </div>

        <section className="mb-40">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px flex-1 bg-white/5" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37]">The 7-Step Journey</h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-6">
                    <step.icon className="text-[#D4AF37] w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-serif italic mb-4">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-light px-4">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px flex-1 bg-white/5" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37]">Frequently Asked Questions</h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="space-y-20">
            {faqSections.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-2xl font-serif italic mb-8 flex items-center gap-4">
                  <HelpCircle className="text-[#D4AF37] w-5 h-5" />
                  {section.category}
                </h3>
                <Accordion type="single" collapsible className="space-y-4">
                  {section.questions.map((item, i) => (
                    <AccordionItem 
                      key={i}                       value={`${idx}-${i}`} 
                      className="border-white/5 bg-white/[0.02] px-8 rounded-3xl overflow-hidden hover:bg-white/[0.04] transition-all"
                    >
                      <AccordionTrigger className="py-6 hover:no-underline text-left group">
                        <span className="text-lg font-light tracking-wide group-hover:text-[#D4AF37] transition-colors">
                          {item.q}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6 text-gray-400 leading-relaxed font-light text-base">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-40 text-center p-20 rounded-[4rem] bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5"
        >
          <Zap className="text-[#D4AF37] w-12 h-12 mx-auto mb-8 animate-pulse" />
          <h2 className="text-3xl md:text-4xl lg:text-8xl font-serif italic mb-6">Need more assistance?</h2>
          <p className="text-gray-500 mb-10 uppercase tracking-widest text-[10px] font-bold">Our customer concierge is available 24/7</p>
          <button 
            onClick={() => window.location.href = '/support'}
            className="bg-[#D4AF37] text-black px-12 py-8 rounded-none text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#B8860B] transition-all duration-500"
          >
            Contact Support
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;