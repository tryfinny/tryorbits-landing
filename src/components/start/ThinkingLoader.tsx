export function ThinkingLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-5 py-10">
      <img
        src="/bit-thinking.gif"
        alt="Bit"
        width={128}
        height={128}
        className="h-28 w-28 select-none object-contain"
      />
      <p className="text-muted-foreground">Bit is thinking…</p>
    </div>
  );
}
