
import "./globals.css";

export const metadata = {
  title: "Cotizador IA Premium",
  description: "Cotizador IA Automotriz"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
