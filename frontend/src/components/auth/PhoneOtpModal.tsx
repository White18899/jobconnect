import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from '../../services/firebase';
import { Phone, KeyRound, Shield, CheckCircle2, User, Store } from 'lucide-react';

interface PhoneOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  onSuccess?: (loggedRole: UserRole) => void;
}

export const PhoneOtpModal: React.FC<PhoneOtpModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'worker',
  onSuccess,
}) => {
  const { login } = useAuth();
  const { t } = useLanguage();

  const [step, setStep] = useState<'phone' | 'otp' | 'role'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [smsNotice, setSmsNotice] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    setRole(defaultRole);
  }, [defaultRole]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError(null);
    setLoading(true);

    const formattedPhone = phone.startsWith('+91')
      ? phone
      : `+91${phone.replace(/\D/g, '').slice(-10)}`;

    // 1. Try Firebase Real SMS first
    if (auth) {
      try {
        if ((window as any).recaptchaVerifier) {
          try {
            (window as any).recaptchaVerifier.clear();
          } catch (e) {}
          (window as any).recaptchaVerifier = null;
        }

        const recaptchaEl = document.getElementById('recaptcha-container');
        if (recaptchaEl) {
          const appVerifier = new RecaptchaVerifier(auth, recaptchaEl, {
            size: 'invisible',
          });
          (window as any).recaptchaVerifier = appVerifier;

          const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
          setConfirmationResult(confirmation);
          setDevOtpHint(null);
          setSmsNotice(null);
          setOtp('');
          setStep('otp');
          setResendTimer(30);
          setLoading(false);
          return;
        }
      } catch (fbErr: any) {
        console.warn('Firebase SMS dispatch error, falling back to Cloudflare engine:', fbErr.message);
        if ((window as any).recaptchaVerifier) {
          try {
            (window as any).recaptchaVerifier.clear();
          } catch (e) {}
          (window as any).recaptchaVerifier = null;
        }
      }
    }

    // 2. Cloudflare Edge / Fast2SMS fallback
    try {
      const apiRole = role === 'admin' ? 'worker' : role;
      const res = await api.requestOtp(phone, apiRole);
      if (res.devOtp) {
        setDevOtpHint(res.devOtp);
        setSmsNotice(res.smsError || null);
      } else {
        setDevOtpHint(null);
        setSmsNotice(null);
      }
      setOtp('');
      setStep('otp');
      setResendTimer(30);
    } catch (err: any) {
      console.error('Failed to request OTP:', err.message);
      setError(err.message || 'Failed to send OTP SMS. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otp.length < 4) {
      setError('Please enter the 6-digit OTP code');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      let firebaseToken: string | undefined;
      if (confirmationResult) {
        const userCred = await confirmationResult.confirm(otp);
        firebaseToken = await userCred.user.getIdToken();
      }

      const apiRole = role === 'admin' ? 'worker' : role;
      const res = await api.verifyOtp(phone, otp, apiRole);
      const verifiedRole = (res.user?.role as UserRole) || role;
      login(phone, verifiedRole, res.token || firebaseToken, res.user?.id);
      onClose();
      if (onSuccess) onSuccess(verifiedRole);
    } catch (err: any) {
      console.error('Failed to verify OTP:', err.message);
      setError(err.message || 'Invalid or expired OTP. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('phone');
    setOtp('');
    setError(null);
    setDevOtpHint(null);
    setSmsNotice(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title={step === 'phone' ? t('auth.enter_phone') : t('auth.enter_otp')}
    >
      {error && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Invisible container for Firebase Phone Auth reCAPTCHA */}
      <div id="recaptcha-container"></div>

      {step === 'phone' ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('auth.enter_phone')}
            </label>
            <div className="relative flex rounded-2xl border-2 border-slate-200 focus-within:border-brand-900 transition bg-slate-50/50">
              <span className="inline-flex items-center px-4 font-bold text-slate-700 text-sm border-r border-slate-200">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9876543210"
                className="w-full px-4 py-3 bg-transparent text-base font-medium outline-hidden"
                autoFocus
              />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500 leading-normal">{t('auth.phone_hint')}</p>
          </div>

          {/* Account Role Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('auth.select_role')}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setRole('worker')}
                className={`p-3 rounded-2xl border-2 text-left transition ${
                  role === 'worker'
                    ? 'border-brand-900 bg-blue-50/60 text-brand-900 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <User className="w-5 h-5 mb-1 text-brand-900" />
                <div className="text-xs font-bold">Worker</div>
                <div className="text-[10px] text-slate-500">I need work</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('employer')}
                className={`p-3 rounded-2xl border-2 text-left transition ${
                  role === 'employer'
                    ? 'border-brand-900 bg-blue-50/60 text-brand-900 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Store className="w-5 h-5 mb-1 text-brand-900" />
                <div className="text-xs font-bold">Employer</div>
                <div className="text-[10px] text-slate-500">I hire workers</div>
              </button>
            </div>
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
            {t('auth.send_otp')}
          </Button>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              Verified & Encrypted with Cloudflare Edge
            </span>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="text-center pb-2">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-brand-900 flex items-center justify-center mx-auto mb-2">
              <KeyRound className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-500">
              {t('auth.otp_sent_to')} <span className="font-bold text-slate-800">+91 {phone}</span>
            </p>

            {smsNotice && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-left text-[11px] text-amber-900 leading-normal">
                <p className="font-bold mb-0.5">Fast2SMS Notice:</p>
                <p>{smsNotice}</p>
                {devOtpHint && (
                  <p className="mt-1 font-semibold text-slate-800">
                    Use this OTP code: <span className="text-brand-900 tracking-wider font-mono text-xs font-bold">{devOtpHint}</span>
                  </p>
                )}
              </div>
            )}

            {!smsNotice && devOtpHint && (
              <span className="inline-block mt-2 px-2.5 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded-lg border border-amber-200">
                OTP Code: <b>{devOtpHint}</b>
              </span>
            )}
          </div>

          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="1 2 3 4 5 6"
              className="w-full text-center tracking-[0.5em] text-2xl font-bold py-3.5 rounded-2xl border-2 border-slate-200 focus:border-brand-900 outline-hidden bg-slate-50/50"
              autoFocus
            />
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading}>
            {t('auth.verify_otp')}
          </Button>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="font-medium text-slate-600 hover:text-slate-900"
            >
              Change Number
            </button>
            <button
              type="button"
              disabled={resendTimer > 0}
              onClick={handleRequestOtp}
              className="font-bold text-brand-900 hover:underline disabled:opacity-50"
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : t('auth.resend_otp')}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
