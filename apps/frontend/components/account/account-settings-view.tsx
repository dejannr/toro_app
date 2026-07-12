"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bell01, ChevronDown, ChevronUp, Lock01, User01 } from "@untitledui/icons";
import { useRouter } from "next/navigation";
import {
  useMemo,
  useState,
  type ComponentType,
  type ReactNode
} from "react";
import { useForm, type UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageIntro } from "@/components/layout/page-intro";
import {
  changeAccountPassword,
  type AccountProfile,
  type NotificationPreferences,
  updateAccountProfile,
  updateNotificationPreferences
} from "@/lib/auth";
import {
  accountProfileSchema,
  changePasswordSchema,
  type AccountProfileValues,
  type ChangePasswordValues
} from "@/lib/validations/account";
import { cn } from "@/lib/utils";

type AccountSettingsViewProps = {
  profile: AccountProfile;
};

type AccountTab = "profile" | "password" | "notifications";

type NotificationSectionId = "fuel" | "marketplace" | "tracking" | "other";

const accountTabs: { id: AccountTab; label: string }[] = [
  { id: "profile", label: "User profile" },
  { id: "password", label: "Change password" },
  { id: "notifications", label: "Notification settings" }
];

export function AccountSettingsView({ profile }: AccountSettingsViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AccountTab>("profile");
  const [expandedSection, setExpandedSection] =
    useState<NotificationSectionId | null>("tracking");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const [notificationSuccess, setNotificationSuccess] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationPreferences>(
    profile.notification_preferences
  );
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

  const profileForm = useForm<AccountProfileValues>({
    resolver: zodResolver(accountProfileSchema),
    defaultValues: {
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone_number: profile.phone_number ?? "",
      job_title: profile.job_title ?? ""
    }
  });

  const passwordForm = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: ""
    }
  });

  const accountTypeLabel = useMemo(() => {
    if (!profile.company) {
      return "Personal account";
    }

    return `${profile.company.role} at ${profile.company.legal_name}`;
  }, [profile.company]);

  async function onSubmitProfile(values: AccountProfileValues) {
    setProfileError(null);
    setProfileSuccess(null);

    try {
      await updateAccountProfile({
        first_name: values.first_name,
        last_name: values.last_name,
        phone_number: values.phone_number || null,
        job_title: values.job_title || null
      });
      setProfileSuccess("Profile updated.");
      router.refresh();
    } catch (error) {
      setProfileError(
        error instanceof Error ? error.message : "Unable to update profile"
      );
    }
  }

  async function onSubmitPassword(values: ChangePasswordValues) {
    setPasswordError(null);
    setPasswordSuccess(null);

    try {
      await changeAccountPassword({
        current_password: values.current_password,
        new_password: values.new_password
      });
      passwordForm.reset();
      setPasswordSuccess("Password updated.");
    } catch (error) {
      setPasswordError(
        error instanceof Error ? error.message : "Unable to update password"
      );
    }
  }

  async function saveNotifications(next: NotificationPreferences) {
    setNotificationError(null);
    setNotificationSuccess(null);
    setNotifications(next);
    setIsSavingNotifications(true);

    try {
      await updateNotificationPreferences(next);
      setNotificationSuccess("Notification settings updated.");
      router.refresh();
    } catch (error) {
      setNotificationError(
        error instanceof Error
          ? error.message
          : "Unable to update notification settings"
      );
    } finally {
      setIsSavingNotifications(false);
    }
  }

  function updateNotificationState(
    updater: (current: NotificationPreferences) => NotificationPreferences
  ) {
    const next = updater(notifications);
    void saveNotifications(next);
  }

  return (
    <section className="space-y-6">
      <PageIntro
        title="Account settings"
        description="Manage your profile, password, and notification preferences."
        actions={
          activeTab === "profile" ? (
            <Button
              type="submit"
              form="account-profile-form"
              className="bg-[#161616] text-white hover:bg-[#222222]"
              disabled={profileForm.formState.isSubmitting}
            >
              Save changes
            </Button>
          ) : activeTab === "password" ? (
            <Button
              type="submit"
              form="account-password-form"
              className="bg-[#161616] text-white hover:bg-[#222222]"
              disabled={passwordForm.formState.isSubmitting}
            >
              Update password
            </Button>
          ) : null
        }
      />

      <div className="border-b border-[#EFEFEF]">
        <div className="flex flex-wrap gap-6">
          {accountTabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "border-b-2 pb-3 text-sm font-medium transition-colors",
                  isActive
                    ? "border-[#FFD028] text-[#161616]"
                    : "border-transparent text-[#8A8A8A] hover:text-[#161616]"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "profile" ? (
        <form
          id="account-profile-form"
          className="space-y-5"
          onSubmit={profileForm.handleSubmit(onSubmitProfile)}
        >
          <SettingsPanel
            icon={User01}
            title="User profile"
            description="Core login and contact information for this account."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <AccountField form={profileForm} id="first_name" label="First name" />
              <AccountField form={profileForm} id="last_name" label="Last name" />
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile.email} disabled />
              </div>
              <AccountField
                form={profileForm}
                id="phone_number"
                label="Phone number"
                placeholder="(555) 123-4567"
              />
              <AccountField
                form={profileForm}
                id="job_title"
                label="Job title"
                placeholder="Operations manager"
              />
              <div className="space-y-2">
                <Label htmlFor="account-type">Account type</Label>
                <Input id="account-type" value={accountTypeLabel} disabled />
              </div>
            </div>
          </SettingsPanel>

          <SettingsFooter error={profileError} success={profileSuccess} />
        </form>
      ) : null}

      {activeTab === "password" ? (
        <form
          id="account-password-form"
          className="space-y-5"
          onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
        >
          <SettingsPanel
            icon={Lock01}
            title="Change password"
            description="Update your login password. Use a unique password for Toro."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <PasswordField
                form={passwordForm}
                id="current_password"
                label="Current password"
              />
              <div />
              <PasswordField
                form={passwordForm}
                id="new_password"
                label="New password"
              />
              <PasswordField
                form={passwordForm}
                id="confirm_password"
                label="Confirm new password"
              />
            </div>
          </SettingsPanel>

          <SettingsFooter error={passwordError} success={passwordSuccess} />
        </form>
      ) : null}

      {activeTab === "notifications" ? (
        <div className="space-y-4">
          <NotificationAccordion
            title="Fuel management"
            icon={Bell01}
            expanded={expandedSection === "fuel"}
            onToggle={() =>
              setExpandedSection((current) => (current === "fuel" ? null : "fuel"))
            }
          >
            <NotificationRow
              label="Fuel management alerts"
              description="Enable account-level fuel spend and card notifications."
              checked={notifications.fuel_management_enabled}
              onChange={() =>
                updateNotificationState((current) => ({
                  ...current,
                  fuel_management_enabled: !current.fuel_management_enabled
                }))
              }
            />
          </NotificationAccordion>

          <NotificationAccordion
            title="Marketplace"
            icon={Bell01}
            expanded={expandedSection === "marketplace"}
            onToggle={() =>
              setExpandedSection((current) =>
                current === "marketplace" ? null : "marketplace"
              )
            }
          >
            <NotificationRow
              label="Marketplace alerts"
              description="Receive updates for carrier, load board, and partner activity."
              checked={notifications.marketplace_enabled}
              onChange={() =>
                updateNotificationState((current) => ({
                  ...current,
                  marketplace_enabled: !current.marketplace_enabled
                }))
              }
            />
          </NotificationAccordion>

          <NotificationAccordion
            title="Tracking"
            icon={Bell01}
            expanded={expandedSection === "tracking"}
            highlighted
            onToggle={() =>
              setExpandedSection((current) => (current === "tracking" ? null : "tracking"))
            }
          >
            <div className="space-y-3">
              <NotificationRow
                label="Predicted to arrive late"
                checked={notifications.tracking.predicted_late}
                onChange={() =>
                  updateNotificationState((current) => ({
                    ...current,
                    tracking: {
                      ...current.tracking,
                      predicted_late: !current.tracking.predicted_late
                    }
                  }))
                }
              />
              <NotificationRow
                label="Arrival"
                checked={notifications.tracking.arrival}
                onChange={() =>
                  updateNotificationState((current) => ({
                    ...current,
                    tracking: {
                      ...current.tracking,
                      arrival: !current.tracking.arrival
                    }
                  }))
                }
              />
              <NotificationRow
                label="Detention alert"
                description="Alert after wait time exceeds 90 minutes."
                checked={notifications.tracking.detention_alert}
                onChange={() =>
                  updateNotificationState((current) => ({
                    ...current,
                    tracking: {
                      ...current.tracking,
                      detention_alert: !current.tracking.detention_alert
                    }
                  }))
                }
              />
              <NotificationRow
                label="Departure"
                checked={notifications.tracking.departure}
                onChange={() =>
                  updateNotificationState((current) => ({
                    ...current,
                    tracking: {
                      ...current.tracking,
                      departure: !current.tracking.departure
                    }
                  }))
                }
              />
              <NotificationRow
                label="Load complete"
                checked={notifications.tracking.load_complete}
                onChange={() =>
                  updateNotificationState((current) => ({
                    ...current,
                    tracking: {
                      ...current.tracking,
                      load_complete: !current.tracking.load_complete
                    }
                  }))
                }
              />
              <NotificationRow
                label="Receive attachments"
                checked={notifications.tracking.receive_attachments}
                onChange={() =>
                  updateNotificationState((current) => ({
                    ...current,
                    tracking: {
                      ...current.tracking,
                      receive_attachments: !current.tracking.receive_attachments
                    }
                  }))
                }
              />
              <NotificationRow
                label="Only notify me about loads I entered"
                checked={notifications.tracking.only_my_loads}
                onChange={() =>
                  updateNotificationState((current) => ({
                    ...current,
                    tracking: {
                      ...current.tracking,
                      only_my_loads: !current.tracking.only_my_loads
                    }
                  }))
                }
              />
            </div>

            <div className="mt-6 border-t border-[#EFEFEF] pt-5">
              <p className="text-sm font-medium text-[#161616]">Channels</p>
              <div className="mt-3 space-y-3">
                <NotificationRow
                  label="Desktop"
                  checked={notifications.tracking.channels.desktop}
                  onChange={() =>
                    updateNotificationState((current) => ({
                      ...current,
                      tracking: {
                        ...current.tracking,
                        channels: {
                          ...current.tracking.channels,
                          desktop: !current.tracking.channels.desktop
                        }
                      }
                    }))
                  }
                />
                <NotificationRow
                  label="Email"
                  checked={notifications.tracking.channels.email}
                  onChange={() =>
                    updateNotificationState((current) => ({
                      ...current,
                      tracking: {
                        ...current.tracking,
                        channels: {
                          ...current.tracking.channels,
                          email: !current.tracking.channels.email
                        }
                      }
                    }))
                  }
                />
                <NotificationRow
                  label="SMS"
                  description="Requires a phone number on your profile."
                  checked={notifications.tracking.channels.sms}
                  onChange={() =>
                    updateNotificationState((current) => ({
                      ...current,
                      tracking: {
                        ...current.tracking,
                        channels: {
                          ...current.tracking.channels,
                          sms: !current.tracking.channels.sms
                        }
                      }
                    }))
                  }
                />
              </div>
            </div>
          </NotificationAccordion>

          <NotificationAccordion
            title="Other"
            icon={Bell01}
            expanded={expandedSection === "other"}
            onToggle={() =>
              setExpandedSection((current) => (current === "other" ? null : "other"))
            }
          >
            <NotificationRow
              label="General product updates"
              description="Service announcements and account-level updates."
              checked={notifications.other_enabled}
              onChange={() =>
                updateNotificationState((current) => ({
                  ...current,
                  other_enabled: !current.other_enabled
                }))
              }
            />
          </NotificationAccordion>

          <SettingsFooter
            error={notificationError}
            success={
              isSavingNotifications
                ? "Saving notification settings..."
                : notificationSuccess
            }
          />
        </div>
      ) : null}
    </section>
  );
}

