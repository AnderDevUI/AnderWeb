export type CommandResult = string | void;

export type CommandHandler = (args: string[]) => CommandResult | Promise<CommandResult>;

export interface Command {
  name: string;
  description: string;
  usage?: string;
  run: CommandHandler;
}

export const commands: Record<string, Command> = {
  help: {
    name: "help",
    description: "Muestra los comandos disponibles",
    run: () =>
      Object.values(commands)
        .map(
          (command) =>
            `${command.name}${command.usage ? ` ${command.usage}` : ""} — ${command.description}`
        )
        .join("\n"),
  },

  clear: {
    name: "clear",
    description: "Limpia la consola",
    run: () => "__CLEAR__",
  },

  echo: {
    name: "echo",
    description: "Repite el texto ingresado",
    usage: "<texto>",
    run: (args) => args.join(" ") || "Uso: echo <texto>",
  },

  time: {
    name: "time",
    description: "Muestra la hora actual",
    run: () => new Date().toLocaleTimeString(),
  },

  open: {
    name: "open",
    description: "Abre una URL en una pestaña nueva",
    usage: "<url>",
    run: (args) => {
      const url = args[0];

      if (!url) return "Uso: open <url>";

      const safeUrl = url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;

      window.open(safeUrl, "_blank", "noopener,noreferrer");
      return `Abriendo ${safeUrl}`;
    },
  },
};

export function getCommand(name: string): Command | undefined {
  return commands[name.toLowerCase()];
}
