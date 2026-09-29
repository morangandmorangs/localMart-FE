export const DIET_PLAN_ACCEPT = ['.pdf', '.jpg', '.jpeg', '.png'] as const;
export const DIET_PLAN_MAX_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME = new Set(['application/pdf', 'image/jpeg', 'image/png']);

export interface DietPlanItem {
  productId: string;
  name: string;
  /** The line quoted from the uploaded plan, e.g. "Whole grains, lunch". */
  sourceText: string;
  quantity: number;
  unit: string;
  /** 0–1 match confidence from the matcher. */
  confidence: number;
}

export interface DietPlanAnalyzeResponse {
  items: DietPlanItem[];
}

/** Drives the dropzone error state. When a server is wired up it must
 *  validate type and size again — this check is a convenience, not a gate. */
export function validateDietPlanFile(file: File): string | null {
  if (!ALLOWED_MIME.has(file.type)) {
    return 'That file type is not supported. Upload a PDF, JPG or PNG.';
  }
  if (file.size > DIET_PLAN_MAX_BYTES) {
    return 'That file is over 10 MB. Upload a smaller PDF or photo.';
  }
  if (file.size === 0) {
    return 'That file is empty. Choose another PDF or photo.';
  }
  return null;
}

/**
 * Mock matcher output, so the upload flow can be driven end to end with no
 * server running.
 *
 * INVARIANT: no medicine product may ever appear here. The diet planner is
 * food-only — anything Rx goes through the pharmacist-verified prescription
 * flow instead.
 */
const MOCK_ITEMS: DietPlanItem[] = [
  {
    productId: 'grocery/brown-rice',
    name: 'Brown rice',
    sourceText: 'Whole grains, lunch',
    quantity: 2,
    unit: 'kg',
    confidence: 0.92,
  },
  {
    productId: 'grocery/moong-dal',
    name: 'Moong dal',
    sourceText: 'Protein, dinner',
    quantity: 1,
    unit: 'kg',
    confidence: 0.88,
  },
  {
    productId: 'vegetables/spinach',
    name: 'Spinach, fresh',
    sourceText: 'Leafy greens, daily',
    quantity: 500,
    unit: 'g',
    confidence: 0.81,
  },
  {
    productId: 'grocery/low-fat-curd',
    name: 'Low-fat curd',
    sourceText: 'Dairy, breakfast',
    quantity: 400,
    unit: 'g',
    confidence: 0.76,
  },
];

/**
 * TODO(api): swap for the real call — POST /api/diet-plan/analyze, multipart
 * form data, field name "plan", returning { items: DietPlanItem[] }.
 * The server behind it needs to re-validate type and size, extract the text
 * (pdf-parse for PDFs, OCR for photos), match foods to live catalogue
 * products, and filter medicine out of the results.
 */
export function analyzeDietPlan(file: File): Promise<DietPlanAnalyzeResponse> {
  void file;
  return new Promise((resolve) => {
    window.setTimeout(() => resolve({ items: MOCK_ITEMS }), 900);
  });
}
