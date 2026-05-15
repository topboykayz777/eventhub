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
  Zap
} from 'lucide-react';

const steps = [
  {
    title: "Join the Club",
    desc: "Click 'Sign Up' to create your own secret key (account). It's like getting a library card for parties!",
    icon: UserPlus,
    color: "bg-blue-500"
  },
  {
    title: "Make Your Party Page",
    desc: "Tell us the name of your party, where it is, and when it starts. It's like writing a digital invitation!",
    icon: Layout,
    color: "bg-purple-500"
  },
  {
    title: "Pick a Pretty Dress",
    desc: "Choose a 'Theme' to make your page look beautiful. You can pick colors that match your party decorations!",
    icon: Sparkles,
    color: "bg-pink-500"
  },
  {
    title: "Unlock the Magic",
    desc: "Pay a small fee to make your page go live on the internet. This is like buying a stamp for your letter!",
    icon: CreditCard,
    color: "bg-green-500"
  },
  {
    title: "Tell Everyone!",
    desc: "Send your special link to your friends on WhatsApp. They can click it to say 'Yes, I'm coming!'",
    icon: Share2,
    color: "bg-orange-500"
  },
  {
    title: "Count the Guests",
    desc: "Check your Dashboard to see a list of everyone who is coming. It's like counting how many cupcakes you need!",
    icon: Users,
    color: "bg-yellow-500"
  },
  {
    title: "Party Time!",
    desc: "On the big day, use your phone to scan guests' QR codes at the door. It's like being a real VIP guard!",
    icon: PartyPopper,
    color: "bg-red-500"
  }
];

const faqSections = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "What exactly is EventHub Nigeria?",
        a: "EventHub is a premium digital orchestration suite. We provide hosts and professional planners with tools to create event pages, manage RSVPs, track budgets, and handle guest check-ins via QR codes."
      },
      {
        q: "Do I need to be a tech expert to use this?",
        a: "Not at all. We've designed the interface to be as intuitive as possible. If you can use WhatsApp, you can orchestrate an event on EventHub."
      },
      {
        q: "Is my account free?",
        a: "Creating an account and browsing the directory is free. You only pay when you want to activate a specific event page."
      }
    ]
  },
  {
    category: "Events & Themes",
    questions: [
      {
        q: "Can I change my event details after paying?",
        a: "Yes! You can edit your event name, venue, message, and theme at any time from your Dashboard. However, the event date is locked for security—contact support if you need to reschedule."
      },
      {
        q: "How many photos can I add to my gallery?",
        a: "It depends on your plan. Basic has no gallery, Standard allows 10 HD items, and Pro allows up to 50 media files (including videos)."
      },
      {
        q: "What are 'Themes'?",
        a: "Themes are pre-designed aesthetic styles (colors, fonts, and layouts) that you can apply to your event page to match the vibe of your celebration."
      }
    ]
  },
  {
    category: "Payments & Plans",
    questions: [
      {
        q: "How do I pay for my event?",
        a: "We use Paystack, Nigeria's most secure payment gateway. You can pay via Bank Transfer, Card, USSD, or QR code."
      },
      {
        q: "What is the difference between Basic, Standard, and Pro?",
        a: "Basic is for simple RSVP tracking. Standard adds a media gallery and digital invite cards. Pro is the full suite, including WhatsApp Blasts and the Financial Ledger."
      },
      {
        q: "Can I upgrade my plan later?",
        a: "Absolutely. You can upgrade from Basic to Standard or Pro at any time by paying the difference."
      }
    ]
  },
  {
    category: "RSVPs & Check-in",
    questions: [
      {
        q: "How do guests RSVP?",
        a: "You share your unique event link. Guests visit the link, fill in their name and phone number, and instantly receive a Digital Entry Pass."
      },
      {
        q: "Do my guests need to create an account?",
        a: "No. Guests only need to provide their details to RSVP. Only the Host needs an account to manage the event."
      },
      {
        q: "How does the QR code check-in work?",
        a: "Every guest gets a unique QR code on their pass. At the venue, you (the host) open the 'Scan QR' tool on your Dashboard and point your camera at their pass to verify them."
      }
    ]
  },
  {
    category: "Digital Spraying",
    questions: [
      {
        q: "What is Digital Spraying?",
        a: "It's a modern way for guests to give cash gifts. Guests can 'spray' money digitally on your event page using Paystack."
      },
      {
        q: "How do I get the money guests spray?",
        a: "The money is collected via Paystack and settled into the bank account you provide in your 'Profile' section. Settlements usually happen within 24-48 hours."
      },
      {
        q: "Is there a fee for digital spraying?",
        a: "Standard payment processing fees apply from Paystack. EventHub does not take an additional cut from your gifts."
      }
    ]
  },
  {
    category: "The Vibe Screen",
    questions: [
      {
        q: "What is the Vibe Screen?",
        a: "It's a live, full-screen broadcast of your event's activity. It shows new RSVPs, digital sprays, and gallery updates in real-time. It's perfect for projecting on big screens at the venue!"
      },
      {
        q: "When does the Vibe Screen activate?",
        a: "It becomes active exactly at the start time of your event and stays live until you mark the event as 'Concluded'."
      }
    ]
  },
  {
    category: "Security & Support",
    questions: [
      {
        q: "Is my data safe?",
        a: "Yes. We use industry-standard encryption and Supabase's secure infrastructure to protect your data and your guests' information."
      },
      {
        q: "What if I forget my password?",
        a: "Click 'Forgot Password' on the login page, and we'll send a secure reset link to your email."
      },
      {
        q: "How do I contact support?",
        a: "Visit our 'Support' page or email us directly at kaelfelix0120@gmail.com. We're here to help 24/7."
      }
    ]
  }
];

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-24 md:py-40 px-6">
        {/* Header */}
        <div className="text-center mb-32">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block"
          >
            The Knowledge Base
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-serif italic mb-8"
          >
            How to <span className="text-[#D4AF37]">Orchestrate</span>
          </motion.h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-light tracking-wide text-lg">
            Everything you need to know about using EventHub, from your first click to the final toast.
          </p>
        </div>

        {/* 7-Step Guide */}
        <section className="mb-40">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px flex-1 bg-white/5" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37]">The 7-Step Journey</h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-premium p-8 rounded-[2.5rem] border border-white/5 relative group"
              >
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-black text-xs z-10 shadow-xl">
                  0{i + 1}
                </div>
                <div className={`w-14 h-14 rounded-2xl ${step.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <step.icon className={`${step.color.replace('bg-', 'text-')} w-6 h-6`} />
                </div>
                <h3 className="text-xl font-serif italic mb-4">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-light">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px flex-1 bg-white/5" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37]">Detailed Scenarios</h2>
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
                      key={i} 
                      value={`${idx}-${i}`} 
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

        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-40 text-center p-20 rounded-[4rem] bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5"
        >
          <Zap className="text-[#D4AF37] w-12 h-12 mx-auto mb-8 animate-pulse" />
          <h2 className="text-3xl font-serif italic mb-6">Still have questions?</h2>
          <p className="text-gray-500 mb-10 uppercase tracking-widest text-[10px] font-bold">Our concierge is standing by</p>
          <button 
            onClick={() => window.location.href = '/support'}
            className="bg-[#D4AF37] text-black px-12 py-6 rounded-none text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#B8860B] transition-all"
          >
            Contact Support
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;