type AccountFieldProps = {
  form: UseFormReturn<AccountProfileValues>;
  id: keyof AccountProfileValues;
  label: string;
  placeholder?: string;
};

function AccountField({ form, id, label, placeholder }: AccountFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} placeholder={placeholder} {...form.register(id)} />
      {form.formState.errors[id] ? (
        <p className="text-sm text-red-600">
          {String(form.formState.errors[id]?.message ?? "")}
        </p>
      ) : null}
    </div>
  );
}

type PasswordFieldProps = {
  form: UseFormReturn<ChangePasswordValues>;
  id: keyof ChangePasswordValues;
  label: string;
};

function PasswordField({ form, id, label }: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type="password" {...form.register(id)} />
      {form.formState.errors[id] ? (
        <p className="text-sm text-red-600">
          {String(form.formState.errors[id]?.message ?? "")}
        </p>
      ) : null}
    </div>
  );
}

type SettingsPanelProps = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: ReactNode;
};

function SettingsPanel({
  icon: Icon,
  title,
  description,
  children
}: SettingsPanelProps) {
  return (
    <div className="rounded-[16px] border border-[#E7E7E7] bg-[#FAFAFA] p-5 lg:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white text-[#161616]">
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-[#161616]">{title}</h2>
          <p className="text-sm text-[#6F6F6F]">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

type NotificationAccordionProps = {
  title: string;
  icon: ComponentType<{ className?: string }>;
  expanded: boolean;
  highlighted?: boolean;
  onToggle: () => void;
  children: ReactNode;
};

function NotificationAccordion({
  title,
  icon: Icon,
  expanded,
  highlighted = false,
  onToggle,
  children
}: NotificationAccordionProps) {
  return (
    <div
      className={cn(
        "rounded-[16px] border bg-[#FAFAFA] transition-colors",
        highlighted && expanded
          ? "border-[#93C5FD] bg-white"
          : "border-[#E7E7E7]"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-white text-[#161616]">
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-sm font-semibold text-[#161616]">{title}</span>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#ECECEC] bg-white text-[#6F6F6F]">
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </span>
      </button>
      {expanded ? <div className="px-5 pb-5">{children}</div> : null}
    </div>
  );
}

type NotificationRowProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
};

function NotificationRow({
  label,
  description,
  checked,
  onChange
}: NotificationRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 pt-0.5">
        <Switch checked={checked} onClick={onChange} />
      </div>
      <div className="min-w-0 space-y-1">
        <p className="text-sm text-[#161616]">{label}</p>
        {description ? (
          <p className="text-xs leading-5 text-[#7D7D7D]">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

type SettingsFooterProps = {
  error?: string | null;
  success?: string | null;
  action?: ReactNode;
};

function SettingsFooter({ error, success, action }: SettingsFooterProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-[#5C5C5C]">{success}</p> : null}
      </div>
      {action}
    </div>
  );
}
