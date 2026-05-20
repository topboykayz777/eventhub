"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Edit, CheckCircle2, Power, ExternalLink, Info } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EventCardProps {
  event: any;
}

const InfoButton = ({ text }: { text: string }) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="inline-flex items-center justify-center ml-2 text-gray-500 hover:text-[#D4AF37] transition-all">
          <Info size={12} className="opacity-60" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="bg-[#1a1a1a] border-[#D4AF37]/20 text-white text-[11px] font-medium p-4 max-w-[240px] shadow-2xl rounded-2xl leading-relaxed">
        {text}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = React.useState(false);

  const isFinished = event.is_finished;

  const isVideo = (url: string) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.quicktime'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const toggleFinished = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('events')
        .update({ is_finished: !isFinished })
        .eq('id', event.id);

      if (error) throw error;
      
      showSuccess(isFinished ? "Event reopened." : "Event marked as concluded.");
      queryClient.invalidateQueries({ queryKey: ['host-dashboard-data'] });
    } catch (err: any) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:col-span-4 w-full">
      <div className="relative aspect-[4/5] w-full overflow-hidden border border-white/10 dark:border-white/10 group rounded-[2.5rem] md:rounded-[3rem] bg-black">
        {isVideo(event.photo_url) ? (
          <video 
            src={event.photo_url} 
            className={`w-full h-full object-cover ${isFinished ? 'grayscale' : 'grayscale group-hover:grayscale-0'} transition-all duration-1000 group-hover:scale-105 pointer-events-none`}
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          <img 
            src={event.photo_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
            className={`w-full h-full object-cover ${isFinished ? 'grayscale' : 'grayscale group-hover:grayscale-0'} transition-all duration-1000 group-hover:scale-105`}
            alt={event.event_name}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
        
        <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
          {isFinished ? (
            <span className="bg-gray-500 text-white text-[8px] font-black px-3 py-1.5 uppercase tracking-widest flex items-center gap-1 rounded-full backdrop-blur-md">
              <CheckCircle2 size={10} /> Concluded
            </span>
          ) : event.is_paid ? (
            <span className="bg-green-500 text-black text-[8px] font-black px-3 py-1.5 uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)]">Live</span>
          ) : (
            <Button 
              size="sm" 
              onClick={() => navigate(`/payment/${event.id}`)}
              className="bg-[#e94560] hover:bg-[#d43d56] text-white text-[8px] font-black px-3 py-1.5 h-auto rounded-full uppercase tracking-widest"
            >
              Activate Page
            </Button>
          )}
        </div>

        <div className="absolute bottom-8 left-8 right-8">
          <h2 className="text-3xl font-serif italic text-white mb-4 line-clamp-2 leading-tight">{event.event_name}</h2>
          <div className="flex flex-col gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
            <div className="flex items-center gap-2"><Calendar className="w-3 h-3 text-[#D4AF37] shrink-0" /> {new Date(event.event_date).toLocaleDateString()}</div>
            <div className="flex items-center gap-2"><MapPin className="w-3 h-3 text-[#D4AF37] shrink-0" /> <span className="truncate">{event.venue}</span></div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/edit-event/${event.id}`)} 
          className="w-full rounded-2xl border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] py-6 h-auto hover:bg-black/10 dark:hover:bg-white/10 transition-all group"
        >
          <Edit className="w-3 h-3 mr-2 shrink-0 opacity-60 group-hover:opacity-100" /> Edit Event Page <InfoButton text="Refine your event's digital presence. Update the title, date, and venue, or refresh your visual gallery with new images and cinematic videos." />
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => window.open(`/event/${event.slug}`, '_blank')}
          className="w-full rounded-2xl border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] py-6 h-auto hover:bg-[#D4AF37]/10"
        >
          <ExternalLink className="w-3 h-3 mr-2 shrink-0" /> Check Event Page <InfoButton text="Experience your event link exactly as your guests will. Preview the live animations, RSVP flows, and overall digital aesthetic across all devices." />
        </Button>

        <Button 
          variant="outline" 
          disabled={loading}
          onClick={toggleFinished}
          className={`w-full rounded-2xl py-6 h-auto text-[10px] font-bold uppercase tracking-[0.4em] transition-all ${
            isFinished 
              ? 'bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20' 
              : 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20'
          }`}
        >
          <Power className="w-3 h-3 mr-2 shrink-0" />
          {isFinished ? 'Reopen Event' : 'Conclude Event'} <InfoButton text={isFinished ? "Bring your event back to life. This will reactivate the RSVP system and allow guests to access the digital features once again." : "Officially end the event session. This will lock the guest list, disable further RSVPs, and archive the digital experience."} />
        </Button>
      </div>
    </div>
  );
};

export default EventCard;