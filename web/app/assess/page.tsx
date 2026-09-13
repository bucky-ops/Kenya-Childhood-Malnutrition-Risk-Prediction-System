import type { Metadata } from 'next';
import AssessClient from '@/components/AssessClient';

export const metadata: Metadata = {
  title: 'Assess a Child',
  description: 'Caregiver-facing malnutrition risk assessment tool. Enter a child\'s age, weight, height, and dietary info to get an immediate WHO z-score-based risk classification.',
};

export default function AssessPage() {
  return <AssessClient />;
}
