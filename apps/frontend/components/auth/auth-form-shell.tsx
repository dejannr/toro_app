import type { ReactNode } from "react";

type AuthFormShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function AuthFormShell({ title, subtitle, children }: AuthFormShellProps) {
  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-7 text-center">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {subtitle ? (
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
