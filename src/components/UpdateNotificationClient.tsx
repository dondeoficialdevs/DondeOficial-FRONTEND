'use client';

import dynamic from 'next/dynamic';

const UpdateNotification = dynamic(
  () => import('@/components/UpdateNotification'),
  { ssr: false }
);

export default function UpdateNotificationClient() {
  return <UpdateNotification />;
}

