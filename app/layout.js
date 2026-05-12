export const metadata = {
  title: 'Seat Planner | LVLUP PRO',
  description: 'Multi-tenant seat management for BPO operations.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
