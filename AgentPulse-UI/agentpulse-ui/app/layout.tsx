import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'AgentPulse | Agent Runtime Security', description: 'Observe, analyze, and secure AI agent execution.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
