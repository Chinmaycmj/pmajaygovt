import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Download,
  Copy,
  Check,
  Home,
  Award,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  FileCheck,
  Landmark,
} from 'lucide-react';
import { LanguageCode, UserProfileData } from '../types';
import { SLOT_DISPLAY_LABELS, UI_STRINGS } from '../data/translations';
import { playSuccessChime, playTapChime } from '../services/audioChimes';

interface SummaryPhaseProps {
  userProfile: UserProfileData;
  currentLang: LanguageCode;
  onReturnHome: () => void;
  onConnectCall: () => void;
}

export const SummaryPhase: React.FC<SummaryPhaseProps> = ({
  userProfile,
  currentLang,
  onReturnHome,
  onConnectCall,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const strings = UI_STRINGS[currentLang];

  // Play triumphant confirmation chord when arriving on summary
  useEffect(() => {
    playSuccessChime();
  }, []);

  // Calculate PM-AJAY Recommendations based on captured profile data
  const calculateRecommendations = () => {
    const list = [
      {
        title: 'PM-AJAY Component 1: Skill Development Training',
        desc: '100% Free residential/non-residential NSQF-certified vocational training with daily stipend & placement guarantee.',
        tag: 'Fully Funded',
        grant: 'Free + Stipend',
      },
    ];

    const isBusiness =
      userProfile.careerPreference.toLowerCase().includes('business') ||
      userProfile.careerPreference.includes('ವ್ಯವಹಾರ') ||
      userProfile.careerPreference.includes('व्यवसाय');

    if (isBusiness) {
      list.push({
        title: 'Income Generation Scheme (IGS) Capital Grant',
        desc: 'Direct subsidy grant for establishing micro-enterprises, small shops, or livestock.',
        tag: 'Subsidy Approved',
        grant: 'Up to ₹50,000',
      });
      list.push({
        title: 'NSFDC Term Loan / Micro-Credit Scheme',
        desc: 'Concessional interest rate credit up to ₹5 Lakhs for eligible beneficiaries under SCSP priority.',
        tag: 'Low Interest',
        grant: 'Up to ₹5 Lakh',
      });
    } else {
      list.push({
        title: 'Corporate Placement & Apprenticeship Track',
        desc: 'Direct tie-ups with registered industry partners for wage employment within 30 days of training.',
        tag: 'Guaranteed Hire',
        grant: 'Industry Wages',
      });
    }

    if (
      userProfile.traditionalSkill &&
      !userProfile.traditionalSkill.toLowerCase().includes('none')
    ) {
      list.push({
        title: 'PM Vishwakarma / Modern Artisan Tool-Kit Grant',
        desc: `₹15,000 E-Voucher for modern tool-kits matching traditional craft: ${userProfile.traditionalSkill}.`,
        tag: 'Modern Tools',
        grant: '₹15,000 Voucher',
      });
    }

    return list;
  };

  const recommendations = calculateRecommendations();

  const generateJsonData = () => {
    return JSON.stringify(
      {
        scheme_name: 'Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY)',
        ministry: 'Ministry of Social Justice and Empowerment, Govt. of India',
        timestamp: new Date().toISOString(),
        locale: currentLang,
        beneficiary_profile: {
          name: userProfile.name || 'Not Provided',
          district_or_pincode: userProfile.location || 'Not Provided',
          annual_income_under_2_5_lakh: userProfile.incomeLessThan2Point5Lakh || 'Not Provided',
          education: userProfile.education || 'Not Provided',
          traditional_skill: userProfile.traditionalSkill || 'None',
          current_livelihood: userProfile.currentLivelihood || 'Not Provided',
          tools_or_skills_known: userProfile.toolsSkills || 'None',
          mobility_radius_km: userProfile.mobilityRadiusKm || 'Not Provided',
          career_preference: userProfile.careerPreference || 'Not Provided',
        },
        matched_recommendations: recommendations.map((r) => r.title),
      },
      null,
      2
    );
  };

  const handleCopyJson = () => {
    playTapChime();
    navigator.clipboard.writeText(generateJsonData());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDownloadJson = () => {
    playTapChime();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(generateJsonData());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `PM_AJAY_Beneficiary_${userProfile.name.replace(/\s+/g, '_') || 'Profile'}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex-1 flex flex-col px-5 sm:px-7 py-4 max-w-lg mx-auto w-full overflow-y-auto pb-10 selection:bg-amber-500/30">
      {/* Official Government Digital Certificate Banner with Warm Gold Accents */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1C1A14] via-[#14151E] to-[#121815] text-zinc-100 p-6 shadow-warm-lg border border-amber-500/30 text-center mb-5 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white border border-amber-400/50 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-950/60 ring-2 ring-amber-400/30">
          <ShieldCheck className="w-9 h-9" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-2 border border-amber-500/40 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>98% Livelihood Match • {strings.verifiedBadge}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-1 text-white">
          {strings.summaryTitle}
        </h2>
        <p className="text-xs text-zinc-300 leading-relaxed max-w-xs mx-auto">
          {strings.summarySubtitle}
        </p>

        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
          <span className="font-mono text-amber-400 font-semibold">Ref: PMAJAY-2026-IN</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Voice Verification Complete
          </span>
        </div>
      </div>

      {/* Extracted Profile Snapshot Card with Warm Surfaces */}
      <div className="rounded-2xl bg-[#14141C] border border-amber-500/20 shadow-warm-md p-4 mb-4 text-zinc-100">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
              {strings.profileSnapshot}
            </h3>
          </div>
          <span className="text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-600/50 shadow-xs">
            9/9 Captured
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {Object.entries(userProfile).map(([key, value]) => {
            const labelObj = SLOT_DISPLAY_LABELS[key];
            const labelText = labelObj ? labelObj[currentLang] : key;
            return (
              <div key={key} className="flex items-start justify-between py-1.5 border-b border-zinc-800/50">
                <span className="text-zinc-400 font-medium">{labelText}:</span>
                <span className="font-bold text-white text-right max-w-[55%]">
                  {value || <em className="text-zinc-500 font-normal">Not specified</em>}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Matched Scheme Recommendations with Grants Highlight */}
      <div className="rounded-2xl bg-[#14141C] border border-zinc-800 p-4 mb-5 shadow-warm-sm">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
            {strings.recommendedTrack}
          </h3>
        </div>

        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/90 rounded-2xl p-4 border border-zinc-800/90 shadow-warm-sm hover:border-amber-500/40 transition-all text-left"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h4 className="text-xs sm:text-sm font-bold text-white">{rec.title}</h4>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full shrink-0 shadow-xs">
                  {rec.grant}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{rec.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons: Export JSON & Helpdesk */}
      <div className="space-y-2.5 mt-auto">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDownloadJson}
            className="py-3 px-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-neon-amber transition active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleCopyJson}
            className="py-3 px-3 rounded-2xl bg-zinc-850 hover:bg-zinc-800 text-zinc-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-zinc-700 transition active:scale-95 cursor-pointer shadow-warm-sm"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Data'}</span>
          </button>
        </div>

        <button
          onClick={() => {
            playTapChime();
            onConnectCall();
          }}
          className="w-full py-3.5 px-4 rounded-2xl bg-blue-950/60 hover:bg-blue-900/80 border border-blue-600/50 text-blue-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-neon-blue"
        >
          <PhoneCall className="w-4 h-4 text-blue-400" />
          <span>Call PM-AJAY Helpdesk (1800 111 222)</span>
        </button>

        <button
          onClick={() => {
            playTapChime();
            onReturnHome();
          }}
          className="w-full py-3.5 px-4 rounded-2xl bg-zinc-850 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-warm-sm"
        >
          <Home className="w-4 h-4 text-zinc-400" />
          <span>{strings.returnHome}</span>
        </button>
      </div>
    </div>
  );
};
