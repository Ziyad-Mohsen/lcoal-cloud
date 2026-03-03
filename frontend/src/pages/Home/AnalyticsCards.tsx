import { getFilesCount } from "@/api/files.api";
import { QUERY_KEYS } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { type FilesCount } from "../../../../backend/types";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FILE_TYPE_CONFIG, type FileTypeConfig } from "@/lib/fileTypeConfig";
import { ChartNoAxesColumn } from "lucide-react";

export default function AnalyticsCards() {
  const { data, isPending } = useQuery<FilesCount>({
    queryKey: [QUERY_KEYS.FILES_COUNT],
    queryFn: getFilesCount,
  });

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
        {isPending ? (
          <>
            <AnalyticsCardSkeleton />
            <AnalyticsCardSkeleton />
            <AnalyticsCardSkeleton />
            <AnalyticsCardSkeleton />
            <AnalyticsCardSkeleton />
          </>
        ) : (
          <>
            <AnalyticsCard tag="Total files" fileConfig={FILE_TYPE_CONFIG.pdf}>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                {data?.total}
              </p>
            </AnalyticsCard>
            <AnalyticsCard tag="Videos" fileConfig={FILE_TYPE_CONFIG.video}>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                {data?.videos}
              </p>
            </AnalyticsCard>
            <AnalyticsCard tag="Audio" fileConfig={FILE_TYPE_CONFIG.audio}>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                {data?.audio}
              </p>
            </AnalyticsCard>
            <AnalyticsCard tag="Images" fileConfig={FILE_TYPE_CONFIG.image}>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                {data?.images}
              </p>
            </AnalyticsCard>
            <AnalyticsCard tag="Text" fileConfig={FILE_TYPE_CONFIG.text}>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                {data?.text}
              </p>
            </AnalyticsCard>
            <AnalyticsCard tag="Others" fileConfig={FILE_TYPE_CONFIG.unknown}>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                {data?.others}
              </p>
            </AnalyticsCard>
          </>
        )}
      </div>
    </div>
  );
}

interface AnalyticsCardProps {
  fileConfig: FileTypeConfig;
  tag?: string;
  children: ReactNode;
}

function AnalyticsCardSkeleton() {
  return (
    <Card className="p-4 sm:p-5 h-full flex items-start gap-3 sm:gap-4 border border-border/50 bg-card hover:shadow-lg transition-shadow duration-300">
      <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 sm:h-4 w-20 rounded" />
        <Skeleton className="h-6 sm:h-8 w-12 rounded" />
      </div>
    </Card>
  );
}

export function AnalyticsCard({
  fileConfig,
  tag,
  children,
}: AnalyticsCardProps) {
  const Icon = fileConfig?.icon || ChartNoAxesColumn;
  const color = fileConfig?.color || FILE_TYPE_CONFIG.text.color;

  return (
    <Card className="p-4 sm:p-5 h-full flex items-start gap-3 sm:gap-4 border border-border/50 bg-linear-to-br from-card to-card/95 hover:shadow-lg transition-all duration-300 hover:border-primary/50">
      <div
        className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center rounded-lg flex-col transition-transform duration-300 hover:scale-110"
        style={{
          backgroundColor: color + "20",
          borderLeft: `4px solid ${color}`,
        }}
      >
        <Icon color={color} strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        {tag && (
          <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {tag}
          </p>
        )}
        <div className="mt-1">{children}</div>
      </div>
    </Card>
  );
}
