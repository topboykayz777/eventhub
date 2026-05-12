{/* Add back button at top */}
  <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6 text-[#D4AF37] text-[8px] font-bold uppercase tracking-widest hover:text-[#D4AF37]/70 flex items-center gap-1">
    <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
  </Button>

  {/* Protect core details - make non-editable and add support button */}
  <div className="mt-8 p-6 bg-[#080808] rounded-[3rem] border border-[#D4AF37]/10">
    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-2">Core Details</h3>
    <div className="space-y-4">
      {/* Non-editable fields with support button */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
          <User className="text-[#D4AF37] w-6 h-6" />
        </div>
        <div>
          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Event Name</p>
          <p className="text-base md:text-lg font-light" disabled>{event.event_name}</p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
          <Calendar className="text-[#D4AF37] w-5 h-5" />
        </div>
        <div>
          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Date & Time</p>
          <p className="text-base md:text-lg font-light" disabled>{event.event_date.slice(0, 16)}</p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
          <MapPin className="text-[#D4AF37] w-5 h-5" />
        </div>
        <div>
          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Venue</p>
          <p className="text-base md:text-lg font-light" disabled>{event.venue}</p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
          <MessageSquare className="text-[#D4AF37] w-5 h-5" />
        </div>
        <div>
          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Host Message</p>
          <p className="text-sm md:text-base font-light" disabled>{event.message}</p>
        </div>
      </div>
      <div className="mt-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/support')}
          className="text-[#D4AF37] text-[8px] font-bold uppercase tracking-widest hover:text-[#D4AF37]/70"
        >
          Need Help? Contact Support
        </Button>
      </div>
    </div>
  </div>