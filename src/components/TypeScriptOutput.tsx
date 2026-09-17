import "./TypeScriptOutput.scss";
import EmptyState from "./EmptyState";

interface TypeScriptOutputProps {
  value: string;
  onCopy: () => void;
}

function TypeScriptOutput({ value, onCopy }: TypeScriptOutputProps) {
  return (
    <div className="typescript-panel-body">
      <button className="typescript-output__copy" onClick={onCopy}>
        Copy
      </button>

      {value ? <pre className="typescript-output">{value}</pre> : <EmptyState message="No TypeScript output yet." />}
    </div>
  );
}

export default TypeScriptOutput;
