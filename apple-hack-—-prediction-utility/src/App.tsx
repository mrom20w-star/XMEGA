/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Activity,
  ArrowLeft,
  Award,
  TrendingUp,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Info,
  LogOut,
  Plane,
  Play,
  RotateCcw,
  Send,
  ShieldCheck,
  Shield,
  Signal,
  Sparkles,
  Ticket,
  User,
  Wallet,
  X,
  Zap,
  ChevronLeft,
  AlertCircle,
  Radio,
  Gauge
} from 'lucide-react';
import onexmegaLogo from '@/src/assets/images/onexmega_logo_1791811943972.jpg';

// --- Constants ---
const SCRIPT_NAME = '1xMega';
const PROMO_CODE = 'MXG1';
const BG_VIDEO_URL = 'https://www.image2url.com/r2/default/videos/1783966636085-b5e564d8-3dbe-4413-973f-6486eba32365.mp4';
const TELEGRAM_URL = 'https://t.me/onexmega_official';
const FIREBASE_CRASH_URL = 'https://x-men-256cc-default-rtdb.firebaseio.com/pre/hipr/hipr.json';
const ADMIN_ID = '1729018123';

export enum Screen {
  SPLASH = 'SPLASH',
  CHOOSE_PLATFORM = 'CHOOSE_PLATFORM',
  CONDITION = 'CONDITION',
  CRASH_GAME = 'CRASH_GAME',
}

interface PlatformConfig {
  key: string;
  name: string;
  subName: string;
  tag: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  brandLetter: string;
  downloadUrl: string;
  registerUrl: string;
  registerDomain: string;
}

const PLATFORMS: Record<string, PlatformConfig> = {
  '1xbet': {
    key: '1xbet',
    name: '1xBet',
    subName: '1xbet vip core',
    tag: 'global network',
    accentColor: '#1a73e8',
    badgeBg: 'from-blue-600/30 to-blue-950/40',
    badgeBorder: 'border-blue-500/40',
    brandLetter: '1X',
    downloadUrl: 'https://1xbet.com/',
    registerUrl: 'https://1xbet.com/',
    registerDomain: '1xbet.com',
  },
  melbet: {
    key: 'melbet',
    name: 'MELBET',
    subName: 'melbet vip speed',
    tag: 'high-speed core',
    accentColor: '#f59e0b',
    badgeBg: 'from-amber-500/30 to-amber-950/40',
    badgeBorder: 'border-amber-500/40',
    brandLetter: 'MB',
    downloadUrl: 'https://melbet.com/',
    registerUrl: 'https://melbet.com/',
    registerDomain: 'melbet.com',
  },
  spinbetter: {
    key: 'spinbetter',
    name: 'SpinBetter',
    subName: 'spinbetter vip cloud',
    tag: 'elite odds cluster',
    accentColor: '#8b5cf6',
    badgeBg: 'from-purple-600/30 to-purple-950/40',
    badgeBorder: 'border-purple-500/40',
    brandLetter: 'SB',
    downloadUrl: 'https://spinbetter.com/',
    registerUrl: 'https://spinbetter.com/',
    registerDomain: 'spinbetter.com',
  },
};

