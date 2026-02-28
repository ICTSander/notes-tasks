export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page gets its own layout WITHOUT the Nav bar
  return <>{children}</>;
}
