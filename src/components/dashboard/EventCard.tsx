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
        <button 
          type="button" 
          className="inline-flex items-center justify-center ml-2 text-muted-foreground hover:text-primary transition-all p-1"
          aria-label="More information"
        >
          <Info size={14} className="opacity-80" />
        </button>
      </TooltipTrigger>
      <TooltipContent 
        side="top" 
        className="bg-card border-primary/20 text-foreground text-[12px] font-medium p-5 max-w-[300px] shadow-2xl rounded-3xl leading-relaxed z-[200] border backdrop-blur-xl"
      >
        <p>{text}</p>
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
      
      showSuccess(isFinished ? "Event reopened successfully." : "Event marked as concluded.");
      queryClient.invalidateQueries({ queryKey: ['host-dashboard-data'] });
    } catch (err: any) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:col-span-4 w-full flex flex-col h-full bg-card/50 dark:bg-card/20 border border-border rounded-[3rem] p-4 md:p-6 transition-all hover:border-primary/30">
      <div className="relative aspect-[4/5] w-full overflow-hidden border border-border group rounded-[2.5rem] bg-black">
        {isVideo(event.photo_url) ? (
          <video 
            src={event.photo_url} 
            className={`w-full h-full object-cover ${isFinished ? 'grayscale opacity-60' : 'grayscale group-hover:grayscale-0'} transition-all duration-1000 group-hover:scale-105 pointer-events-none`}
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          <img 
            src={event.photo_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
            className={`w-full h-full object-cover ${isFinished ? 'grayscale opacity-60' : 'grayscale group-hover:grayscale-0'} transition-all duration-1000 group-hover:scale-105`}
            alt={event.event_name}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80" />
        
        <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
          {isFinished ? (
            <span className="bg-white/10 backdrop-blur-md text-white text-[9px] font-black px-4 py-2 uppercase tracking-widest flex items-center gap-2 rounded-full border border-white/20">
              <CheckCircle2 size={12} /> Concluded
            </span>
          ) : event.is_paid ? (
            <span className="bg-green-500 text-black text-[9px] font-black px-4 py-2 uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)]">Live</span>
          ) : (
            <Button 
              size="sm" 
              onClick={() => navigate(`/payment/${event.id}`)}
              className="bg-[#e94560] hover:bg-[#d43d56] text-white text-[9px] font-black px-4 py-2 h-auto rounded-full uppercase tracking-widest shadow-lg"
            >
              Activate Page
            </Button>
          )}
        </div>

        <div className="absolute bottom-8 left-8 right-8">
          <h2 className="text-3xl md:text-4xl font-serif italic text-white mb-4 line-clamp-2 leading-tight drop-shadow-lg">{event.event_name}</h2>
          <div className="flex flex-col gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
            <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-primary shrink-0" /> {new Date(event.event_date).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
            <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary shrink-0" /> <span className="truncate">{event.venue}</span></div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col gap-4">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/edit-event/${event.id}`)} 
            className="flex-1 rounded-2xl border-border bg-muted/30 text-[10px] font-bold uppercase tracking-[0.2em] py-6 h-auto hover:bg-muted/50 hover:border-primary/50 transition-all group"
          >
            <Edit className="w-3.5 h-3.5 mr-2 shrink-0 opacity-60 group-hover:opacity-100" /> Edit Event Page
          </Button>
          <InfoButton text="Access your private orchestration studio to refine every detail of your event. Here you can change the title, update the countdown clock, modify the venue location, or swap out cinematic gallery images to keep your digital registry fresh and engaging for your guests." />
        </div>
        
        <div className="flex items-center">
          <Button 
            variant="outline" 
            onClick={() => window.open(`/event/${event.slug}`, '_blank')}
            className="flex-1 rounded-2xl border-primary/30 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.2em] py-6 h-auto hover:bg-primary/10"
          >
            <ExternalLink className="w-3.5 h-3.5 mr-2 shrink-0" /> Check Event Page
          </Button>
          <InfoButton text="View your live digital monument exactly as your guests will see it. Test the mobile responsiveness, verify the aesthetic themes, and ensure the RSVP registry flow is operating perfectly before officially launching your link to your audience." />
        </div>

        <div className="flex items-center">
          <Button 
            variant="outline" 
            disabled={loading}
            onClick={toggleFinished}
            className={`flex-1 rounded-2xl py-6 h-auto text-[10px] font-bold uppercase tracking-[0.4em] transition-all ${
              isFinished 
                ? 'bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20' 
                : 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20'
            }`}
          >
            <Power className="w-3.5 h-3.5 mr-2 shrink-0" />
            {isFinished ? 'Reopen Event' : 'Conclude Event'}
          </Button>
          <InfoButton text={isFinished ? "Bring your celebration back to life. This will reactivate the RSVP registry system and restore all live digital features for further coordination and guest entry." : "Officially finalize your celebration to lock the guest list and archive the digital experience. This action disables new RSVPs and marks the event as successfully orchestrated. You can reopen it at any time if you need to reactivate registry features."} />
        </div>
      </div>
    </div>
  );
};

export default EventCard;