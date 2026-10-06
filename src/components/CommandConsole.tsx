import { useCallback, useEffect, useRef, useState } from "react";
import { getCommand } from "./commandRegistry";

interface ConsoleLine {
  id: number;
  type: "input" | "output" | "error";
  text: string;
}

let lineId = 0;

export default function CommandConsole() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<ConsoleLine[]>([
    {
      id: lineId++,
      type: "output",
      text: "Consola lista. Escribe 'help' para ver los comandos.",
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const addLine = useCallback(
    (type: ConsoleLine["type"], text: string) => {
      setLines((previous) => [
        ...previous,
        { id: lineId++, type, text },
      ]);
    },
    []
  );

  const runCommand = useCallback(
    async (rawInput: string) => {
      const trimmed = rawInput.trim();

      if (!trimmed) return;

      addLine("input", `> ${trimmed}`);

      const [commandName, ...args] = trimmed.split(/\s+/);
      const command = getCommand(commandName);

      if (!command) {
        addLine("error", `Comando desconocido: "${commandName}". Escribe 'help'.`);
        return;
      }

      try {
        const result = await command.run(args);

        if (result === "__CLEAR__") {
          setLines([]);
          return;
        }

        if (result) {
          addLine("output", String(result));
        }
      } catch (error) {
        addLine(
          "error",
          error instanceof Error ? error.message : "Ocurrió un error al ejecutar el comando."
        );
      }
    },
    [addLine]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F4") {
        event.preventDefault();
        setIsOpen((previous) => !previous);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [lines, isOpen]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const value = input;
    setInput("");
    await runCommand(value);
  };

  if (!isOpen) return null;

  return (
    <div className="command-console">
      <div className="command-console__header">
        <span>Consola de comandos</span>
        <span className="command-console__hint">F4 para cerrar</span>
      </div>

      <div className="command-console__body">
        {lines.map((line) => (
          <pre
            key={line.id}
            className={`command-console__line command-console__line--${line.type}`}
          >
            {line.text}
          </pre>
        ))}

        <div ref={bottomRef} />
      </div>

      <form className="command-console__form" onSubmit={handleSubmit}>
        <span className="command-console__prompt">{'>'}</span>

        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Escribe un comando..."
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
