import cn from "@/lib/utils";
import { Sparkle } from "lucide-react";

interface PlaceholderBannerProps {
  actions: string[];
  onQuickActionClick: (input: string) => void;
}

export function PlaceholderBanner({
  actions,
  onQuickActionClick,
}: PlaceholderBannerProps) {
  return (
    <div className="text-center py-8">
      <div className="space-y-6">
        <p className="text-lg font-exo">
          Start a conversation to search for candidates.{" "}
          <Sparkle className="inline-block w-5 h-5" />
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {actions.map((action, index) => (
            <QuickActionCard
              key={index}
              title={action}
              onClick={() => onQuickActionClick(action)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface QuickActionCardProps {
  title: string;
  onClick: () => void;
}

function QuickActionCard({ title, onClick }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-center h-[80px] text-balance p-4 rounded-lg border border-neutral-300 hover:bg-neutral-50 transition-colors",
        "flex flex-col items-center justify-center text-base font-exo font-medium",
        "cursor-pointer"
      )}
    >
      {title}
    </button>
  );
}
