import type { ReactNode } from "react";

type AuthFormShellProps = {
  title: string;
  children: ReactNode;
};

export function AuthFormShell({ title, children }: AuthFormShellProps) {
  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="rounded-lg border border-border bg-background p-6">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
