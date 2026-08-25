import { useSessionStore } from "../../store/chatStore";

export default function ApiKeyWarnings() {
  const { missingKeys } = useSessionStore();

  if (!missingKeys || missingKeys.length === 0) return null;

  return (
    <div className="space-y-2">
      {missingKeys.map((key) => (
        <div
          key={key}
          className="bg-red-900/30 border border-red-900/50 text-red-200 text-xs p-2 rounded-lg"
        >
          ⚠️ Missing API Key: <strong>{key.toUpperCase()}_API_KEY</strong>
        </div>
      ))}
    </div>
  );
}
