import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, HelpCircle, Loader2, AlertCircle } from 'lucide-react';
import { sounds } from '../utils/audio';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'feedback',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedName, setSubmittedName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please complete all required fields.');
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const topicLabels: Record<string, string> = {
        feedback: 'General Feedback',
        bug: 'Bug Report / Glitch',
        suggestion: 'Game Suggestion',
        accessibility: 'Accessibility Feedback',
      };
      const topicText = topicLabels[formData.topic] || formData.topic;

      // Submit via FormSubmit AJAX endpoint
      const response = await fetch('https://formsubmit.co/ajax/lalit8katre@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          topic: topicText,
          message: formData.message.trim(),
          _subject: `New GameZone Enquiry: ${topicText}`,
          _replyto: formData.email.trim(),
          _captcha: 'false',
          _template: 'table',
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && (data?.success === 'true' || data?.success === true || response.status === 200)) {
        setSubmittedName(formData.name.trim());
        setIsSubmitted(true);
        sounds.playVictory();
        // Clear the form only after confirmed successful delivery
        setFormData({ name: '', email: '', topic: 'feedback', message: '' });
      } else {
        const errorMsg =
          data?.message || 'Failed to deliver message via FormSubmit. Please check your network and try again.';
        setError(errorMsg);
        sounds.playHit();
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Unable to connect to the mail delivery service. Please try again later.';
      setError(`Delivery failed: ${errorMessage}`);
      sounds.playHit();
    } finally {
      setIsSubmitting(false);
    }
  };

  const FAQS = [
    {
      q: 'Are all games on GameZone really 100% free?',
      a: 'Yes. All eight games are completely free to play with no paywalls, hidden in-app purchases, or subscription gates.',
    },
    {
      q: 'Where are my high scores and favorites stored?',
      a: 'All game records, personal best scores, and favorites are stored locally in your browser using standard HTML5 LocalStorage. Clearing your browser data resets these records.',
    },
    {
      q: 'Do I need an account to play or save progress?',
      a: 'No account is ever required. You can load any game instantly and your personal records persist automatically across visits on the same device.',
    },
    {
      q: 'Can I report a bug or request a new game?',
      a: 'Absolutely! Use the form below with the "Bug Report" or "Game Suggestion" topic. We review community requests regularly.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#B7FF35] mb-2 uppercase tracking-wider">
          <Mail className="w-4 h-4" /> Support & Inquiries
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Get in touch with GameZone
        </h1>
        <p className="mt-3 text-neutral-400 text-xs sm:text-sm max-w-md mx-auto">
          Have an idea for a new mini-game or spotted a glitch? Drop us a note using the message form below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Contact Form */}
        <div className="p-6 rounded-2xl bg-[#171816] border border-white/10 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#B7FF35]" /> Send Feedback
          </h2>

          {isSubmitted ? (
            <div className="py-8 text-center animate-in fade-in">
              <CheckCircle2 className="w-12 h-12 text-[#B7FF35] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">Enquiry Sent!</h3>
              <p className="text-xs text-neutral-300 max-w-xs mx-auto mb-2">
                Thank you{submittedName ? `, ${submittedName}` : ''}. Your enquiry has been delivered to{' '}
                <strong className="text-[#B7FF35] font-mono">lalit8katre@gmail.com</strong>.
              </p>
              <p className="text-[11px] text-neutral-500 max-w-xs mx-auto mb-5">
                Note: If this is the initial submission, FormSubmit requires a one-time inbox activation.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setError(null);
                }}
                className="px-4 py-2 bg-[#20221E] hover:bg-neutral-800 text-xs text-white rounded-xl border border-white/10 cursor-pointer transition-colors"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form
              action="https://formsubmit.co/lalit8katre@gmail.com"
              method="POST"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* FormSubmit Configuration Meta Inputs */}
              <input type="hidden" name="_subject" value={`New GameZone Enquiry - ${formData.topic}`} />
              <input type="hidden" name="_replyto" value={formData.email} />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />

              {error && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="name-input" className="block text-xs font-mono text-neutral-300 mb-1">
                  Your Name
                </label>
                <input
                  id="name-input"
                  name="name"
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex"
                  className="w-full bg-[#10110F] text-neutral-100 text-xs rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-[#B7FF35] focus:outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="email-input" className="block text-xs font-mono text-neutral-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email-input"
                  name="email"
                  type="email"
                  required
                  disabled={isSubmitting}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full bg-[#10110F] text-neutral-100 text-xs rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-[#B7FF35] focus:outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="topic-select" className="block text-xs font-mono text-neutral-300 mb-1">
                  Inquiry Topic
                </label>
                <select
                  id="topic-select"
                  name="topic"
                  disabled={isSubmitting}
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full bg-[#10110F] text-neutral-100 text-xs rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-[#B7FF35] focus:outline-none disabled:opacity-50"
                >
                  <option value="feedback">General Feedback</option>
                  <option value="bug">Bug Report / Glitch</option>
                  <option value="suggestion">Game Suggestion</option>
                  <option value="accessibility">Accessibility Feedback</option>
                </select>
              </div>

              <div>
                <label htmlFor="message-textarea" className="block text-xs font-mono text-neutral-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message-textarea"
                  name="message"
                  required
                  rows={4}
                  disabled={isSubmitting}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Let us know your thoughts or report an issue..."
                  className="w-full bg-[#10110F] text-neutral-100 text-xs rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-[#B7FF35] focus:outline-none disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#B7FF35] hover:bg-[#a6ec27] text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending Enquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" /> Frequently Asked Questions
          </h2>

          {FAQS.map((faq, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#171816] border border-white/10">
              <h3 className="text-xs font-bold text-neutral-200 mb-1.5">{faq.q}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
