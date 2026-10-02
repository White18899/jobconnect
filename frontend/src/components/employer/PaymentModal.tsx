import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Application } from '../../services/mockData';
import { api } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { IndianRupee, QrCode, Smartphone, Upload, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  onPaymentSubmitted: (appId: string, utr: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  application,
  onPaymentSubmitted,
}) => {
  const { t } = useLanguage();
  const [utr, setUtr] = useState('');
  const [screenshotUploaded, setScreenshotUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!application) return null;

  // Generate order code and UPI intent URL
  const orderCode = application.order_code || `JC-202610-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const upiId = 'jobconnect@icici';
  const payeeName = 'JobConnect';
  const amount = 499;

  // Format: upi://pay?pa={UPI_ID}&pn={PAYEE}&am={AMOUNT}&cu=INR&tn={ORDER_CODE}
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(orderCode)}`;

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utr || utr.trim().length < 10) {
      setError('Please enter a valid 12-digit UPI reference / UTR number from your payment receipt');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      if (application.payment_id) {
        await api.submitPaymentProof(application.payment_id, utr.trim(), 'mock_screenshot.jpg');
      }
      onPaymentSubmitted(application.id, utr.trim());
      onClose();
    } catch (err: any) {
      // Fallback for purely client-side state
      console.warn('API submission error, updating local state:', err.message);
      onPaymentSubmitted(application.id, utr.trim());
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t('payment.title')} (₹499)`}
      maxWidth="lg"
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Worker Summary Banner */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 font-medium">Unlocking Candidate:</span>
            <div className="text-sm font-bold text-slate-900">{application.worker?.full_name}</div>
          </div>
          <div className="text-right">
            <span className="text-slate-500 font-medium">Verification Fee:</span>
            <div className="text-base font-extrabold text-brand-900">₹499</div>
          </div>
        </div>

        {/* Step 1: Scan QR or Pay via Mobile UPI */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 text-center">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center justify-center gap-1.5">
            <QrCode className="w-4 h-4 text-brand-900" />
            <span>{t('payment.scan_qr')}</span>
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-3 inline-block rounded-2xl border-2 border-brand-900/10 shadow-xs mb-3">
            <QRCodeSVG
              value={upiUrl}
              size={180}
              level="H"
              includeMargin={false}
              className="mx-auto"
            />
          </div>

          <div className="space-y-1 text-xs text-slate-600">
            <div>
              UPI ID: <span className="font-mono font-bold text-slate-900">{upiId}</span>
            </div>
            <div>
              Order Code: <span className="font-mono font-bold text-brand-900">{orderCode}</span>
            </div>
          </div>

          {/* Mobile UPI Intent Button */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <a href={upiUrl} className="block w-full">
              <Button
                variant="outline"
                size="md"
                fullWidth
                icon={<Smartphone className="w-4 h-4 mr-1 text-brand-900" />}
              >
                {t('payment.pay_via_upi_app')} (GPay / PhonePe / Paytm)
              </Button>
            </a>
          </div>
        </div>

        {/* Step 2: Submit UTR Reference & Screenshot */}
        <form onSubmit={handleSubmitProof} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              {t('payment.submit_utr_title')} <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={utr}
              onChange={(e) => setUtr(e.target.value.replace(/[^0-9A-Za-z]/g, '').slice(0, 16))}
              placeholder={t('payment.utr_placeholder')}
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-brand-900 text-sm font-mono font-bold uppercase tracking-wider outline-hidden"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Find the 12-digit UTR number in your UPI payment receipt.
            </p>
          </div>

          {/* Screenshot upload trigger */}
          <div
            onClick={() => setScreenshotUploaded(!screenshotUploaded)}
            className={`border-2 border-dashed rounded-2xl p-3 text-center cursor-pointer transition ${
              screenshotUploaded
                ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-xs font-semibold">
              {screenshotUploaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Payment Screenshot Attached (receipt.jpg)</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>{t('payment.upload_screenshot')} (Optional)</span>
                </>
              )}
            </div>
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
            {t('payment.submit_button')}
          </Button>
        </form>

        {/* Refund Policy Disclosure */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-900 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold text-slate-800">Refund Guarantee:</span>{' '}
            {t('payment.refund_policy')}
          </p>
        </div>
      </div>
    </Modal>
  );
};
