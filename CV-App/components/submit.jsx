export default function CVSubmissionButton({ onSubmit, text = 'Submit CV' }) {
  return (
    <button type="button" onClick={onSubmit}>
      {text}
    </button>
  );
}