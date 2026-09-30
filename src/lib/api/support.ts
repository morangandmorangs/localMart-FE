/** Knowledge the support bot can answer from, and the mock ask() behind it. */

export interface SupportTopic {
  id: string;
  /** Chip label — phrased the way a customer would ask it. */
  label: string;
  /** Words that route a typed question to this topic. */
  keywords: string[];
  answer: string;
  /** Topics worth offering after this one is answered. */
  followUps?: string[];
}

export interface SupportMessage {
  id: string;
  from: 'bot' | 'customer';
  text: string;
}

export interface SupportReply {
  text: string;
  /** Topic ids to show as follow-up chips. */
  followUps: string[];
}

/** Where the bot hands over when it can't answer. */
export const SUPPORT_HUMAN = {
  page: '/support',
  phone: '1800 123 4567',
  hours: '8am–9pm, every day',
} as const;

/**
 * INVARIANT: no entry here may give medical advice — dosage, substitution,
 * interactions or "is this safe for me". Medicine questions go to the
 * pharmacist, same rule the Rx flow follows.
 */
export const SUPPORT_TOPICS: SupportTopic[] = [
  {
    id: 'delivery',
    label: 'Where do you deliver?',
    keywords: ['deliver', 'delivery', 'area', 'pincode', 'address', 'ship'],
    answer:
      'We deliver in Numaligarh Refinery Township, Numaligarh Bazaar, Dergaon and Bokakhat. Orders placed before 6pm arrive the same evening; after that, next morning.',
    followUps: ['order-status', 'charges'],
  },
  {
    id: 'order-status',
    label: 'Where is my order?',
    keywords: ['order', 'track', 'status', 'late', 'arrived', 'delayed'],
    answer:
      'Open Orders from the menu to see live status for each order. If one is marked out for delivery and more than an hour late, tell me the order number and I will raise it with the store.',
    followUps: ['refund', 'human'],
  },
  {
    id: 'charges',
    label: 'Delivery charges',
    keywords: ['charge', 'fee', 'free', 'minimum', 'cost', 'price'],
    answer:
      'Delivery is free over ₹499. Below that it is ₹25 per order. Daily Ration deliveries carry no fee at any basket size.',
    followUps: ['ration', 'wallet'],
  },
  {
    id: 'ration',
    label: 'How does Daily Ration work?',
    keywords: ['ration', 'daily', 'subscription', 'plan', 'repeat', 'monthly'],
    answer:
      'Daily Ration is a standing list that ships on the days you choose. Edit items or quantities any time before the evening cut-off, and pause the whole plan from the plan card when you travel.',
    followUps: ['diet-plan', 'wallet'],
  },
  {
    id: 'diet-plan',
    label: 'Uploading a diet plan',
    keywords: ['diet', 'upload', 'pdf', 'dietitian', 'nutrition', 'photo'],
    answer:
      'Upload your plan as a PDF, JPG or PNG (up to 10 MB) in the AI Diet Planner. We read it, match each food to products sold near you, and let you edit quantities before ordering. Food only — medicines never come from a diet plan.',
    followUps: ['ration', 'medicine'],
  },
  {
    id: 'wallet',
    label: 'Wallet and refunds to wallet',
    keywords: ['wallet', 'balance', 'topup', 'top-up', 'credit', 'cashback'],
    answer:
      'Your wallet balance shows on the wallet tile and is spent automatically at checkout before any other method. Refunds for cancelled items land back in the wallet within 24 hours.',
    followUps: ['refund', 'payment'],
  },
  {
    id: 'payment',
    label: 'Payment methods',
    keywords: ['pay', 'payment', 'upi', 'card', 'cash', 'cod'],
    answer:
      'UPI, debit and credit cards, wallet balance, and cash on delivery. Cash on delivery is unavailable on prescription medicine orders.',
    followUps: ['wallet', 'medicine'],
  },
  {
    id: 'refund',
    label: 'Returns and refunds',
    keywords: ['refund', 'return', 'cancel', 'damaged', 'missing', 'wrong'],
    answer:
      'Report a damaged, missing or wrong item from the order within 24 hours of delivery and we refund it to your wallet — no return pickup needed for fresh produce. Sealed medicine cannot be returned once delivered.',
    followUps: ['order-status', 'human'],
  },
  {
    id: 'medicine',
    label: 'Ordering medicine',
    keywords: [
      'medicine',
      'medicines',
      'prescription',
      'pharmacy',
      'pharmacist',
      'rx',
      'tablet',
      'dose',
      'dosage',
      'drug',
    ],
    answer:
      'Prescription medicine needs a valid prescription uploaded with the order, and a pharmacist verifies it before dispatch. I cannot advise on dosage, substitutes or whether a medicine suits you — our pharmacist can, on ' +
      `${SUPPORT_HUMAN.phone} (${SUPPORT_HUMAN.hours}).`,
    followUps: ['human', 'refund'],
  },
  {
    id: 'account',
    label: 'Account and sign-in',
    keywords: ['account', 'login', 'sign', 'otp', 'password', 'profile'],
    answer:
      'Sign in with your phone number and the OTP we send. If the OTP does not arrive within a minute, check the number under Customer profile and request it again.',
    followUps: ['human', 'order-status'],
  },
  {
    id: 'human',
    label: 'Talk to a person',
    keywords: ['human', 'person', 'agent', 'call', 'phone', 'talk', 'complain'],
    answer:
      `Call ${SUPPORT_HUMAN.phone} (${SUPPORT_HUMAN.hours}), or open the Support page to send a written request and we reply within one working day.`,
  },
];

/** Topics offered before the customer has asked anything. */
export const SUPPORT_OPENING_TOPICS = [
  'order-status',
  'delivery',
  'ration',
  'medicine',
];

const BY_ID = new Map(SUPPORT_TOPICS.map((t) => [t.id, t]));

export function supportTopicById(id: string): SupportTopic | undefined {
  return BY_ID.get(id);
}

/** Cheap keyword score — the topic sharing the most words with the question wins. */
function bestTopic(question: string): SupportTopic | null {
  const words = new Set(
    question
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
  );
  let best: SupportTopic | null = null;
  let bestScore = 0;
  for (const topic of SUPPORT_TOPICS) {
    const score = topic.keywords.reduce(
      (n, kw) => n + (words.has(kw) ? 1 : 0),
      0,
    );
    if (score > bestScore) {
      best = topic;
      bestScore = score;
    }
  }
  return best;
}

const NO_MATCH =
  "I don't have an answer for that one yet. Pick a topic below, or open the Support page and a person will pick it up.";

/**
 * TODO(api): swap for the real call — POST /api/support/ask, body
 * { question, history }, returning { text, followUps }. The FAQ above stays as
 * the offline fallback so the widget still answers with no server running.
 */
export function askSupportBot(question: string): Promise<SupportReply> {
  const topic = bestTopic(question);
  const reply: SupportReply = topic
    ? { text: topic.answer, followUps: topic.followUps ?? ['human'] }
    : { text: NO_MATCH, followUps: SUPPORT_OPENING_TOPICS };
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(reply), 550);
  });
}
