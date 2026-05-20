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
  Gift,
  Monitor,
  Heart,
  Send,
  QrCode,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const steps = [
  {
    title: "1. The Registry",
    desc: "Create your host account to begin. Think of this as your personal master key that unlocks the entire EventHub orchestration suite.",
    icon: UserPlus
  },
  {
    title: "2. The Architecture",
    desc: "Design your event page in one go. Pick your theme, set the venue, and upload a stunning portrait. This is the digital face of your celebration.",
    icon: Layout
  },
  {
    title: "3. The Ignition",
    desc: "Activate your page by choosing a service tier. Once the small fee is settled, your unique link goes live and is ready to receive guests.",
    icon: CreditCard
  },
  {
    title: "4. The First Dispatch",
    desc: "Copy your unique event link and send it manually to your inner circle. As they click and RSVP, their phone numbers are saved to your dashboard.",
    icon: Share2
  },
  {
    title: "5. The Digital Vault",
    desc: "As guests 'Spray' you with digital gifts, you'll see every transfer in your 'Ledger'. Check your bank app, then hit 'Approve' to trigger the big screen celebration.",
    icon: Wallet
  },
  {
    title: "6. The Mass Broadcast",
    desc: "Now that you have a list of confirmed guests, use the WhatsApp Blast tool to send mass updates—like dress code reminders—to everyone at once.",
    icon: Send
  },
  {
    title: "7. The Red Carpet",
    desc: "On the big day, use your phone to scan guest QR codes for instant check-in. Connect a laptop to a TV to show the Vibe Screen and watch the party come alive.",
    icon: Monitor
  },
  {
    title: "8. The Eternal Shrine",
    desc: "The party might end, but your page never dies. It remains live forever as a digital monument—a place to revisit photos and messages for years to come.",
    icon: Heart
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
        a: "Yes. You can refine your event title, venue, theme, and gallery at any time from your dashboard. For security, event dates are locked after activation."
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
        a: "Guests honor the host by sending direct transfers. They notify the host through the app, which triggers a cinematic gift box explosion on the Vibe Screen once the host verifies the bank alert."
      },
      {
        q: "Is the spraying automated?",
        a: "We use a verified manual transfer system to ensure 100% of the funds reach your bank account without platform commissions."
      }
    ]
  }
];

const FAQPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-24 md:py-40 px-6">
        <div className="text-center mb-32">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-8 text-muted-foreground hover:text-[#D4AF37] p-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
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
          <p className="text-muted-foreground max-w-2xl mx-auto font-light tracking-wide">
            The definitive guide to orchestrating your celebration on the EventHub platform.
          </p>
        </div>

        <section className="mb-40">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37]">The 8-Step Journey</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-16">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-[#D4AF37]/20 transition-all duration-500 border border-border/50">
                  <step.icon className="text-[#D4AF37] w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif italic mb-4">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-light px-4">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37]">Frequently Asked Questions</h2>
            <div className="h-px flex-1 bg-border" />
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
                      className="border-border bg-card px-8 rounded-3xl overflow-hidden hover:bg-secondary/50 transition-all shadow-sm"
                    >
                      <AccordionTrigger className="py-6 hover:no-underline text-left group">
                        <span className="text-lg font-light tracking-wide group-hover:text-[#D4AF37] transition-colors">
                          {item.q}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6 text-muted-foreground leading-relaxed font-light text-base">
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
          className="mt-40 text-center p-20 rounded-[4rem] bg-gradient-to-b from-secondary/30 to-transparent border border-border"
        >
          <Zap className="text-[#D4AF37] w-12 h-12 mx-auto mb-8 animate-pulse" />
          <h2 className="text-3xl md:text-4xl lg:text-8xl font-serif italic mb-6">Need more assistance?</h2>
          <p className="text-muted-foreground mb-10 uppercase tracking-widest text-[10px] font-bold">Our customer concierge is available 24/7</p>
          <button 
            onClick={() => window.location.href = '/support'}
            className="bg-[#D4AF37] text-black px-12 py-8 rounded-none text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#B8860B] transition-all duration-500 shadow-lg"
          >
            Contact Support
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;