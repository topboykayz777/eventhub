import { motion, AnimatePresence } from "framer-motion";
  import { Coins, UserCheck, Sparkles } from "lucide-react";

  const Countdown = ({ targetDate }: { targetDate: string }) => {
    const [timeLeft, setTimeLeft] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: false,
    });

    useEffect(() => {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const target = new Date(targetDate).getTime();
        const distance = target - now;
        const isPast = distance < 0;
        const absDistance = Math.abs(distance);

        setTimeLeft({
          days: Math.floor(absDistance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((absDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((absDistance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((absDistance % (1000 * 60)) / 1000),
          isPast,
        });
      }, 1000);

      return () => clearInterval(timer);
    }, [targetDate]);

    return (
      <div className="space-y-6">
        {timeLeft.isPast ? (
          <div className="text-center mb-4">
            <span className="bg-[#D4AF37] text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
              Event in Progress
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 md:gap-4 text-center max-w-md mx-auto">
            {[
              { label: 'Days', value: timeLeft.days || 0 },
              { label: 'Hrs', value: timeLeft.hours || 0 },
              { label: 'Mins', value: timeLeft.minutes || 0 },
              { label: 'Secs', value: timeLeft.seconds || 0 },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 backdrop-blur-md p-3 md:p-4 border border-white/10">
                <div className="text-2xl md:text-4xl font-serif italic text-white">{item.value}</div>
                <div className="text-[7px] md:text-[8px] uppercase tracking-widest text-gray-500 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  export default Countdown;