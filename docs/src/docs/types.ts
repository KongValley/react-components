import type { ReactNode } from 'react';

export interface DemoEntry {
  title: string;
  description?: string;
  code: string;
  element: ReactNode;
}

export interface ApiRow {
  prop: string;
  type: string;
  defaultValue?: string;
  description: string;
}

export interface ComponentDoc {
  key: string;
  name: string;
  english: string;
  description: string;
  whenToUse?: string;
  demos: DemoEntry[];
  api: ApiRow[];
}
