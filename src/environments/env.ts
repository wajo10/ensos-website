export function readEnv(key: string, fallback = ''): string {
  // Vite (cliente)
  const viteEnv: any = (typeof import.meta !== 'undefined' && (import.meta as any).env)
    ? (import.meta as any).env
    : undefined;

  // Node (SSR / route extraction)
  const nodeEnv: any = (globalThis as any)?.process?.env;

  return (viteEnv?.[key] ?? nodeEnv?.[key] ?? fallback) as string;
}
