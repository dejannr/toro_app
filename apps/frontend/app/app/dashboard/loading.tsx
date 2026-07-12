function Skeleton({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-[#EDEDED] ${className}`} />
  );
}

export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#161616] p-3 lg:ml-[248px] lg:pl-0">
      <div className="min-h-[calc(100vh-24px)] rounded-[28px] bg-white px-4 py-6 lg:px-6 lg:py-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-5 w-80 max-w-full" />
          </div>
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
        </div>
        <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    </main>
  );
}
