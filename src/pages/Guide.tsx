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
    title: "1. Create Account",
    desc: "Sign up to start planning. This gives you access to all your event tools in one dashboard.",
    icon: UserPlus
  },
  {
    title: "2. Build Your Page",
    desc: "Design your event website. Choose a theme and upload your photo to make it look amazing.",
    icon: Layout
  },
  {
    title: "3. Make it Live",
    desc: "Activate your page by paying the service fee. Once done, your unique link is ready for guests.",
    icon: CreditCard
  },
  {
    title: "4. Share the Link",
    desc: "Send your event link to your friends and family on WhatsApp so they can start signing up.",
    icon: Share2
  },
  {
    title: "5. Verify Gifts",
    desc: "When guests send you money (Spraying), check your bank alert and approve it in the app to show a celebration on screen.",
    icon: Wallet
  },
  {
    title: "6. Send Reminders",
    desc: "Easily send messages to all your signed-up guests at once using our WhatsApp tool.",
    icon: Send
  },
  {
    title: "7. Event Day",
    desc: "Scan guest QR codes at the entrance to check them in. Connect a laptop to a TV to show the live party screen.",
    icon: Monitor
  },
  {
    title: "8. Keep the Memory",
    desc: "Your event page stays online forever. You can always come back to see the photos and messages.",
    icon: Heart
  }
];

const guideSections = [
  {
    category: "The Basics",
    questions: [
      {
        q: "What exactly is EventHub?",
        a: "EventHub is a professional orchestration suite designed for high-society events. It streamlines guest list management, digital 'spraying', and secure access control through QR-code passes."
      },
      {
        q: "Is it really free for now?",
        a: "Yes! During our current Beta phase, we are offering the full premium suite for free to early adopters to gather feedback and refine the experience."
      },
      {
        q: "Can I use this for corporate events?",
        a: "Absolutely. While we are optimized for weddings and galas, our tool is powerful enough for product launches, corporate retreats, and conferences."
      }
    ]
  },
  {
    category: "Managing Your Event",
    questions: [
      {
        q: "Can I update my event details after launch?",
        a: "Yes. You can edit the title, venue, and gallery photos at any time. However, the event date cannot be changed once the first RSVP has been received to ensure data integrity."
      },
      {
        q: "Does the platform support videos?",
        a: "Yes. You can upload short cinematic videos (up to 15 seconds) for your event cover and gallery to give your page a truly high-end feel."
      },
      {
        q: "Is there a limit to how many guests I can invite?",
        a: "During the Beta period, events are currently capped at 500 unique guest registrations. Professional tiers launching in the future will support much larger capacities."
      }
    ]
  },
  {
    category: "Money & Spraying",
    questions: [
      {
        q: "How does the 'Digital Spraying' work?",
        a: "Guests transfer money directly to your bank account using their own banking apps. They then notify the host through the portal. Once you see the alert on your phone, you 'verify' it in your dashboard to trigger the live screen animation."
      },
      {
        q: "Do you take a commission on gifts?",
        a: "No. Since the money is transferred Peer-to-Peer (directly from the guest to you), EventHub never touches the funds and takes 0% commission."
      },
      {
        q: "What is the 'Vibe Screen'?",
        a: "The Vibe Screen is a live, full-screen display designed for ballroom TVs and projectors. It shows real-time check-ins and cinematic 'Gift Received' animations as guests spray you."
      }
    ]
  },
  {
    category: "Logistics & Access",
    questions: [
      {
        q: "How do guests get their entry passes?",
        a: "Immediately after a guest RSVPs, a unique digital pass with a high-fidelity QR code is generated for them. They can save this to their photos or find it via the link sent to their phone."
      },
      {
        q: "What if a guest doesn't have a smartphone?",
        a: "Hosts can manually check in any guest from the dashboard by searching for their name or phone number, ensuring no one is left at the door."
      },
      {
        q: "Can I export my guest list for my security team?",
        a: "Yes. You can download your entire guest registry as a CSV file at any time to share with security, catering, or venue staff."
      }
    ]
  },
  {
    category: "Privacy & Security",
    questions: [
      {
        q: "Who has access to my guest data?",
        a: "Only you. We do not sell or share your guest list with third parties. Your data is used exclusively to facilitate your specific event."
      },
      {
        q: "Are the bank details I provide safe?",
        a: "We only display the bank name, account number, and account name that you choose to provide so guests can spray you. We never ask for your BVN or sensitive banking credentials."
      }
    ]
  }
];

const Guide = () => {
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
            The Simple Protocol
          </motion.span>
          <motion.h1             
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-serif italic mb-8"
          >
            How it <span className="text-[#D4AF37]">Works</span>
          </motion.h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-light tracking-wide text-lg">
            Everything you need to know about orchestrating your celebration on EventHub.
          </p>
        </div>

        <section className="mb-40">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37]">The 8 Simple Steps</h2>
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
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37]">Common Questions</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-20">
            {guideSections.map((section, idx) => (
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
          <h2 className="text-3xl md:text-4xl lg:text-8xl font-serif italic mb-6">Need more help?</h2>
          <p className="text-muted-foreground mb-10 uppercase tracking-widest text-[10px] font-bold">Our team is here 24/7</p>
          <button 
            onClick={() => window.location.href = '/support'}
            className="bg-[#D4AF37] text-black px-12 py-8 rounded-none text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#B8860B] transition-all duration-500 shadow-lg"
          >
            Message Support
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Guide;