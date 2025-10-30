// src/components/ProtectedImage.tsx
import React from 'react';
import { useProtectedMedia } from '@/hooks/useProtectedMedia';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  mediaId?: string;
  version?: string | number; // para cache-busting
  fallback?: React.ReactNode;
};

export default function ProtectedImage({ mediaId, version, fallback, ...imgProps }: Props) {
  const { url, loading, error } = useProtectedMedia(mediaId, version);

  if (!mediaId) return <>{fallback ?? null}</>;
  if (loading) return <div className="italic text-gray-500">Cargando imagen…</div>;
  if (error)   return <div className="italic text-red-600">Error: {error}</div>;
  if (!url)    return <>{fallback ?? null}</>;

  return <img src={url} {...imgProps} />;
}
