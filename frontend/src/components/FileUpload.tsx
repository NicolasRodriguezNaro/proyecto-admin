import { useState } from 'react';

export default function FileUpload({ onSelect }:{ onSelect:(f:File)=>void }) {
  const [fileName, setFileName] = useState('');
  return (
    <label className="block border p-3 rounded cursor-pointer">
      <input type="file" accept="image/*" className="hidden"
             onChange={e => {
               const f = e.target.files?.[0];
               if (f) { setFileName(f.name); onSelect(f); }
             }}/>
      <div>Seleccionar imagen {fileName && <span className="text-sm">— {fileName}</span>}</div>
    </label>
  );
}
