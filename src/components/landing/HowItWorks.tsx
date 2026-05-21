"use client";

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Layout, 
  CreditCard, 
  Share2, 
  Wallet, 
  Send, 
  Monitor, 
  Heart 
} from 'lucide-react';

const steps = [
  { title: "1. Create", desc: "Create your free account to unlock your event tools.", icon: UserPlus },
  { title: "2. Design", desc: "Set your theme and photos to build your event website.", icon: Layout },
  { title: "3. Activate", desc: "Make your page live with a quick one-time activation.", icon: CreditCard },
  { title: "4. Invite", desc: "Share your unique link with guests to gather RSVPs.", icon: Share2 },
  { title: "5. Gifts", desc: "Verify digital gifts and transfers directly in your ledger.", icon: Wallet },
  { title: "6. Dispatch", desc: "Send mass WhatsApp updates to your entire guest list.", icon: Send },
  { title: "7. Entry", desc: "Scan QR passes at the door for instant check-in.", icon: Monitor },
  { title: "8. Forever", desc: "Your event lives on as a digital memory wall.", icon: Heart }
];

const GoldParticle = ({ mouseX, mouseY }: { mouseX: number, mouseY: number }) => {
  const randomX = Math.random() * 100;
  const randomDelay = Math.random() * 5;
  const randomDuration = 3 + Math.random() * 4;
  
  return (
    <motion.div
      initial={{ y: -20, x: `${randomX}%`, opacity: 0, rotate: 0 }}
      animate={{ 
        y: [0, 400], 
        opacity: [0, 1, 1, 0],
        rotate: [0, 360],
        x: [`${randomX}%`, `${randomX + (Math.random() * 10 - 5)}%`]
      }}
      transition={{ 
        duration: randomDuration, 
        repeat: Infinity, 
        delay: randomDelay,
        ease: "linear"
      }}
      style={{
        left: 0,
        position: 'absolute',
        width: '4px',
        height: '4px',
        background: '#D4AF37',
        borderRadius: '1px',
        filter: 'blur(1px)',
        pointerEvents: 'none',
      }}
    />
  );
};

const ProtocolStep = ({ step, index, mousePos }: { step: any, index: number, mousePos: { x: number, y: number } }) => {
  const ref = useRef(null);
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.div
      ref={ref}
      onViewportEnter={() => setIsActive(true)}
      onViewportLeave={() => setIsActive(false)}
      whileHover={{ scale: 1.02, translateZ: 50 }}
      className="relative p-10 md:p-12 bg-secondary/30 backdrop-blur-xl border border-border rounded-[2.5rem] group overflow-hidden transition-all duration-700 hover:border-[#D4AF37]/40"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Gold Leaf Rain - Active only when in view */}
      <AnimatePresence>
        {isActive && (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <GoldParticle key={i} mouseX={mousePos.x} mouseY={mousePos.y} />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="relative z-10 text-center flex flex-col items-center">
        <motion.div 
          animate={isActive ? { 
            boxShadow: ["0 0 0px rgba(212,175,55,0)", "0 0 30px rgba(212,175,55,0.2)", "0 0 0px rgba(212,175,55,0)"] 
          } : {}}
          transition={{ repeat: Infinity, duration: 3 }}
          className="w-20 h-20 rounded-2xl bg-background border border-border flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#D4AF37]/10 transition-all duration-500"
        >
          <step.icon className="text-[#D4AF37] w-8 h-8" />
        </motion.div>
        <h3 className="text-2xl font-serif italic text-foreground mb-4 transition-colors group-hover:text-[#D4AF37]">{step.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed font-light px-4">
          {step.desc}
        </p>
      </div>

      {/* Gloss Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
};

const HowItWorks = () => {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // 3D Perspective Transforms
  const springProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  const rotateX = useTransform(springProgress, [0, 1], [5, -5]);
  const skewY = useTransform(springProgress, [0, 1], [2, -2]);
  const scale = useTransform(springProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="py-40 px-6 bg-background relative overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-32">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block"
          >
            The Simple Protocol
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-serif italic text-foreground mb-8"
          >
            How it <span className="text-[#D4AF37]">Works</span>
          </motion.h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light tracking-wide">
            A high-fidelity flight through the eight acts of digital orchestration.
          </p>
        </div>

        {/* 3D Moving Track */}
        <motion.div 
          style={{ rotateX, skewY, scale, transformStyle: 'preserve-3d' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
        >
          {steps.map((step, index) => (
            <ProtocolStep key={index} step={step} index={index} mousePos={mousePos} />
          ))}
        </motion.div>
      </div>

      {/* Ambient background beam */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,#D4AF37_0%,transparent_70%)] opacity-[0.03] pointer-events-none" />
    </section>
  );
};

export default HowItWorks;