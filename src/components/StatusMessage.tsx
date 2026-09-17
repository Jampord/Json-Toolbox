import "./StatusMessage.scss";
import type { Status } from "../types/status";

interface StatusMessageProps {
  status: Status;
}

function StatusMessage({ status }: StatusMessageProps) {
  if (!status) {
    return null;
  }

  return (
    <p className={`status status--${status.type}`}>
      {status.type === "success" ? "✓" : "✕"} {status.message}
    </p>
  );
}

export default StatusMessage;
