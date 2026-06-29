import Link from 'next/link';
import { ArrowRight, Megaphone } from 'lucide-react';
import dbConnect from '@/lib/dbConnect';
import InscriptionsConfig from '@/models/InscriptionsConfig';

export default async function AnnouncementBanner() {
  try {
    await dbConnect();
    const config = await InscriptionsConfig.findOne().lean();
    if (!config?.banner?.visible) return null;

    const { title, subtitle } = config.banner;

    return (
      <div className="relative z-[60] bg-[#0065FF] px-6 py-3 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-center font-['Montserrat']">
        <div className="flex items-center gap-2">
          <Megaphone size={15} className="text-[#0EE2E2] shrink-0" />
          <span className="text-white font-[900] text-xs uppercase tracking-widest italic">
            {title}
          </span>
        </div>
        {subtitle && (
          <span className="text-[#0EE2E2] font-bold text-[11px] hidden sm:inline opacity-90">
            — {subtitle}
          </span>
        )}
        <Link
          href="/inscriptions"
          className="shrink-0 flex items-center gap-1 bg-[#0EE2E2] text-[#081031] px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white transition-colors"
        >
          S'inscrire <ArrowRight size={11} />
        </Link>
      </div>
    );
  } catch {
    return null;
  }
}
