export default function CVEditButton({ onEdit, text = 'Edit' }) {
  return (
    <button type="button" onClick={onEdit}>
      {text}
    </button>
  );
}
