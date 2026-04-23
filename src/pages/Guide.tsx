"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Smartphone, 
  QrCode, 
  Wallet, 
  Megaphone, 
  Send, 
  MapPin, 
  ImageIcon, 
  ArrowRight, 
  CheckCircle2, 
  CreditCard, 
  Users,
  ScanLine,
  LayoutDashboard,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Guide = () => {
  const steps = [
    {
      title: "Step 1: Create Your Page",
      icon: Sparkles,
      desc: "Think of this as making your digital invitation card. You'll give your event a name (like 'The Adeleke Wedding'), pick a date, and upload a beautiful photo. You also get to choose a 'Theme'—this is just the color and style of your page.",
      tips: ["Use a high-quality photo for the best look.", "Add a nice message to welcome your guests."]
    },
    {
      title: "Step 2: Activate with Payment",
      icon: CreditCard,
      desc: "To make your page live for the world to see, you need to pay a small fee. We use Paystack, which is very safe. Once you pay, your page is 'Active' and you get your special link to share.",
      tips: ["Basic is for simple invites.", "Standard adds QR codes for entry.", "Pro gives you the WhatsApp Blast tool."]
    },
    {
      title: "Step 3: Invite Your Guests",
      icon: Send,
      desc: "Now the fun part! Copy your event link and send it to your friends and family on WhatsApp. When they click it, they'll see your beautiful page, a countdown timer, and a button to say 'I am coming' (RSVP).",
      tips: ["Guests just need to enter their name and phone number.", "They don't need to download any app!"]
    },
    {
      title: "Step 4: The Digital Pass",
      icon: QrCode,
      desc: "After a guest says they are coming, they get a 'Digital Pass' with a QR code (a square barcode). They should save this on their phone. This is their ticket to enter your event.",
      tips: ["Tell guests to screenshot their pass.", "The pass also shows them their table number later!"]
    },
    {
      title: "Step 5: Manage from Dashboard",
      icon: LayoutDashboard,
      desc: "This is your control center. You can see exactly how many people are coming. You can also assign table numbers to guests so they know where to sit when they arrive.",
      tips: ["Check your dashboard daily to see new RSVPs.", "You can export the list to Excel for your caterers."]
    },
    {
      title: "Step 6: At the Venue (Check-in)",
      icon: ScanLine,
      desc: "On the day of the event, have your bouncers or ushers open the Dashboard on their phones. They can click 'Scan QR' and use their camera to scan the guests' passes. It will instantly tell them if the guest is on the list!",
      tips: ["It works on any smartphone camera.", "No more paper lists at the door!"]
    },
    {
      title: "Step 7: Pro Tools (Blast & Broadcast)",
      icon: Megaphone,
      desc: "If you have the Pro plan, you can send a 'Broadcast'—a message that appears at the top of every guest's phone. You can also use the 'WhatsApp Blast' to send a message to everyone's WhatsApp at once.",
      tips: ["Use Broadcast for 'Food is served!'", "Use Blast for 'Thank you for coming!'"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <div className="max-w-5xl mx-auto py-16 md:py-24 px-6">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block"
          >
            Simple Instructions
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-serif italic mb-8"
          >
            How to use <span className="text-[#D4AF37]">EventHub</span>
          </motion.h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-light tracking-wide text-lg">
            Follow these 7 simple steps to run your event like a pro. No technical skills needed!
          </p>
        </div>

        <div className="space-y-12">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8 md:p-12 border-white/5 flex flex-col md:flex-row gap-8 items-start">
                <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                  <step.icon className="text-[#D4AF37] w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-serif italic mb-4 text-white">{step.title}</h2>
                  <p className="text-gray-400 text-base md:text-lg leading-relaxed font-light mb-6">
                    {step.desc}
                  </p>
                  <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-3 flex items-center gap-2">
                      <Heart size={12} className="fill-current" /> Pro Tips for Success
                    </p>
                    <ul className="space-y-2">
                      {step.tips.map((tip, tIdx) => (
                        <li key={tIdx} className="text-sm text-gray-500 flex items-start gap-3">
                          <div className="w-1 h-1 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <section className="mt-32 py-20 border-t border-white/5 text-center">
          <h2 className="text-3xl md:text-5xl font-serif italic mb-12">Ready to start your event?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/create-event" className="w-full sm:w-auto">
              <Button className="w-full bg-[#D4AF37] text-black px-12 py-8 rounded-none text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-[#B8860B] transition-all">
                Create My Event Now
              </Button>
            </Link>
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full border-white/10 text-white px-12 py-8 rounded-none text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-white/5">
                Go to My Dashboard
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Guide;