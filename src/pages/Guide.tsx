"use client";

import React, { useEffect } from 'react';
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
    category: "The Foundation",
    questions: [
      {
        q: "What is EventHub Nigeria?",
        a: "EventHub is an elite digital orchestration suite designed for high-society weddings, galas, and professional corporate events. We provide the technical backbone for guest management, digital traditions, and secure access control."
      },
      {
        q: "Is it really free during the Beta phase?",
        a: "Yes. Early adopters get access to the full 'Pro' suite—including the WhatsApp Dispatcher and Vibe Screen—entirely for free. This allows us to gather feedback from Nigeria's top planners while you build your legacy."
      },
      {
        q: "Can I use EventHub for corporate product launches?",
        a: "Absolutely. While our aesthetic themes are curated for luxury, the underlying engine is powerful enough to handle high-stakes corporate retreats, concerts, and conferences with thousands of attendees."
      }
    ]
  },
  {
    category: "Orchestration & Design",
    questions: [
      {
        q: "How do visual themes work?",
        a: "We offer 20+ bespoke visual 'DNAs' like Midnight Noir and Royal Heritage. Selecting a theme instantly transforms the typography, colors, and atmosphere of your event page, your digital invitations, and your guests' entry passes."
      },
      {
        q: "Can I use video backdrops instead of photos?",
        a: "Yes. You can upload high-quality cinematic portraits or 15-second loop videos (MP4/MOV) as your cover media to create an immersive first impression for your guests."
      },
      {
        q: "What is the 'Location GPS' feature?",
        a: "By pasting a Google Maps 'Share' link into your event settings, you provide guests with a one-tap 'Navigate' button. This ensures they arrive exactly at your venue's gate without getting lost."
      }
    ]
  },
  {
    category: "Guest Management",
    questions: [
      {
        q: "How do guests get their digital passes?",
        a: "Once a guest RSVPs, they are instantly issued a high-fidelity Digital Pass with a unique QR code. They are encouraged to bookmark the page or save the pass to their gallery for entry."
      },
      {
        q: "How does the WhatsApp Blast tool work?",
        a: "The Industrial Dispatcher allows you to send official invites and passes to your entire guest list one by one at high speed. It automates the message formatting so you don't have to type individual texts."
      },
      {
        q: "Can I assign table numbers to my guests?",
        a: "Yes. In your Guest Registry, you can select guests individually or in bulk to assign them to specific tables. These table numbers then appear automatically on their digital entry passes."
      },
      {
        q: "What happens if a guest loses their link?",
        a: "Guests can return to your event link and use the 'Retrieve Pass' search feature. By entering their registered phone number, they can instantly regain access to their personal dashboard and QR pass."
      }
    ]
  },
  {
    category: "The Vibe & Traditions",
    questions: [
      {
        q: "How does 'Digital Spraying' work?",
        a: "We digitized the Nigerian tradition. Guests transfer money directly to your bank account using their own apps. They then notify you through the portal. Once you see the alert on your phone, you 'Verify' it in your dashboard, which triggers a cinematic celebration animation on the ballroom screens."
      },
      {
        q: "Do you take a commission on sprayed gifts?",
        a: "No. EventHub takes 0% commission on guest-to-host gifts. Because the money is transferred Peer-to-Peer (P2P), we never touch the funds. We only act as the verification and animation layer."
      },
      {
        q: "What is the Vibe Screen?",
        a: "The Vibe Screen is a live, full-screen feed designed to be projected onto ballroom TVs or LED walls. It shows real-time stats, guest arrival alerts, and high-energy 'Digital Spray' animations to keep the party energy high."
      }
    ]
  },
  {
    category: "Security & Logistics",
    questions: [
      {
        q: "How do I check in guests at the door?",
        a: "You or your security team can open the 'Scan QR Pass' tool in your dashboard on any smartphone. Simply point the camera at the guest's digital pass for instant verification and check-in."
      },
      {
        q: "Is my data secure?",
        a: "Yes. We are fully compliant with the Nigeria Data Protection Act (NDPA) 2023. We use high-level encryption for all guest lists and never share your financial data with third parties."
      },
      {
        q: "Can I export my guest list for my caterers?",
        a: "Yes. You can export your entire registry as a CSV file at any time. This includes names, phone numbers, table assignments, and special song requests for your DJ."
      }
    ]
  }
];

const Guide = () => {
  const navigate = useNavigate();

  // AIO Injector: Updated to include the expanded Q&A for AI crawlers
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": guideSections.flatMap(section => 
        section.questions.map(q => ({
          "@type": "Question",
          "name": q.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": q.a
          }
        }))
      )
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(faqSchema);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

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