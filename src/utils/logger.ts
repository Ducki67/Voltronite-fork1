type LogType = "backend" | "matchmaker" | "error";

function format(type: LogType, message: string): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const timestamp = `${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  return `[${timestamp}] [${type.toUpperCase()}] ${message}`;
}

export const Logger = {
  backend(message: string): void {
    console.log(format("backend", message));
  },
  matchmaker(message: string): void {
    console.log(format("matchmaker", message));
  },
  error(message: string): void {
    console.error(format("error", message));
  },
};
