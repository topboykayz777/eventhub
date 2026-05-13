"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Edit, Copy, Check, CheckCircle2, Power } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

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

  const handleCopy = () => {
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
    <div className="lg:col-span-4">
      <div className="relative aspect-[4/5] overflow-hidden border border-white/10 group">
        <img 
          src={event.photo_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
          className={`w-full h-full object-cover ${isFinished ? 'grayscale' : 'grayscale group-hover:grayscale-0'} transition-all duration-1000 group-hover:scale-110`}
          alt={event.event_name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        
        <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
          {isFinished ? (
            <span className="bg-gray-500 text-white text-[8px] font-black px-3 py-1 uppercase tracking-widest flex items-center gap-1">
              <CheckCircle2 size={10} /> Concluded
            </span>
          ) : event.is_paid ? (
            <span className="bg-green-500 text-black text-[8px] font-black px-3 py-1 uppercase tracking-widest">Live</span>
          ) : (
            <Link to={`/payment/${event.id}`}>
              <Button size="sm" className="bg-[#e94560] hover:bg-[#d43d56] text-white text-[8px] font-black px-3 py-1 rounded-none uppercase tracking-widest">
                Activate Page
              </Button>
            </Link>
          )}
          <span className="bg-white/10 backdrop-blur-md text-white text-[8px] font-black px-3 py-1 uppercase tracking-widest border border-white/10">
            {event.plan} Plan
          </span>
        </div>

        <div className="absolute bottom-8 left-8 right-8">
          <h2 className="text-3xl font-serif italic text-white mb-4">{event.event_name}</h2>
          <div className="flex flex-col gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            <div className="flex items-center gap-2"><Calendar className="w-3 h-3 text-[#D4AF37]" /> {new Date(event.event_date).toLocaleDateString()}</div>
            <div className="flex items-center gap-2"><MapPin className="w-3 h-3 text-[#D4AF37]" /> {event.venue}</div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/edit-event/${event.id}`)} 
          className="rounded-none border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] py-6"
        >
          <Edit className="w-3 h-3 mr-2" /> Edit Details
        </Button>
        <Button 
          variant="outline" 
          onClick={handleCopy}
          className="rounded-none border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] py-6"
        >
          {copied ? <Check className="w-3 h-3 mr-2" /> : <Copy className="w-3 h-3 mr-2" />}
          {copied ? 'Copied' : 'Copy Link'}
        </Button>
        <Button 
          variant="outline" 
          disabled={loading}
          onClick={toggleFinished}
          className={`col-span-2 rounded-none py-6 text-[10px] font-bold uppercase tracking-[0.4em] transition-all ${
            isFinished 
              ? 'bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20' 
              : 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20'
          }`}
        >
          <Power className="w-3 h-3 mr-2" />
          {isFinished ? 'Reopen Event' : 'Conclude Event'}
        </Button>
      </div>
    </div>
  );
};

export default EventCard;