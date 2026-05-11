"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Users, 
  QrCode, 
  Smartphone, 
  Wallet, 
  MessageSquare,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const faqCategories = [
  {
    title: "Getting Started",
    icon: Sparkles,
    questions: [
      {
        q: "How do I create my first event?",
        a: "To begin, click on **'Get Started'** or **'Create Event'**. You will be prompted to enter your event details including the name, date, and venue. You must also upload a high-resolution **Cover Portrait** which will serve as the main visual for your digital invitation. Once you've filled in the details and selected a theme, you'll proceed to the payment activation page."
      },
      {
        q: "What are the different service tiers?",
        a: "We offer three distinct tiers: \n\n • **Basic (₦25,000):** Perfect for intimate gatherings. Includes a custom page, RSVP tracking, and a countdown. \n • **Standard (₦75,000):** Our most popular choice for weddings. Adds a 10-photo gallery, digital invite cards, and the guest check-in system. \n • **Pro (₦150,000):** The full orchestration suite. Includes a 50-item media gallery, WhatsApp Blast capabilities, and the full Financial Ledger suite."
      }
    ]
  },
  {
    title: "Guest Management",
    icon: Users,
    questions: [
      {
        q: "How do guests RSVP?",
        a: "Once your event is live, you share your unique **Event Link** (e.g., eventhub.ng/event/your-slug). Guests visit this link, fill in their name and phone number, and can optionally add a song request or indicate if they are bringing a plus-one. After confirming, they receive a **Digital Entry Pass** with a unique QR code."
      },
      {
        q: "How does the QR Check-in system work?",
        a: "On the day of your event, open your **Host Dashboard** on your smartphone. Use the **'Scan QR'** tool to scan the passes presented by your guests. The system will instantly verify their identity and mark them as 'Checked-in' in your real-time guest list. This prevents gate-crashing and ensures only invited guests gain entry."
      },
      {
        q: "Can I assign table numbers to guests?",
        a: "Yes. In your Dashboard, you can select multiple guests from your list and use the **'Assign Seating'** tool to give them a table number. Guests will see their assigned table instantly on their digital pass when they refresh their page."
      }
    ]
  },
  {
    title: "The Financial Suite",
    icon: Wallet,
    questions: [
      {
        q: "What is 'Digital Spraying'?",
        a: "Digital Spraying is our modern alternative to traditional cash spraying. Guests can 'spray' the host by entering an amount on the event page and paying securely via Paystack. These gifts are recorded instantly and can be projected live on a **Vibe Screen** at the venue."
      },
      {
        q: "How do I receive the money sprayed by guests?",
        a: "All digital gifts are processed through our secure payment gateway. To receive your funds, you must complete your **Settlement Details** in your Profile. Provide your Bank Name, Account Number, and Account Name. Settlements are typically processed within 24-48 hours of the event conclusion."
      },
      {
        q: "How do I use the Budget Tracker?",
        a: "The **Financial Ledger** (Budget Tracker) allows you to record every expense and income related to your event. You can add items like 'Catering Deposit' or 'Venue Balance'. It automatically calculates your total spend versus your income (including digital sprays) to give you a real-time balance of your event's profitability."
      }
    ]
  },
  {
    title: "Communication & Tools",
    icon: MessageSquare,
    questions: [
      {
        q: "What is the 'WhatsApp Blast' feature?",
        a: "Available on the **Pro Plan**, this tool allows you to send personalized WhatsApp messages to your entire guest list at once. You can use templates for 'Event Reminders', 'Buffet is Open', or 'Thank You' notes. The system automatically inserts the guest's name into the message for a personal touch."
      },
      {
        q: "What is the 'Vibe Screen'?",
        a: "The Vibe Screen is a dedicated live-feed page designed to be projected on large screens at your venue. It shows real-time notifications whenever a guest RSVPs or 'sprays' the host, creating an interactive and high-energy atmosphere."
      }
    ]
  }
];

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black">
      <Navbar />
      
      <div className="relative py-24 md:py-40 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[#D4AF37]/5 blur-[120px] rounded-full" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-24"
          >
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block">The Knowledge Base</span>
            <h1 className="text-5xl md:text-7xl font-serif italic mb-8">
              Platform <span className="text-[#D4AF37]">Concierge</span>
            </h1>
            <p className="text-gray-500 font-light tracking-wide max-w-2xl mx-auto">
              A comprehensive guide to orchestrating your digital celebration. From initial creation to live event management.
            </p>
          </motion.div>

          <div className="space-y-20">
            {faqCategories.map((category, catIndex) => (
              <motion.div
                key={catIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center">
                    <category.icon className="text-[#D4AF37] w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-serif italic">{category.title}</h2>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, qIndex) => (
                    <AccordionItem 
                      key={qIndex} 
                      value={`item-${catIndex}-${qIndex}`}
                      className="border-white/5 bg-white/[0.02] px-6 md:px-10 rounded-[2rem] overflow-hidden transition-all hover:bg-white/[0.04]"
                    >
                      <AccordionTrigger className="py-8 hover:no-underline group text-left">
                        <span className="text-base md:text-lg font-bold uppercase tracking-wider group-hover:text-[#D4AF37] transition-colors">
                          {faq.q}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-8 text-gray-400 font-light leading-relaxed text-base md:text-lg whitespace-pre-line">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-40 p-12 md:p-20 bg-[#D4AF37] rounded-[3rem] md:rounded-[4rem] text-black text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 -mr-16 -mt-16 rotate-45" />
            <h2 className="text-3xl md:text-5xl font-serif italic mb-6">Still have questions?</h2>
            <p className="text-black/60 font-bold uppercase tracking-widest text-[10px] mb-10">Our elite support team is ready to assist you.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-black text-white hover:bg-black/80 rounded-none px-10 py-8 text-[10px] font-bold uppercase tracking-widest">
                Contact Support
              </Button>
              <Link to="/create-event">
                <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white rounded-none px-10 py-8 text-[10px] font-bold uppercase tracking-widest">
                  Start Creating <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600">© 2026 Event Hub Nigeria | The Art of Celebration</p>
      </footer>
    </div>
  );
};

export default FAQPage;