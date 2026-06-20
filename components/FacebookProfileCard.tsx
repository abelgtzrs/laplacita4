import { ArrowRight, Facebook } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FacebookProfileCardProps = {
  facebookUrl: string;
  headline: string;
  description: string;
  buttonLabel: string;
  note: string;
  className?: string;
};

export default function FacebookProfileCard({
  facebookUrl,
  headline,
  description,
  buttonLabel,
  note,
  className,
}: FacebookProfileCardProps) {
  return (
    <div
      className={cn(
        "relative isolate flex flex-col justify-between overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-sky-100 p-6 sm:p-8",
        className,
      )}
    >
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-cyan-200/40 blur-3xl" />

      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm ring-1 ring-blue-100">
          <Facebook className="h-3.5 w-3.5" />
          <span>Facebook</span>
        </div>

        <h3 className="mt-5 text-2xl font-bold text-slate-900">{headline}</h3>
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
          {description}
        </p>
      </div>

      <div className="relative mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-sm text-xs leading-5 text-slate-500 sm:text-sm">
          {note}
        </p>

        <Button
          asChild
          className="bg-[#1877F2] text-white shadow-lg shadow-blue-200 transition-colors hover:bg-[#1666d9]"
        >
          <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
            {buttonLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}