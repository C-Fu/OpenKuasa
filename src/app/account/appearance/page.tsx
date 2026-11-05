import type { Metadata } from 'next';
import { AppearanceClient } from './appearance-client';

export const metadata: Metadata = {
  title: 'Appearance & Themes · OpenKuasa',
  description: 'Personalize your workspace theme, display aesthetics, and mode preferences.',
};

export default function AppearancePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Appearance</h1>
        <p className="text-sm text-muted-foreground">
          Personalize your workspace theme, display aesthetics, and mode preferences.
        </p>
      </div>

      <AppearanceClient />
    </div>
  );
}
