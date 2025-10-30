import { useState } from 'react';
import { register } from '@/api/auth';

export default function RegisterPage(){
  const [form,setForm]=useState({
    numDocumento:'', nombreUno:'', nombreDos:'', apellidoUno:'', apellidoDos:'',
    telefono:'', direccion:'', tipoDocumento:'cedula de ciudadania',
    correo:'', password:'', idRol:2 // ej: 3=ESTUDIANTE
  });
  const [ok,setOk]=useState(''); const [err,setErr]=useState('');

  const onChange=(k:string,v:string)=>setForm(s=>({...s,[k]:v}));

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-2">
      <h1 className="text-xl font-bold mb-2">Registro</h1>
      {ok && <div className="text-green-700">{ok}</div>}
      {err && <div className="text-red-700">{err}</div>}
      <div className="grid grid-cols-2 gap-2">
        <input className="border p-2" placeholder="Documento" onChange={e=>onChange('numDocumento',e.target.value)}/>
        <select className="border p-2" onChange={e=>onChange('tipoDocumento',e.target.value)}>
          <option>cedula de ciudadania</option>
          <option>tarjeta de identidad</option>
          <option>cedula de extranjeria</option>
        </select>
        <input className="border p-2" placeholder="Nombre 1" onChange={e=>onChange('nombreUno',e.target.value)}/>
        <input className="border p-2" placeholder="Nombre 2" onChange={e=>onChange('nombreDos',e.target.value)}/>
        <input className="border p-2" placeholder="Apellido 1" onChange={e=>onChange('apellidoUno',e.target.value)}/>
        <input className="border p-2" placeholder="Apellido 2" onChange={e=>onChange('apellidoDos',e.target.value)}/>
        <input className="border p-2" placeholder="Teléfono (10 díg.)" onChange={e=>onChange('telefono',e.target.value)}/>
        <input className="border p-2" placeholder="Dirección" onChange={e=>onChange('direccion',e.target.value)}/>
      </div>
      <input className="border p-2 w-full" placeholder="Correo" onChange={e=>onChange('correo',e.target.value)}/>
      <input className="border p-2 w-full" type="password" placeholder="Contraseña" onChange={e=>onChange('password',e.target.value)}/>
      <button className="px-4 py-2 bg-black text-white rounded"
        onClick={async()=>{
          setOk(''); setErr('');
          try{
            const payload = {
              numDocumento: Number(form.numDocumento),
              nombreUno: form.nombreUno,
              nombreDos: form.nombreDos || undefined,
              apellidoUno: form.apellidoUno,
              apellidoDos: form.apellidoDos || undefined,
              telefono: form.telefono,
              direccion: form.direccion,
              tipoDocumento: form.tipoDocumento,
              correo: form.correo,
              password: form.password,
              idRol: Number(form.idRol)
            };
            await register(payload);
            setOk('Usuario registrado');
          }catch(e:any){ setErr(e.message || 'Error al registrar'); }
        }}>
        Registrar
      </button>
    </div>
  );
}
