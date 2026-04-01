"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Sparkles, ShieldCheck, Zap } from 'lucide-react';

const faqs = [
  {
    question: "How do I begin my event journey?",
    answer: "Simply click 'Get Started' or 'Create Event'. You'll be guided through our design suite where you can choose a theme, upload your cover portrait, and set your event particulars. Once you select a service tier and complete the secure payment, your page goes live instantly.",
    icon: Sparkles
  },
  {
    question: "How do guests receive their invitations?",
    answer: "After your event is live, you'll receive a unique URL and a high-definition Digital Invite (IV). You can share this link directly on WhatsApp, Instagram, or via SMS. Guests can RSVP, view the countdown, and even download their own digital entry passes.",
    icon: Zap
  },
  {
    question: "Is the payment system secure?",
    answer: "Absolutely. We utilize Paystack, Nigeria's leading payment gateway, to process all transactions. Your financial data is never stored on our servers, ensuring 100% security for every activation.",
    icon: ShieldCheck
  },
  {
    question: "Can I manage my guest list in real-time?",
    answer: "Yes. Your Host Dashboard provides a live feed of all RSVPs. You can see who is attending, their contact details, and even use our built-in QR scanner at the venue to check guests in as they arrive.",
    icon: HelpCircle
  }
];

const FAQ = () => {
  return (
    <section className="py-40 px-6 bg-[#050505]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block"
          >
            The Concierge
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif italic text-white mb-8"
          >
            Curated <span className="text-[#D4AF37]">Q&A</span>
          </motion.h2>
          <p className="text-gray-500 font-light tracking-wide">
            Everything you need to know about orchestrating your digital celebration.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AccordionItem value={`item-${index}`} className="border-white/5 bg-white/[0.02] px-8 rounded-3xl overflow-hidden transition-all hover:bg-white/[0.04]">
                <AccordionTrigger className="py-8 hover:no-underline group">
                  <div className="flex items-center gap-6 text-left">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center shrink-0 group-data-[state=open]:bg-[#D4AF37] group-data-[state=open]:text-black transition-colors">
                      <faq.icon size={18} />
                    </div>
                    <span className="text-lg md:text-xl font-serif italic text-white group-hover:text-[#D4AF37] transition-colors">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-8 pl-16 text-gray-400 font-light leading-relaxed text-base md:text-lg">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;