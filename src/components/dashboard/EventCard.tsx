"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Edit, Copy, Check, CheckCircle2, Power, ExternalLink } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EventCardProps {
  event: any;
  onCopyLink: (slug: string) => void;
}

const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [copied, setCopied] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const isFinished = event.is_finished;

  const isVideo = (url: string) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.quicktime'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/event/${event.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    showSuccess("RSVP Link copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
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
      <div className="relative aspect-[4/5] w-full overflow-hidden border border-white/10 group rounded-2xl md:rounded-none">
        {isVideo(event.photo_url) ? (
          <video 
            src={event.photo_url} 
            className={`w-full h-full object-cover ${isFinished ? 'grayscale' : 'grayscale group-hover:grayscale-0'} transition-all duration-1000 group-hover:scale-110`}
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          <img 
            src={event.photo_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
            className={`w-full h-full object-cover ${isFinished ? 'grayscale' : 'grayscale group-hover:grayscale-0'} transition-all duration-1000 group-hover:scale-110`}
            alt={event.event_name}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        
        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-col gap-2 items-end">
          {isFinished ? (
            <span className="bg-gray-500 text-white text-[7px] md:text-[8px] font-black px-2 md:px-3 py-1 uppercase tracking-widest flex items-center gap-1">
              <CheckCircle2 size={10} /> Concluded
            </span>
          ) : event.is_paid ? (
            <span className="bg-green-500 text-black text-[7px] md:text-[8px] font-black px-2 md:px-3 py-1 uppercase tracking-widest">Live</span>
          ) : (
            <Link to={`/payment/${event.id}`}>
              <Button size="sm" className="bg-[#e94560] hover:bg-[#d43d56] text-white text-[7px] md:text-[8px] font-black px-2 md:px-3 py-1 h-auto rounded-none uppercase tracking-widest">
                Activate Page
              </Button>
            </Link>
          )}
          <span className="bg-white/10 backdrop-blur-md text-white text-[7px] md:text-[8px] font-black px-2 md:px-3 py-1 uppercase tracking-widest border border-white/10">
            {event.plan} Plan
          </span>
        </div>

        <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
          <h2 className="text-2xl md:text-3xl font-serif italic text-white mb-2 md:mb-4 line-clamp-2">{event.event_name}</h2>
          <div className="flex flex-col gap-1.5 md:gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-gray-400">
            <div className="flex items-center gap-2"><Calendar className="w-3 h-3 text-[#D4AF37] shrink-0" /> {new Date(event.event_date).toLocaleDateString()}</div>
            <div className="flex items-center gap-2"><MapPin className="w-3 h-3 text-[#D4AF37] shrink-0" /> <span className="truncate">{event.venue}</span></div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/edit-event/${event.id}`)} 
            className="w-full rounded-none border-white/10 bg-white/5 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] py-6 h-auto"
          >
            <Edit className="w-3 h-3 mr-2 shrink-0" /> Edit Details
          </Button>
          
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              onClick={() => window.open(`/event/${event.slug}`, '_blank')}
              className="flex-1 rounded-none border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] py-6 h-auto truncate"
            >
              <ExternalLink className="w-3 h-3 mr-2 shrink-0" /> 
              <span className="truncate">Check Event Page</span>
            </Button>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  onClick={handleCopy}
                  className="shrink-0 rounded-none border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] px-4 py-6 h-auto hover:bg-[#D4AF37]/10 transition-all"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-[#1a1a1a] border-white/10 text-[#D4AF37] text-[8px] font-bold uppercase tracking-widest">
                Copy link
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <Button 
          variant="outline" 
          disabled={loading}
          onClick={toggleFinished}
          className={`w-full rounded-none py-6 h-auto text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] transition-all ${
            isFinished 
              ? 'bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20' 
              : 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20'
          }`}
        >
          <Power className="w-3 h-3 mr-2 shrink-0" />
          {isFinished ? 'Reopen Event' : 'Conclude Event'}
        </Button>
      </div>
    </div>
  );
};

export default EventCard;