import "./JsonToolbar.scss";

interface JsonToolbarProps {
  onFormat: () => void;
  onMinify: () => void;
  onValidate: () => void;
  onGenerateTypes: () => void;
  onClear: () => void;
}

function JsonToolbar({ onFormat, onMinify, onValidate, onGenerateTypes, onClear }: JsonToolbarProps) {
  return (
    <div className="toolbar">
      <button className="toolbar__button" onClick={onFormat}>
        Format
      </button>
      <button className="toolbar__button" onClick={onMinify}>
        Minify
      </button>
      <button className="toolbar__button" onClick={onValidate}>
        Validate
      </button>
      <button className="toolbar__button toolbar__button--primary" onClick={onGenerateTypes}>
        Generate TS
      </button>
      <button className="toolbar__button" onClick={onClear}>
        Clear
      </button>
    </div>
  );
}

export default JsonToolbar;