interface ToastItem {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface WinnerItem {
  id: string;
  userId: string;
  amount: string;
  platform: string;
  time: string;
}

// Generate realistic Crash multiplier
const generateRandomCrash = (): number => {
  const isHigh = Math.random() < 0.6;
  const val = isHigh ? 1.25 + Math.random() * 1.85 : 3.2 + Math.random() * 5.2;
  return Math.round(val * 100) / 100;
};

const fetchCrashPrediction = async (userId: string): Promise<number> => {
  if (userId.trim() !== ADMIN_ID) {
    return generateRandomCrash();
  }
  try {
    const res = await fetch(`${FIREBASE_CRASH_URL}?t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      const parsed = parseFloat(String(data));
      if (!isNaN(parsed) && parsed >= 1) {
        return Math.round(parsed * 100) / 100;
      }
    }
  } catch (err) {
    console.error('Error fetching firebase crash prediction:', err);
  }
  return generateRandomCrash();
};

// --- Toast System Component ---
function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
}) {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let Icon = Info;
          let textColor = 'text-cyan-400';
          let borderColor = 'border-rose-950';
          let shadow = 'shadow-[0_0_15px_rgba(34,211,238,0.1)]';

          if (toast.type === 'success') {
            Icon = CheckCircle2;
            textColor = 'text-emerald-400';
            borderColor = 'border-emerald-500/35';
            shadow = 'shadow-[0_0_20px_rgba(0,255,102,0.15)]';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            textColor = 'text-rose-500';
            borderColor = 'border-rose-500/35';
            shadow = 'shadow-[0_0_20px_rgba(244,63,94,0.15)]';
          }

          return (
            <motion.div
              key={toast.id}
              id={`toast-${toast.id}`}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto w-full bg-black/85 backdrop-blur-md p-4 rounded-xl flex items-start gap-3 border relative overflow-hidden ${borderColor} ${shadow}`}
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-[3px] ${
                  toast.type === 'success'
                    ? 'bg-crimson'
                    : toast.type === 'error'
                    ? 'bg-rose-500'
                    : 'bg-cyan-400'
                }`}
              />
              <div className="mt-0.5 shrink-0 pl-1">
                <Icon className={`w-5 h-5 ${textColor}`} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-100 font-sans leading-relaxed uppercase tracking-wide">
                  {toast.text}
                </p>
              </div>
              <button
                id={`close-toast-${toast.id}`}
                onClick={() => removeToast(toast.id)}
                className="text-slate-500 hover:text-white transition-colors cursor-pointer p-0.5 rounded-lg hover:bg-white/5 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// --- 1. Splash Screen ---
function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const loadingSteps = [
    'تهيئة نواة 1xMega الآمنة',
    'ربط خوادم 1xBet & Melbet & SpinBetter',
    'فك تشفير رادار معاملات الطيارة',
    'تجهيز محرك التوقعات الفائق',
  ];

  useEffect(() => {
    const stepIncrement = 0.85;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 220);
          return 100;
        }
        return prev + stepIncrement;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [onComplete]);

  const currentStepIndex = Math.min(
    loadingSteps.length - 1,
    Math.floor((progress / 100) * loadingSteps.length)
  );

  return (
    <div
      id="splash-screen"
      className="fixed inset-0 bg-black/75 backdrop-blur-[6px] flex flex-col justify-between py-14 px-6 select-none z-50 overflow-hidden"
    >
      <div className="absolute inset-0 grid-fade pointer-events-none" />
      <div className="absolute top-[36%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] bg-crimson/15 rounded-full blur-[160px] pointer-events-none animate-pulse-slow" />
      <div className="absolute inset-0 vignette pointer-events-none" />

      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm mx-auto flex items-center justify-between rounded-2xl px-3.5 py-2 glass-panel relative z-10"
      >
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-ping" />
          <span className="text-[8.5px] font-mono tracking-[0.28em] text-slate-300 font-black uppercase">
            1XMEGA SECURE CORE
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-crimson-bright" />
          <span className="text-[8.5px] font-mono tracking-[0.24em] text-crimson-bright font-black uppercase">
            ENCRYPTED
          </span>
        </div>
      </motion.div>

      {/* Center Logo & Title */}
      <div className="flex flex-col items-center relative z-10 my-auto text-center">
        <motion.div
          initial={{ scale: 0.82, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-8"
        >
          <div className="absolute -inset-10 rounded-full opacity-70 blur-[1px] halo-ring animate-spin-slow" />
          <div className="absolute -inset-5 rounded-full border border-crimson/25" />
          <div className="absolute -inset-16 bg-crimson/20 rounded-full blur-3xl" />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="relative w-40 h-40 rounded-[2.25rem] p-[2px] bg-gradient-to-br from-crimson via-cyan-400/40 to-transparent shadow-[0_28px_80px_-20px_rgba(255,0,51,0.7)]"
          >
            <div className="w-full h-full rounded-[calc(2.25rem-2px)] overflow-hidden bg-obsidian relative">
              <img
                src={onexmegaLogo}
                alt="شعار 1xMega"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute inset-0 animate-shimmer" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[calc(2.25rem-2px)]" />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-3xl sm:text-4xl font-black font-orbitron tracking-[0.22em] text-white uppercase leading-none">
            1X
            <span className="text-crimson-bright glow-text-crimson-bright">
              MEGA
            </span>
          </h1>
          <p className="text-[10px] font-mono tracking-[0.3em] text-cyan-400 font-extrabold uppercase mt-3">
            CRASH PREDICTION ENGINE
          </p>
        </motion.div>
      </div>

      {/* Bottom Loading Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-sm mx-auto relative z-10 flex flex-col items-center gap-3 text-center"
      >
        <div className="flex items-center justify-between w-full text-[10px] font-mono font-black text-slate-400">
          <span className="text-slate-300 font-sans">
            {loadingSteps[currentStepIndex]}
          </span>
          <span className="text-crimson-bright font-orbitron">
            {Math.floor(progress)}%
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-crimson-dark via-crimson to-cyan-400 shadow-[0_0_12px_rgba(255,0,51,0.6)] transition-all duration-75"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <span className="text-[8.5px] font-mono tracking-[0.25em] text-slate-500 uppercase">
          ACTIVATING CRASH MULTIPLIER RADAR
        </span>
      </motion.div>
    </div>
  );
}

// --- 2. Choose Platform Screen ---
function ChoosePlatformScreen({
  onSelect,
  onBack,
}: {
  onSelect: (platformKey: string) => void;
  onBack: () => void;
}) {
  const platformList = Object.values(PLATFORMS);

  return (
    <div
      id="choose-platform-screen"
      className="min-h-screen bg-transparent text-slate-100 flex flex-col py-6 px-4 relative overflow-y-auto select-none pb-12"
    >
      <div className="absolute inset-0 grid-fade pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[560px] h-[560px] bg-crimson/[0.06] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 vignette pointer-events-none" />

      {/* Top Header */}
      <div className="w-full max-w-lg mx-auto flex items-center justify-between rounded-2xl px-3.5 py-2.5 glass-panel relative z-10">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer border border-white/[0.06]"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-xl overflow-hidden border border-crimson/30 shrink-0">
            <img
              src={onexmegaLogo}
              alt="1xMega"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.22em] text-slate-300 font-extrabold uppercase">
              1XMEGA VIP
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-crimson" />
          <span className="text-[9px] font-mono font-bold text-crimson-bright uppercase tracking-[0.2em]">
            PROMO: {PROMO_CODE}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-lg mx-auto flex-1 flex flex-col justify-center relative z-10">
        <div className="text-center mb-8 mt-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-panel-light mb-4">
            <Sparkles className="w-3.5 h-3.5 text-crimson-bright" />
            <span className="text-[9px] font-mono tracking-[0.24em] text-crimson-bright font-black uppercase">
              TRIPLE PLATFORM ENGINE
            </span>
          </div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/55">
            اختر{' '}
            <span className="text-crimson-bright glow-text-crimson-bright">
              المنصة
            </span>
          </h2>
          <p className="text-[13px] text-slate-400 mt-3 max-w-xs mx-auto leading-relaxed font-medium">
            اختر المنصة لربط السيرفر وتفعيل كود الخصم <span className="text-crimson-bright font-mono font-bold">{PROMO_CODE}</span>
          </p>
        </div>

        {/* 3 Platform Cards */}
        <div className="space-y-3.5">
          {platformList.map((plat, idx) => (
            <motion.button
              key={plat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => onSelect(plat.key)}
              className="w-full relative group text-right rounded-[1.75rem] p-[1.5px] bg-gradient-to-bl from-crimson/45 via-white/[0.06] to-transparent cursor-pointer shadow-[0_24px_60px_-25px_rgba(255,0,51,0.5)]"
            >
              <div className="rounded-[calc(1.75rem-2px)] px-5 py-4.5 glass-card-premium overflow-hidden flex items-center justify-between gap-4 transition-all group-hover:bg-crimson/[0.03]">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson/50 to-transparent" />
                <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-crimson group-hover:border-crimson-bright group-hover:text-white transition-all shrink-0">
                  <ChevronLeft className="w-4.5 h-4.5 group-hover:-translate-x-0.5 transition-transform" />
                </div>
                <div className="flex items-center gap-4 flex-row-reverse text-right">
                  {/* Platform Brand Badge */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plat.badgeBg} ${plat.badgeBorder} border flex items-center justify-center shadow-lg group-hover:scale-105 transition-all shrink-0`}>
                    <span className="font-orbitron font-black text-lg text-white tracking-wider">
                      {plat.brandLetter}
                    </span>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono tracking-[0.22em] text-crimson-bright font-extrabold uppercase mb-1">
                      <Zap className="w-3 h-3" /> {plat.tag}
                    </span>
                    <h3 className="text-lg font-black text-white tracking-wide">
                      {plat.name}
                    </h3>
                    <p className="text-[11.5px] text-slate-400 font-medium mt-0.5 leading-relaxed">
                      تفعيل رادار توقعات الطيارة بكود الخصم <span className="font-mono text-white font-bold">{PROMO_CODE}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Stats Row */}
        <div className="mt-7 grid grid-cols-3 gap-3">
          {[
            { k: 'ACCURACY', v: '98.4%' },
            { k: 'PROMO CORE', v: PROMO_CODE },
            { k: 'CRASH USERS', v: '24K+' },
          ].map((item) => (
            <div
              key={item.k}
              className="rounded-2xl glass-panel-light px-3 py-3 text-center"
            >
              <div className="text-base font-black font-orbitron text-white glow-text-crimson">
                {item.v}
              </div>
              <div className="text-[8px] font-mono tracking-[0.2em] text-slate-500 font-bold mt-1">
                {item.k}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center flex flex-col items-center gap-2">
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 hover:bg-cyan-500/20 transition-all text-[11px] font-mono font-bold"
          >
            <Send className="w-3.5 h-3.5" />
            <span>t.me/onexmega_official</span>
          </a>
          <p className="text-[9px] text-slate-600 font-mono tracking-[0.25em] uppercase">
            1XMEGA VERIFICATION LAYER • ALL NETWORKS CONNECTED
          </p>
        </div>
      </div>
    </div>
  );
}

// --- 3. Condition / Activation Screen ---
function ConditionScreen({
  initialPlatform,
  onBack,
  onSubmit,
  addToast,
}: {
  initialPlatform: string;
  onBack: () => void;
  onSubmit: (userId: string, platform: string, subPlatform: string) => void;
  addToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}) {
  const [platformKey] = useState(initialPlatform);
  const [userIdInput, setUserIdInput] = useState('');
  const [telegramDone, setTelegramDone] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);
  const [registerDone, setRegisterDone] = useState(false);
  const [promoCopied, setPromoCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [verifyStatusText, setVerifyStatusText] = useState(
    'جاري تهيئة قناة الاتصال...'
  );

  const platform = PLATFORMS[platformKey] || PLATFORMS['1xbet'];

  const handleCopyPromo = () => {
    navigator.clipboard.writeText(PROMO_CODE);
    setPromoCopied(true);
    addToast(`تم نسخ كود الخصم الرسمي: ${PROMO_CODE}`, 'success');
    setTimeout(() => setPromoCopied(false), 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userIdInput.trim()) {
      const inputEl = document.getElementById('user-id-input');
      inputEl?.focus();
      inputEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      addToast('يرجى إدخال معرف اللاعب (ID) للمتابعة', 'error');
      return;
    }

    setIsVerifying(true);
    setVerifyProgress(0);
    setVerifyStatusText('جاري فتح قناة التحقق الآمنة لـ 1xMega...');

    const stages = [
      { progress: 18, text: `فحص اتصال خادم ${platform.name} ومطابقة الـ ID الرقمي...` },
      { progress: 38, text: 'التحقق من صحة المعطيات وسجلات قناة التليجرام (t.me/onexmega_official)...' },
      { progress: 62, text: `مزامنة كود الخصم المعتمد [${PROMO_CODE}] في قاعدة البيانات...` },
      { progress: 85, text: 'استيراد رخصة رادار الطيارة وتأمين نظام تجنب الحظر لشبكة VIP...' },
      { progress: 100, text: 'تم إنشاء ترخيص 1xMega VIP بنجاح! جاري تحويلك للرادار...' },
    ];

    let stageIdx = 0;
    const interval = setInterval(() => {
      setVerifyProgress((prev) => {
        const next = prev + 1;
        if (stageIdx < stages.length && next >= stages[stageIdx].progress) {
          setVerifyStatusText(stages[stageIdx].text);
          stageIdx++;
        }
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVerifying(false);
            onSubmit(userIdInput.trim(), platformKey, platform.subName);
          }, 500);
          return 100;
        }
        return next;
      });
    }, 40);
  };

  const totalSteps = 6;
  const completedSteps =
    (telegramDone ? 1 : 0) +
    (downloadDone ? 1 : 0) +
    (registerDone ? 1 : 0) +
    (promoCopied ? 1 : 0) +
    1 + // Minimum deposit acknowledged
    (userIdInput.trim().length >= 4 ? 1 : 0);

  const completionPercentage = Math.round((completedSteps / totalSteps) * 100);

  const StepRow = ({
    stepNum,
    icon,
    title,
    desc,
    done,
    label,
  }: {
    stepNum: string;
    icon: React.ReactNode;
    title: string;
    desc: string;
    done: boolean;
    label: string;
  }) => (
    <div className="flex items-start justify-between gap-3 mb-4">
      <span
        className={`text-[9px] font-mono font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border shrink-0 ${
          done
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
            : 'bg-crimson/[0.07] text-crimson-bright border-crimson/25'
        }`}
      >
        {done ? 'done' : label}
      </span>
      <div className="flex items-center gap-3 flex-row-reverse text-right">
        <div className="w-11 h-11 rounded-2xl bg-crimson/10 border border-crimson/25 flex items-center justify-center text-crimson-bright shrink-0 shadow-[0_0_18px_-6px_rgba(255,0,51,0.7)]">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-row-reverse">
            <h3 className="text-[13.5px] font-black text-white">{title}</h3>
            <span className="text-[10px] font-mono font-black text-slate-600">
              {stepNum}
            </span>
          </div>
          <p className="text-[10.5px] text-slate-400 font-medium mt-1 leading-relaxed">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div
      id="condition-main-screen"
      className="min-h-screen bg-transparent text-slate-100 flex flex-col py-6 px-4 relative overflow-y-auto select-none pb-16"
    >
      <div className="absolute inset-0 grid-fade pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[560px] h-[560px] bg-crimson/[0.06] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 vignette pointer-events-none" />

      <div className="w-full max-w-lg mx-auto relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between rounded-2xl px-3.5 py-2.5 glass-panel">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer border border-white/[0.06]"
              title="رجوع"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-crimson/30 shrink-0">
              <img
                src={onexmegaLogo}
                alt={SCRIPT_NAME}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[10px] font-mono tracking-[0.22em] text-slate-300 font-extrabold uppercase">
              {platform.subName}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-crimson" />
            <span className="text-[9px] font-mono font-bold text-crimson-bright uppercase tracking-[0.2em]">
              secure
            </span>
          </div>
        </div>

        {/* Section Title */}
        <div className="text-center mt-8 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-panel-light mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" />
            <span className="text-[9px] font-mono tracking-[0.24em] text-crimson-bright font-black uppercase">
              1XMEGA ACTIVATION
            </span>
          </div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/55">
            شروط{' '}
            <span className="text-crimson-bright glow-text-crimson-bright">
              التفعيل
            </span>
          </h2>
          <p className="text-[12.5px] text-slate-400 mt-2.5 max-w-xs mx-auto leading-relaxed font-medium">
            أكمل الخطوات لربط حساب {platform.name} وتفعيل رادار الطيارة
          </p>

          {/* Progress Overview Card */}
          <div className="mt-5 rounded-2xl glass-panel-light px-4 py-3.5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-mono font-black text-white">
                {completionPercentage}%
              </span>
              <span className="text-[10px] text-slate-400 font-bold">
                خطوات مكتملة{' '}
                <span className="font-mono text-crimson-bright">
                  {completedSteps}/{totalSteps}
                </span>
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-crimson-dark via-crimson to-cyan-400 shadow-[0_0_12px_rgba(255,0,51,0.55)]"
              />
            </div>
          </div>
        </div>

        {/* Steps Cards List */}
        <div className="space-y-3.5">
          {/* Step 1: Telegram */}
          <div className="relative rounded-[1.6rem] p-[1.2px] bg-gradient-to-bl from-crimson/35 via-white/[0.05] to-transparent">
            <div className="rounded-[calc(1.6rem-2px)] glass-card-premium p-5 text-right">
              <StepRow
                stepNum="01"
                icon={<Send className="w-5 h-5" />}
                title="الانضمام لقناة التليجرام الرسمية"
                desc="رابط القناة: https://t.me/onexmega_official — تابع كود التفعيل اليومي وتحديثات رادار الطيارة المباشرة"
                done={telegramDone}
                label="step 1"
              />
              <button
                type="button"
                onClick={() => {
                  window.open(TELEGRAM_URL, '_blank');
                  setTelegramDone(true);
                  addToast('تم فتح قناة التليجرام: @onexmega_official', 'info');
                }}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-black/60 border border-white/[0.06] hover:border-crimson/40 transition-all cursor-pointer"
              >
                <span
                  className={`text-[10px] font-black px-3.5 py-1.5 rounded-xl ${
                    telegramDone
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                      : 'bg-crimson text-white shadow-[0_0_18px_-4px_rgba(255,0,51,0.8)]'
                  }`}
                >
                  {telegramDone ? '✓ تم' : 'انضمام'}
                </span>
                <span className="text-[11.5px] font-bold text-slate-300 font-mono" dir="ltr">
                  t.me/onexmega_official
                </span>
              </button>
            </div>
          </div>

          {/* Step 2: Download App */}
          <div className="relative rounded-[1.6rem] p-[1.2px] bg-gradient-to-bl from-crimson/35 via-white/[0.05] to-transparent">
            <div className="rounded-[calc(1.6rem-2px)] glass-card-premium p-5 text-right">
              <StepRow
                stepNum="02"
                icon={<Zap className="w-5 h-5" />}
                title={`تحميل تطبيق ${platform.name}`}
                desc="قم بتحميل وتثبيت التطبيق الرسمي للمنصة"
                done={downloadDone}
                label="step 2"
              />
              <button
                type="button"
                onClick={() => {
                  window.open(platform.downloadUrl, '_blank');
                  setDownloadDone(true);
                  addToast(`تم فتح رابط تحميل تطبيق ${platform.name}`, 'info');
                }}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-black/60 border border-white/[0.06] hover:border-crimson/40 transition-all cursor-pointer"
              >
                <span
                  className={`text-[10px] font-black px-3.5 py-1.5 rounded-xl ${
                    downloadDone
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                      : 'bg-crimson text-white shadow-[0_0_18px_-4px_rgba(255,0,51,0.8)]'
                  }`}
                >
                  {downloadDone ? '✓ تم' : 'تحميل'}
                </span>
                <span className="text-[11.5px] font-bold text-slate-300">
                  {platform.name} — النسخة الرسمية
                </span>
              </button>
            </div>
          </div>

          {/* Step 3: Register */}
          <div className="relative rounded-[1.6rem] p-[1.2px] bg-gradient-to-bl from-crimson/35 via-white/[0.05] to-transparent">
            <div className="rounded-[calc(1.6rem-2px)] glass-card-premium p-5 text-right">
              <StepRow
                stepNum="03"
                icon={<ExternalLink className="w-5 h-5" />}
                title="التسجيل في الموقع الرسمي"
                desc={`أنشئ حسابك الرسمي على منصة ${platform.name} مع كود ${PROMO_CODE}`}
                done={registerDone}
                label="step 3"
              />
              <button
                type="button"
                onClick={() => {
                  window.open(platform.registerUrl, '_blank');
                  setRegisterDone(true);
                  addToast(`تم فتح صفحة التسجيل لمنصة ${platform.name}`, 'info');
                }}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-black/60 border border-white/[0.06] hover:border-crimson/40 transition-all cursor-pointer"
              >
                <span
                  className={`text-[10px] font-black px-3.5 py-1.5 rounded-xl ${
                    registerDone
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                      : 'bg-crimson text-white shadow-[0_0_18px_-4px_rgba(255,0,51,0.8)]'
                  }`}
                >
                  {registerDone ? '✓ تم' : 'تسجيل'}
                </span>
                <span className="text-[11.5px] font-bold text-slate-300">
                  {platform.registerDomain} — الموقع الرسمي
                </span>
              </button>
            </div>
          </div>

          {/* Step 4: Promo Code */}
          <div className="relative rounded-[1.6rem] p-[1.2px] bg-gradient-to-bl from-crimson/35 via-white/[0.05] to-transparent">
            <div className="rounded-[calc(1.6rem-2px)] glass-card-premium p-5 text-right">
              <StepRow
                stepNum="04"
                icon={<Ticket className="w-5 h-5" />}
                title="كود الخصم عند التسجيل"
                desc="انسخ الكود واستخدمه أثناء إنشاء الحساب لتفعيل البوت"
                done={promoCopied}
                label="step 4"
              />
              <button
                type="button"
                onClick={handleCopyPromo}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-black/60 border border-dashed border-crimson/40 hover:border-crimson/80 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-1.5 text-[10px] font-black text-crimson-bright">
                  {promoCopied ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {promoCopied ? 'تم النسخ' : 'نسخ'}
                </span>
                <span className="font-mono text-xl font-black text-white tracking-[0.2em] glow-text-crimson">
                  {PROMO_CODE}
                </span>
              </button>
            </div>
          </div>

          {/* Step 5: Minimum Deposit */}
          <div className="relative rounded-[1.6rem] p-[1.2px] bg-gradient-to-bl from-crimson/35 via-white/[0.05] to-transparent">
            <div className="rounded-[calc(1.6rem-2px)] glass-card-premium p-5 text-right">
              <StepRow
                stepNum="05"
                icon={<Wallet className="w-5 h-5" />}
                title="الحد الأدنى للإيداع"
                desc="الرصيد يظل ملكك بالكامل وقابل للسحب في أي وقت"
                done={true}
                label="step 5"
              />
              <div className="flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-black/60 border border-white/[0.06]">
                <span className="font-mono text-base font-black text-white bg-crimson/15 border border-crimson/35 px-3 py-1 rounded-xl">
                  300 EGP
                </span>
                <span className="text-[10px] text-slate-500 font-bold">أو</span>
                <span className="font-mono text-base font-black text-white bg-crimson px-3 py-1 rounded-xl shadow-[0_0_18px_-4px_rgba(255,0,51,0.8)]">
                  6$
                </span>
              </div>
            </div>
          </div>

          {/* Step 6: User ID Input */}
          <div className="relative rounded-[1.6rem] p-[1.2px] bg-gradient-to-bl from-crimson/35 via-white/[0.05] to-transparent">
            <div className="rounded-[calc(1.6rem-2px)] glass-card-premium p-5 text-right">
              <StepRow
                stepNum="06"
                icon={<User className="w-5 h-5" />}
                title="رقم حساب اللاعب (ID)"
                desc={`أدخل معرفك الرقمي في ${platform.name} لمطابقة ترخيص 1xMega`}
                done={userIdInput.trim().length >= 4}
                label="step 6"
              />
              <div className="flex items-center bg-black/70 rounded-2xl border border-white/[0.08] focus-within:border-crimson transition-all px-3">
                <User className="w-4.5 h-4.5 text-crimson/70 shrink-0" />
                <input
                  id="user-id-input"
                  type="text"
                  dir="ltr"
                  placeholder="529048322"
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                  className="w-full bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none py-3.5 px-3 font-mono font-black text-sm text-right"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
            onClick={handleFormSubmit}
            className="w-full relative overflow-hidden py-4 rounded-2xl font-black text-sm text-white cursor-pointer border border-crimson/30 shadow-[0_20px_50px_-22px_rgba(255,0,51,0.9)]"
          >
            <span className="absolute inset-0 bg-gradient-to-l from-crimson-dark via-crimson to-cyan-400" />
            <span className="absolute inset-0 animate-shimmer" />
            <span className="relative flex items-center justify-center gap-2">
              <Plane className="w-4 h-4" />
              تأكيد البيانات والدخول لرادار الطيارة ⚡
            </span>
          </motion.button>
          <p className="text-center text-[9px] text-slate-600 font-mono tracking-[0.22em] uppercase mt-4">
            1XMEGA ENCRYPTED VERIFICATION LAYER
          </p>
        </div>
      </div>

      {/* Verification Modal */}
      {isVerifying && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6">
          <div className="absolute inset-0 grid-fade pointer-events-none" />
          <div className="w-full max-w-sm text-center relative z-10 flex flex-col items-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-crimson/25 rounded-full blur-3xl animate-pulse" />
              <div className="w-24 h-24 rounded-full border border-crimson/50 flex items-center justify-center relative bg-black/90">
                <Plane className="w-11 h-11 text-crimson animate-pulse" />
                <div className="absolute -inset-2 rounded-full halo-ring animate-spin-slow" />
              </div>
            </div>
            <p className="text-[11px] text-crimson-bright font-black mb-7 h-10 flex items-center px-4">
              {verifyStatusText}
            </p>
            <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden mb-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-crimson-dark via-crimson to-cyan-400 transition-all duration-75"
                style={{ width: `${verifyProgress}%` }}
              />
            </div>
            <div className="w-full flex items-center justify-between text-[8px] font-mono tracking-widest text-slate-500 font-bold">
              <span>SECURITY LEVEL: 1XMEGA ENCRYPTED</span>
              <span className="text-white">{verifyProgress}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- 4. Crash Game Screen (1xMega Exclusive Predictor) ---
function CrashGameScreen({
  userId,
  platformKey,
  onBack,
  addToast,
}: {
  userId: string;
  platformKey: string;
  onBack: () => void;
  addToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}) {
  const [targetOdd, setTargetOdd] = useState(1);
  const [currentOdd, setCurrentOdd] = useState(1);
  const [state, setState] = useState<'idle' | 'running' | 'done'>('idle');
  const [loading, setLoading] = useState(true);
  const [historyOdds, setHistoryOdds] = useState<number[]>([1.84, 3.20, 1.45, 7.82, 2.10]);
  const [liveWinners, setLiveWinners] = useState<WinnerItem[]>([
    { id: '1', userId: '5829****21', amount: '+1,450 EGP', platform: '1xbet', time: 'Just now' },
    { id: '2', userId: '1029****56', amount: '+38.50$', platform: 'melbet', time: '1s ago' },
    { id: '3', userId: '9381****10', amount: '+2,900 EGP', platform: 'spinbetter', time: '2s ago' },
    { id: '4', userId: '4829****04', amount: '+75.00$', platform: '1xbet', time: '4s ago' },
    { id: '5', userId: '2019****88', amount: '+850 EGP', platform: 'melbet', time: '5s ago' },
  ]);
  const animRef = useRef<number | null>(null);

  const activePlatform = PLATFORMS[platformKey] || PLATFORMS['1xbet'];

  useEffect(() => {
    let isMounted = true;
    fetchCrashPrediction(userId).then((val) => {
      if (isMounted) {
        setTargetOdd(val);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [userId]);

  // Live winners feed simulation
  useEffect(() => {
    const prefixes = ['11', '24', '38', '45', '59', '73', '81', '90', '98'];
    const pKeys = ['1xbet', 'melbet', 'spinbetter'];
    const interval = setInterval(() => {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const lastDigits = Math.floor(10 + Math.random() * 90).toString();
      const fakeId = `${prefix}${Math.floor(1000 + Math.random() * 9000)}****${lastDigits}`;
      const isEgp = Math.random() > 0.4;
      const amount = isEgp
        ? `+${(Math.floor(4 + Math.random() * 35) * 150).toLocaleString()} EGP`
        : `+${(Math.floor(12 + Math.random() * 150)).toFixed(2)}$`;

      const newWinner: WinnerItem = {
        id: Math.random().toString(),
        userId: fakeId,
        amount,
        platform: pKeys[Math.floor(Math.random() * pKeys.length)],
        time: 'Just now',
      };

      setLiveWinners((prev) => {
        const updated = prev.map((item) => ({
          ...item,
          time:
            item.time === 'Just now'
              ? '3s ago'
              : item.time.includes('s ago')
              ? `${parseInt(item.time) + 3}s ago`
              : item.time,
        }));
        return [newWinner, ...updated.slice(0, 4)];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStartFlight = async () => {
    if (state === 'running') return;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setLoading(true);
    setCurrentOdd(1);

    const odd = await fetchCrashPrediction(userId);
    setTargetOdd(odd);
    setLoading(false);
    setState('running');

    const startTime = performance.now();
    const duration = 1600; // ms
    const step = (now: number) => {
      const elapsed = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 2);
      const val = 1 + (odd - 1) * eased;
      setCurrentOdd(Math.round(val * 100) / 100);

      if (elapsed < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        setCurrentOdd(odd);
        setState('done');
        setHistoryOdds((prev) => [odd, ...prev.slice(0, 4)]);
        addToast(`تم إتمام الرحلة بنجاح عند معامل ${odd.toFixed(2)}x`, 'success');
      }
    };
    animRef.current = requestAnimationFrame(step);
  };

  const handleRestart = async () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setState('idle');
    setCurrentOdd(1);
    setLoading(true);
    const odd = await fetchCrashPrediction(userId);
    setTargetOdd(odd);
    setLoading(false);
    addToast('تم تحديث الرادار وتوليد معامل جديد', 'info');
  };

  const progressPercent = Math.min(
    ((currentOdd - 1) / Math.max(targetOdd - 1, 0.01)) * 100,
    100
  );

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col py-6 px-4 relative overflow-y-auto select-none pb-14">
      <div className="absolute inset-0 grid-fade pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[560px] h-[560px] bg-crimson/[0.06] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 vignette pointer-events-none" />

      {/* Header */}
      <div className="w-full max-w-lg mx-auto flex items-center justify-between rounded-2xl px-3.5 py-2.5 glass-panel relative z-10">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer border border-white/[0.06]"
            title="رجوع"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-xl overflow-hidden border border-crimson/30 shrink-0">
            <img
              src={onexmegaLogo}
              alt={SCRIPT_NAME}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[10px] font-mono tracking-[0.22em] text-slate-300 font-extrabold uppercase">
            1XMEGA CRASH RADAR
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-crimson/10 border border-crimson/30">
            <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-ping" />
            <span className="text-[9px] font-mono font-bold text-crimson-bright uppercase tracking-[0.15em]">
              {activePlatform.name}
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-lg mx-auto flex-1 flex flex-col justify-center relative z-10">
        <div className="text-center my-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-panel-light mb-3">
            <Plane className="w-3.5 h-3.5 text-crimson-bright" />
            <span className="text-[9px] font-mono tracking-[0.24em] text-crimson-bright font-black uppercase">
              LIVE PREDICTION ENGINE
            </span>
          </div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/55">
            رادار{' '}
            <span className="text-crimson-bright glow-text-crimson-bright">
              الطيارة
            </span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-2 text-[12px] text-slate-400 font-medium">
            <span>
              المنصة:{' '}
              <span className="font-bold text-white font-mono">
                {activePlatform.name}
              </span>
            </span>
            <span className="text-slate-600">•</span>
            <span>
              ID:{' '}
              <span className="font-mono text-slate-300 font-bold">{userId}</span>
            </span>
            <span className="text-slate-600">•</span>
            <span>
              كود:{' '}
              <span className="font-mono text-crimson-bright font-bold">{PROMO_CODE}</span>
            </span>
          </div>
        </div>

        {/* History coefficients bar */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="text-[9px] font-mono uppercase text-slate-500 font-bold tracking-wider">
            RECENT ROUNDS:
          </span>
          <div className="flex items-center gap-1.5">
            {historyOdds.map((val, idx) => (
              <span
                key={idx}
                className={`text-[10px] font-orbitron font-black px-2 py-0.5 rounded-lg border ${
                  val >= 2
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                }`}
              >
                {val.toFixed(2)}x
              </span>
            ))}
          </div>
        </div>

        {/* Multiplier Radar Display */}
        <div className="rounded-[1.9rem] p-[1.5px] bg-gradient-to-bl from-crimson/45 via-white/[0.06] to-transparent shadow-[0_28px_70px_-30px_rgba(255,0,51,0.6)]">
          <div className="rounded-[calc(1.9rem-2px)] glass-card-premium px-6 py-8 relative overflow-hidden text-center">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson/50 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 halo-ring animate-spin-slow opacity-40" />
            </div>

            <div className="relative">
              {/* Status Header */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <Signal
                  className={`w-3.5 h-3.5 ${
                    state === 'running'
                      ? 'text-crimson animate-pulse'
                      : 'text-slate-600'
                  }`}
                />
                <span className="text-[9px] font-mono tracking-[0.26em] text-slate-400 font-black uppercase">
                  {state === 'running'
                    ? 'SUPERSONIC FLIGHT IN PROGRESS...'
                    : state === 'done'
                    ? 'CASHED OUT AT PREDICTED PEAK'
                    : '1XMEGA RADAR LOCKED'}
                </span>
              </div>

              {/* Huge Multiplier */}
              <motion.div
                key={state}
                animate={
                  state === 'running'
                    ? { scale: [1, 1.04, 1] }
                    : { scale: 1 }
                }
                transition={{
                  repeat: state === 'running' ? Infinity : 0,
                  duration: 0.9,
                }}
                className="font-orbitron text-6xl font-black text-white glow-text-crimson-bright tabular-nums"
              >
                {currentOdd.toFixed(2)}
                <span className="text-crimson-bright">x</span>
              </motion.div>

              {/* Progress Bar */}
              <div className="mt-6 h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-crimson-dark via-crimson to-cyan-400 shadow-[0_0_12px_rgba(255,0,51,0.6)] transition-[width] duration-75"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Predicted Odd Badge */}
              <div className="mt-5 inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl glass-panel-light">
                <Activity className="w-4 h-4 text-crimson-bright" />
                <span className="text-[10px] font-mono font-black text-slate-300 tracking-widest uppercase">
                  الأودد المتوقع:
                </span>
                <span className="font-orbitron text-lg font-black text-crimson-bright glow-text-crimson">
                  {loading ? '--' : `${targetOdd.toFixed(2)}x`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartFlight}
            disabled={state === 'running' || loading}
            className="relative overflow-hidden py-4 rounded-2xl font-black text-sm text-white cursor-pointer border border-crimson/30 shadow-[0_20px_50px_-24px_rgba(255,0,51,0.9)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute inset-0 bg-gradient-to-l from-crimson-dark via-crimson to-cyan-400" />
            <span className="relative flex items-center justify-center gap-2 font-orbitron tracking-wider">
              <Play className="w-4 h-4 fill-white" /> START FLIGHT
            </span>
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRestart}
            className="py-4 rounded-2xl font-black text-sm text-slate-200 cursor-pointer glass-panel hover:text-white transition-all flex items-center justify-center gap-2 font-orbitron tracking-wider"
          >
            <RotateCcw className="w-4 h-4 text-crimson-bright" /> RE-CALIBRATE
          </motion.button>
        </div>

        {/* Live Winners Feed */}
        <div
          id="live-winners-panel"
          className="mt-6 bg-black/75 border border-white/[0.08] backdrop-blur-2xl p-4.5 rounded-3xl shadow-2xl"
        >
          <div className="flex items-center justify-between mb-3 border-b border-white/[0.05] pb-2.5">
            <div className="flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-amber-400 animate-bounce" />
              <span className="text-[10px] font-orbitron tracking-widest text-slate-300 font-black uppercase">
                1XMEGA REAL-TIME PAYOUT CLOUD
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[8.5px] font-orbitron tracking-wider text-emerald-400 font-black glow-text-crimson">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>LIVE WINS</span>
            </div>
          </div>

          <div
            id="live-winners-list"
            className="space-y-2 h-[120px] overflow-hidden relative"
          >
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black via-black/25 to-transparent pointer-events-none z-10" />
            <AnimatePresence initial={false}>
              {liveWinners.map((winner, idx) => {
                const platObj = PLATFORMS[winner.platform] || PLATFORMS['1xbet'];
                return (
                  <motion.div
                    key={winner.id}
                    id={`winner-item-${idx}`}
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1 - idx * 0.18, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.015] border border-white/[0.03] text-xs font-sans hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-0.5 rounded-lg text-[8px] font-mono tracking-wide font-black uppercase bg-crimson/15 text-crimson-bright border border-crimson/25">
                        {platObj.name}
                      </div>
                      <span className="font-mono text-[11px] font-bold text-slate-300 pl-1">
                        ID: {winner.userId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black text-emerald-400 tracking-wide font-mono">
                        {winner.amount}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[8px] font-orbitron tracking-widest font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                        WIN ✓
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono hidden sm:inline">
                        {winner.time}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-6 text-center flex flex-col items-center gap-2">
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 hover:bg-cyan-500/20 transition-all text-[11px] font-mono font-bold"
          >
            <Send className="w-3.5 h-3.5" />
            <span>قناة التليجرام: t.me/onexmega_official</span>
          </a>
          <p className="text-[9px] text-slate-600 font-mono tracking-[0.25em] uppercase">
            1XMEGA NEURAL RADAR • PROMO: {PROMO_CODE} • ENCRYPTED
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Main App Root ---
export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.SPLASH);
  const [userId, setUserId] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('1xbet');
  const [selectedSubPlatform, setSelectedSubPlatform] = useState('1xbet vip core');
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Video Autoplay policy handling
  useEffect(() => {
    const tryPlay = () => {
      if (videoRef.current) {
        videoRef.current.play().catch((err) => {
          console.warn('Video play was prevented by browser policy:', err);
        });
      }
    };
    tryPlay();

    const onUserInteraction = () => {
      tryPlay();
      window.removeEventListener('click', onUserInteraction);
      window.removeEventListener('touchstart', onUserInteraction);
    };

    window.addEventListener('click', onUserInteraction);
    window.addEventListener('touchstart', onUserInteraction);

    return () => {
      window.removeEventListener('click', onUserInteraction);
      window.removeEventListener('touchstart', onUserInteraction);
    };
  }, []);

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSplashDone = () => {
    setCurrentScreen(Screen.CHOOSE_PLATFORM);
  };

  const handleSelectPlatform = (key: string) => {
    setSelectedPlatform(key);
    const plat = PLATFORMS[key] || PLATFORMS['1xbet'];
    setSelectedSubPlatform(plat.subName);
    setCurrentScreen(Screen.CONDITION);
  };

  const handleConditionSubmit = (
    enteredUserId: string,
    platform: string,
    subPlatform: string
  ) => {
    setUserId(enteredUserId);
    setSelectedPlatform(platform);
    setSelectedSubPlatform(subPlatform);
    // Directly go to Crash game as requested (Apple of Fortune removed completely)
    setCurrentScreen(Screen.CRASH_GAME);
  };

  return (
    <div className="sleek-app-bg min-h-screen text-slate-100 font-sans select-none overflow-x-hidden relative">
      {/* Background Video */}
      <div className="fixed inset-0 w-full h-full -z-50 pointer-events-none overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60 animate-fade-in"
        >
          <source src={BG_VIDEO_URL} type="video/mp4" />
        </video>
      </div>

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Dynamic Screens */}
      <AnimatePresence mode="wait">
        {currentScreen === Screen.SPLASH && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SplashScreen onComplete={handleSplashDone} />
          </motion.div>
        )}

        {currentScreen === Screen.CHOOSE_PLATFORM && (
          <motion.div
            key="choose-platform"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            <ChoosePlatformScreen
              onSelect={handleSelectPlatform}
              onBack={() => setCurrentScreen(Screen.SPLASH)}
            />
          </motion.div>
        )}

        {currentScreen === Screen.CONDITION && (
          <motion.div
            key="condition"
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.4 }}
          >
            <ConditionScreen
              initialPlatform={selectedPlatform}
              onBack={() => setCurrentScreen(Screen.CHOOSE_PLATFORM)}
              onSubmit={handleConditionSubmit}
              addToast={addToast}
            />
          </motion.div>
        )}

        {currentScreen === Screen.CRASH_GAME && (
          <motion.div
            key="crash"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            <CrashGameScreen
              userId={userId || 'GUEST_VIP_USER'}
              platformKey={selectedPlatform}
              onBack={() => setCurrentScreen(Screen.CHOOSE_PLATFORM)}
              addToast={addToast}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
