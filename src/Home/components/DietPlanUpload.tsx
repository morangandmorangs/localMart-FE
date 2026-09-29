import { useRef, useState } from 'react';
import {
  DIET_PLAN_ACCEPT,
  analyzeDietPlan,
  validateDietPlanFile,
  type DietPlanItem,
} from '../../lib/api/dietPlan';
import { UploadIcon } from './Icons';

export type UploadState =
  | { kind: 'idle' }
  | { kind: 'uploading'; progress: number; fileName: string }
  | { kind: 'analysing'; fileName: string }
  | { kind: 'results'; fileName: string }
  | { kind: 'error'; message: string };

export function DietPlanUpload({
  state,
  onState,
  onItems,
}: {
  state: UploadState;
  onState: (s: UploadState) => void;
  onItems: (items: DietPlanItem[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file: File) => {
    const invalid = validateDietPlanFile(file);
    if (invalid) {
      onState({ kind: 'error', message: invalid });
      return;
    }

    // fetch() gives no upload progress, so step the bar to 100 while the
    // request is in flight, then switch to the analysing state.
    onState({ kind: 'uploading', progress: 15, fileName: file.name });
    const tick = window.setInterval(() => {
      onState({ kind: 'uploading', progress: 70, fileName: file.name });
    }, 200);

    try {
      const res = await analyzeDietPlan(file);
      window.clearInterval(tick);
      onState({ kind: 'analysing', fileName: file.name });
      onItems(res.items);
      onState({ kind: 'results', fileName: file.name });
    } catch (err) {
      window.clearInterval(tick);
      onState({
        kind: 'error',
        message:
          err instanceof Error
            ? err.message
            : 'We could not read that plan. Try again.',
      });
    }
  };

  const openPicker = () => inputRef.current?.click();

  const busy = state.kind === 'uploading' || state.kind === 'analysing';

  return (
    <div className="lm-upload">
      <div
        className={`lm-dropzone${dragging ? ' is-dragging' : ''}${
          state.kind === 'error' ? ' is-error' : ''
        }`}
        // The dropzone is a real button: Enter/Space open the file picker,
        // so it is fully operable from the keyboard.
        role="button"
        tabIndex={0}
        aria-label="Upload diet plan. PDF, JPG or PNG, up to 10 MB."
        aria-describedby="lm-dropzone-hint"
        aria-busy={busy}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void handleFile(file);
        }}
      >
        <span className="lm-dropzone__mark">
          <UploadIcon />
        </span>

        <p className="lm-dropzone__title">
          {state.kind === 'uploading' && 'Uploading…'}
          {state.kind === 'analysing' && 'Reading your plan…'}
          {state.kind === 'results' && 'Plan read'}
          {state.kind === 'error' && 'Upload failed'}
          {state.kind === 'idle' && 'Upload diet plan'}
        </p>

        <p className="lm-dropzone__hint" id="lm-dropzone-hint">
          PDF, JPG or PNG · drag and drop or browse
        </p>

        {state.kind === 'uploading' && (
          <div
            className="lm-progress"
            role="progressbar"
            aria-label="Upload progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={state.progress}
          >
            <span style={{ width: `${state.progress}%` }} />
          </div>
        )}

        <button
          type="button"
          className="lm-btn lm-btn--ghost"
          onClick={(e) => {
            e.stopPropagation();
            openPicker();
          }}
          disabled={busy}
        >
          {state.kind === 'error' ? 'Try another file' : 'Choose file'}
        </button>

        <input
          ref={inputRef}
          className="lm-visually-hidden"
          type="file"
          name="plan"
          accept={DIET_PLAN_ACCEPT.join(',')}
          onChange={(e) => {
            const file = e.target.files?.[0];
            // Reset so re-picking the same file fires change again.
            e.target.value = '';
            if (file) void handleFile(file);
          }}
        />

        <p className="lm-dropzone__fine">Suggestions only — not medical advice</p>
      </div>

      <p className="lm-upload__status" role="status" aria-live="polite">
        {state.kind === 'error' ? state.message : ''}
        {state.kind === 'results' ? 'Plan read. Review the list alongside.' : ''}
      </p>
    </div>
  );
}
