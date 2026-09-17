import { useState } from "react";
import JsonEditor from "./components/JsonEditor";
import JsonToolbar from "./components/JsonToolbar";
import TypeScriptOutput from "./components/TypeScriptOutput";
import { formatJson, minifyJson, parseJson, validateJson } from "./utils/json";
import { generateTypeScript } from "./utils/generateTypes";
import StatusMessage from "./components/StatusMessage";
import type { Status } from "./types/status";
import "./styles/App.scss";
import { copyToClipboard } from "./utils/clipboard";
import EmptyState from "./components/EmptyState";

function App() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [status, setStatus] = useState<Status>(null);
  const [typeScriptOutput, setTypeScriptOutput] = useState<string>("");
  const [processedInput, setProcessedInput] = useState<string>("");

  // isStale is now derived, not stored — it's true only when there's an
  // output on screen AND the input has changed since that output was made.
  const isStale = output !== "" && input !== processedInput;

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const processJson = (transform: (input: string) => string, successMessage: string) => {
    try {
      setOutput(transform(input));
      setProcessedInput(input);
      setStatus({ type: "success", message: successMessage });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON";

      setOutput("");
      setProcessedInput("");
      setStatus({ type: "error", message });
    }
  };

  const handleFormat = () => {
    processJson(formatJson, "JSON formatted successfully");
  };

  const handleMinify = () => {
    processJson(minifyJson, "JSON minified successfully");
  };

  const handleValidate = () => {
    const isValid = validateJson(input);
    setStatus({
      type: isValid ? "success" : "error",
      message: isValid ? "Valid JSON" : "Invalid JSON",
    });
  };

  const handleGenerateTypes = () => {
    const result = parseJson(input);

    if (!result.success) {
      setTypeScriptOutput("");
      setStatus({ type: "error", message: result.error });
      return;
    }

    try {
      const types = generateTypeScript(result.value);
      setTypeScriptOutput(types);
      setStatus({ type: "success", message: "TypeScript generated successfully" });
    } catch {
      setTypeScriptOutput("");
      setStatus({ type: "error", message: "Could not generate TypeScript from this input" });
    }
  };

  const handleCopyText = async (text: string) => {
    if (!text) {
      setStatus({ type: "error", message: "Nothing to copy" });
      return;
    }

    try {
      await copyToClipboard(text);
      setStatus({ type: "success", message: "Copied to clipboard" });
    } catch {
      setStatus({ type: "error", message: "Failed to copy" });
    }
  };

  const handleCopy = () => handleCopyText(output);

  const handleCopyTypeScript = () => handleCopyText(typeScriptOutput);

  const handleClear = () => {
    setInput("");
    setOutput("");
    setStatus(null);
    setTypeScriptOutput("");
    setProcessedInput("");
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-header__title">JSON Toolbox</h1>
        <p className="app-header__subtitle">Format, validate, and inspect JSON</p>
      </header>

      <section className="editor-panels">
        <div className="json-input-panel">
          <h2 className="panel__title">JSON Input</h2>
          <JsonEditor value={input} onChange={handleInputChange} placeholder="Paste your JSON here..." />
        </div>

        <div className="json-output-panel">
          <h2 className="panel__title">JSON Output</h2>

          <div className="json-output-panel-body">
            <button className="json-output__copy" onClick={handleCopy}>
              Copy
            </button>

            {output ? <pre className="json-output">{output}</pre> : <EmptyState message="No JSON output yet." />}

            {isStale && <p className="stale-notice">Output is out of date</p>}
          </div>
        </div>
      </section>

      <section className="typescript-panel">
        <h2 className="panel__title">TypeScript Output</h2>
        <TypeScriptOutput value={typeScriptOutput} onCopy={handleCopyTypeScript} />
      </section>

      <section className="toolbar-section">
        <JsonToolbar
          onFormat={handleFormat}
          onMinify={handleMinify}
          onValidate={handleValidate}
          onGenerateTypes={handleGenerateTypes}
          onClear={handleClear}
        />
      </section>

      <StatusMessage status={status} />
    </div>
  );
}

export default App;
