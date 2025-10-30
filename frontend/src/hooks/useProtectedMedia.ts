// src/hooks/useProtectedMedia.ts
import { useEffect, useState } from 'react';
import { http } from '@/api/http';

export function useProtectedMedia(mediaId?: string, version?: string | number) {
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    async function load() {
      if (!mediaId) { setUrl(undefined); return; }
      setLoading(true); setError(null);
      try {
        // usa http(), que agrega el Authorization automáticamente
        const res = await http(`/api/media/${mediaId}/archivo${version ? `?v=${encodeURIComponent(String(version))}` : ''}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        if (active) setUrl(objectUrl);
      } catch (e:any) {
        if (active) setError(e?.message || 'No se pudo cargar la imagen');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [mediaId, version]);

  return { url, error, loading };
}
