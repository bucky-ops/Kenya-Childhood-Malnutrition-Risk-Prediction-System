import type { Metadata } from 'next';
import AlertsClient from '@/components/AlertsClient';

export const metadata: Metadata = {
  title: 'Malnutrition Alerts',
  description: 'Active malnutrition alerts across Kenya. Subscribe to receive push notifications and email alerts when county risk levels change.',
};

export default function AlertsPage() {
  return <AlertsClient />;
}
