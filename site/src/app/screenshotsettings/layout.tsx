type SettingsLayoutProps = {
  children: React.ReactNode;
};

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex flex-col flex-grow">
      <div className="p-4">{children}</div>
    </div>
  );
}
