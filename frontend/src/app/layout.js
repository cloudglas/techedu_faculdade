export const metadata = {
  title: 'TechEdu IA & Dev',
  description: 'Plataforma de cursos técnicos e certificações',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  )
}