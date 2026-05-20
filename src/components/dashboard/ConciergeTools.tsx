"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  DollarSign, 
  QrCode,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  info: string;
}

const ToolCard = ({ icon, title, description, onClick, info }: ToolCardProps) => (
  <div 
    onClick={onClick}
    className="group relative bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-all cursor-pointer flex flex-col justify-between aspect-square md:aspect-auto md:h-64"
  >
    <div>
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-[#D4AF37]/10 rounded-2xl text-[#D4AF37] group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={(e) => e.stopPropagation()} className="text-gray-500 hover:text-[#D4AF37] transition-colors">
                <Info size={14} className="opacity-60" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1a1a1a] border-[#D4AF37]/20 text-white text-[11px] font-medium p-4 max-w-[200px] shadow-2xl rounded-2xl">
              {info}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white mb-2">{title}</h3>
      <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest leading-relaxed line-clamp-2">
        {description}
      </p>
    </div>
    <div className="flex items-center text-[#D4AF37] text-[10px] font-black uppercase tracking-widest mt-4">
      Launch Tool <ChevronRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
    </div>
  </div>
);

interface ConciergeToolsProps {
  event: any;
  onSendWhatsAppBlast: () => void;
}

const ConciergeTools = ({ event, onSendWhatsAppBlast }: ConciergeToolsProps) => {
  const navigate = useNavigate();
  const eventId = event?.id;

  const tools = [
    {
      icon: <Users size={20} />,
      title: "Guest Registry",
      description: "Manage your confirmed attendees and vibelists.",
      onClick: () => navigate(`/guests/${eventId}`),
      info: "Access the complete database of your guests. Export mailing lists, manage check-ins, and view song requests for your DJ."
    },
    {
      icon: <DollarSign size={20} />,
      title: "Finance Hub",
      description: "Track celebration income and expenditures.",
      onClick: () => navigate(`/budget/${eventId}`),
      info: "A premium ledger for your event. Track digital sprays, vendor payments, and generate a professional financial statement."
    },
    {
      icon: <QrCode size={20} />,
      title: "Entry Scanner",
      description: "Validate guest passes at the door.",
      onClick: () => navigate(`/scanner/${eventId}`),
      info: "Use your device camera to scan guest QR codes. Instantly verify entry permissions and update the live attendance count."
    },
    {
      icon: <MessageSquare size={20} />,
      title: "Live Broadcast",
      description: "Send instant updates to all guests.",
      onClick: onSendWhatsAppBlast,
      info: "Blast a real-time message to every guest page. Perfect for venue changes, dinner calls, or special announcements."
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {tools.map((tool, index) => (
        <ToolCard key={index} {...tool} />
      ))}
    </div>
  );
};

export default ConciergeTools;