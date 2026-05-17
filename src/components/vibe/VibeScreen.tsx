Replace the recentSprays rendering block with:

{/* Host message at top */}
<div className="mb-2">
  <p className="text-white font-medium uppercase tracking-widest text-[10px]">
    {event.message ?? 'Host Message'}
  </p>
</div>

{/* Recent activity (max 2) */}
{recentSprays.slice(0, 2).map((item, i) => (
  <div key={i} className="flex items-center gap-3 rounded-[1rem] bg-[#0f0f0f]/30 px-4 py-3 border border-[#D4AF37]/10">
    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mr-3">
      <UserCheck className="text-[#D4AF37] w-5 h-5" />
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-white">{item.guest_name}</p>
      <p className="text-[#C9A84C] font-medium text-sm">
        ₦{item.amount.toLocaleString()}
      </p>
    </div>
  </div>
))}

Remove any max-h-40 or overflow-y-auto wrappers around the recentSprays list to prevent scrolling.<dyad-write path="src/pages/VibeScreen.tsx" description="Update the overlay style, renderOverlay, and activity log layout for correct gift box sizing and combined host message + activity display">
const overlayStyle: React.CSSProperties = {
  position: 'fixed' as const,
  inset: 0,
  background: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '16px',
  padding: '20px',
  maxWidth: '280px',
  width: '100%',
  textAlign: 'center',
  zIndex: 200,
  opacity: showOverlay ? 1 : 0,
  transition: 'opacity 0.5s ease-out',
};

const renderOverlay = () => {
  if (!showOverlay || !eventRef.current) return null;
  
  const currentSpray = activeNotification;
  if (!currentSpray || currentSpray.type !== 'spray') return null;

  return (
    <div ref={overlayRef} style={overlayStyle}>
      <Gift className="text-[#C9A84C]" size={48} />
      <p style={{ color: 'white', fontSize: '20px' }}>{currentSpray.guest_name}</p>
      <p style={{ color: '#C9A84C', fontSize: '18px' }}>
        ₦{currentSpray.amount.toLocaleString()}
      </p>
    </div>
  );
};

{/* Host message at top */}
<div className="mb-1">
  <p className="text-white font-medium uppercase tracking-widest text-[10px]">
    {event.message ?? 'Host Message'}
  </p>
</div>

{/* Recent activity (max 2) */}
{recentSprays.slice(0, 2).map((item, i) => (
  <div key={i} className="flex items-center gap-2 rounded-[0.75rem] bg-[#0f0f0f]/30 px-3 py-2 border border-[#D4AF37]/10">
    <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
      <UserCheck className="text-[#D4AF37] w-3 h-3" />
    </div>
    <div className="flex-1 flex items-center justify-between">
      <p className="text-sm font-medium text-white">{item.guest_name}</p>
      <p className="text-[#C9A84C] font-medium text-xs">
        ₦{item.amount.toLocaleString()}
      </p>
    </div>
  </div>
))}