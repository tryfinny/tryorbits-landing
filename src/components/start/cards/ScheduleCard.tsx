import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ScheduleCard({
  title, events,
}: {
  title: string;
  events: { time: string; label: string }[];
}) {
  return (
    <Card className="border-border bg-[hsl(28_24%_96%)] shadow-md">
      <CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader>
      <CardContent>
        <ol className="flex flex-col">
          {events.map((e, i) => (
            <li key={i} className="flex gap-3 pb-4 last:pb-0">
              <div className="flex flex-col items-center">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                {i < events.length - 1 && <span className="w-px flex-1 bg-border" />}
              </div>
              <div className="-mt-0.5">
                <p className="text-sm font-semibold text-primary">{e.time}</p>
                <p className="text-base">{e.label}</p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
