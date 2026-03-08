import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "MindField – AI Career Guidance System",
  description:
    "AI-powered career guidance platform for students in Pakistan. Discover your ideal academic field with personalized recommendations, videos, quizzes, and our AI chatbot.",
  keywords:
    "career guidance, Pakistan, students, matric, intermediate, AI recommendation, field selection",
  openGraph: {
    title: "MindField – AI Career Guidance System",
    description:
      "Find your perfect academic field with AI-powered recommendations.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
