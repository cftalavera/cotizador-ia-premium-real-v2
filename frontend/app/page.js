
"use client";

import { useState } from "react";

export default function Home() {

  const [files, setFiles] = useState([]);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [comentarios, setComentarios] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null); 
  const [metodo, setMetodo] = useState("hibrido");
  const [ciudad, setCiudad] = useState("Cuernavaca");
  const [tipoTaller, setTipoTaller] = useState("Generalista");
  const [ultimaActualizacion, setUltimaActualizacion] = useState("");
	
  const API_URL = process.env.NEXT_PUBLIC_API_URL||"https://cotizador-ia-premium-real-v2-production.up.railway.app";

	
const actualizarPrecios = async () => {

  try {

    const response = await fetch(`${API_URL}/actualizar-precios`, {
  method: "POST"
});

    const data = await response.json();

    if (data.success) {

      setUltimaActualizacion(
        data.precios.ultima_actualizacion
      );

      alert(
        "Precios actualizados correctamente"
      );

    }

  } catch (error) {

    alert(
      "Error actualizando precios"
    );

  }

};
  const enviar = async () => {

    if (files.length === 0) {
      alert("Selecciona imágenes");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("fotos", file);
    });

	formData.append("metodo", metodo);
	formData.append("ciudad", ciudad);
	formData.append("tipoTaller", tipoTaller);
    formData.append("comentarios", comentarios);

    try {

      const response = await fetch(`${API_URL}/cotizar`, {
		  method: "POST",
		  body: formData
		});
      const data = await response.json();

      setResultado(data.data);

    } catch (error) {

      console.error(error);
      alert("Error conectando backend");

    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#f4f6fb] text-[#111827] flex">

      <aside className="w-[280px] bg-[#0b1020] text-white min-h-screen p-6 hidden lg:block">

        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center text-2xl">
            🚗
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              Cotizador IA
            </h1>

            <p className="text-sm text-gray-400">
              Análisis Inteligente
            </p>
          </div>
        </div>

        <div className="space-y-4">

          <div className="bg-violet-600 rounded-2xl p-4 font-semibold">
            Nuevo análisis
          </div>

          <div className="bg-[#141b31] rounded-2xl p-4">
            Historial
          </div>

          <div className="bg-[#141b31] rounded-2xl p-4">
            Cotizaciones
          </div>

<button
  onClick={actualizarPrecios}
  className="bg-green-600 hover:bg-green-700 text-white rounded-2xl p-4 w-full font-semibold"
>
  Actualizar precios IA
</button>

        </div>

        <div className="mt-10 bg-[#141b31] p-5 rounded-2xl">

          <h3 className="font-bold mb-3">
            Mercado local
          </h3>
	

          <p className="text-sm text-gray-300">
            Cuernavaca, Morelos
          </p>
<p className="text-sm text-gray-300">
  Última actualización:
  {ultimaActualizacion}
</p>

        </div>

      </aside>

      <section className="flex-1 p-8">

        <div className="bg-white rounded-3xl p-8 shadow-sm">

          <div className="flex items-center justify-between mb-8">

            <div>
              <h1 className="text-5xl font-bold mb-3">
                Resultado del Análisis
              </h1>

              <p className="text-gray-500">
                Cotización inteligente basada en GPT Vision
              </p>
            </div>

            <button className="bg-violet-600 text-white px-6 py-4 rounded-2xl font-semibold">
              Nuevo análisis
            </button>

          </div>

          <div className="border rounded-3xl p-6 mb-8">

            <h2 className="text-2xl font-bold mb-4">
              Imágenes del vehículo
            </h2>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="mb-5"
            />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

  {files.map((file, index) => (

    <div
      key={index}
      className="cursor-pointer group"
      onClick={() =>
        setImagenSeleccionada(
          URL.createObjectURL(file)
        )
      }
    >

      <img
        src={URL.createObjectURL(file)}
        alt={file.name}
        className="
          w-full
          h-36
          object-cover
          rounded-2xl
          border
          shadow-sm
          transition
          group-hover:scale-105
        "
      />

      <p className="text-xs mt-2 truncate">
        {file.name}
      </p>

    </div>

  ))}

</div>
		  
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

  <div>
    <label className="block text-sm font-semibold mb-2 text-gray-700">
      Método de cálculo
    </label>

    <select
      value={metodo}
      onChange={(e) => setMetodo(e.target.value)}
      className="w-full border rounded-2xl p-4"
    >
      <option value="ia">IA Mercado</option>
      <option value="manual">Tabla Manual</option>
      <option value="hibrido">Híbrido</option>
    </select>
  </div>

  <div>
    <label className="block text-sm font-semibold mb-2 text-gray-700">
      Ciudad
    </label>

    <select
      value={ciudad}
      onChange={(e) => setCiudad(e.target.value)}
      className="w-full border rounded-2xl p-4"
    >
      <option>Cuernavaca</option>
      <option>CDMX</option>
      <option>Puebla</option>
      <option>Querétaro</option>
    </select>
  </div>

  <div>
    <label className="block text-sm font-semibold mb-2 text-gray-700">
      Tipo de taller
    </label>

    <select
      value={tipoTaller}
      onChange={(e) => setTipoTaller(e.target.value)}
      className="w-full border rounded-2xl p-4"
    >
      <option>Generalista</option>
      <option>Premium</option>
    </select>
  </div>

</div>
</div>
          <div className="bg-[#faf7ff] border border-violet-200 rounded-3xl p-6 mb-8">

            <h2 className="text-2xl font-bold mb-4">
              Comentarios o Particularidades
            </h2>

            <textarea
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              rows={5}
              placeholder="Ejemplo: usar refacciones OEM, entrega urgente, color tricapa, etc."
              className="w-full border rounded-2xl p-4"
            />

          </div>

          <button
            onClick={enviar}
            className="bg-[#111827] text-white px-8 py-5 rounded-2xl text-lg font-bold"
          >
            Generar cotización
          </button>

        </div>

        {loading && (
          <div className="mt-8 bg-white rounded-3xl p-10 text-center shadow-sm">
            <h2 className="text-3xl font-bold">
              Analizando imágenes con GPT Vision...
            </h2>
          </div>
        )}

        {resultado && (

          <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

              <div className="bg-[#f5fff7] border border-green-200 rounded-3xl p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Estimado mínimo
                </h3>

                <p className="text-5xl font-bold text-green-700">
                  {resultado.estimado_minimo_mxn}
                </p>
              </div>
			  
			  <div className="bg-violet-600 rounded-3xl p-6 text-white">
				  <h3 className="text-lg font-semibold mb-2">
					Costo Promedio ⭐
				  </h3>

				  <p className="text-5xl font-bold">
					{resultado.estimado_promedio_mxn}
				  </p>
				</div>

              <div className="bg-[#faf7ff] border border-violet-200 rounded-3xl p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Estimado máximo
                </h3>

                <p className="text-5xl font-bold text-violet-700">
                  {resultado.estimado_maximo_mxn}
                </p>
              </div>

              <div className="bg-[#fffaf0] border border-orange-200 rounded-3xl p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Nivel de daño
                </h3>

                <p className="text-4xl font-bold">
                  {resultado.nivel_dano}
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <div className="bg-gray-50 rounded-3xl p-6">

                <h2 className="text-2xl font-bold mb-4">
                  Piezas dañadas
                </h2>

                <ul className="space-y-3">

                  {resultado.piezas_danadas?.map((item, index) => (
                    <li
                      key={index}
                      className="bg-white rounded-2xl p-4 border"
                    >
                      {item}
                    </li>
                  ))}

                </ul>

              </div>

              <div className="bg-gray-50 rounded-3xl p-6">

                <h2 className="text-2xl font-bold mb-4">
                  Reparación
                </h2>

                <div className="space-y-4">

                  <div className="bg-white rounded-2xl p-4 border">
                    {resultado.reparar_o_cambiar}
                  </div>

                  <div className="bg-white rounded-2xl p-4 border">
                    Pintura: {resultado.requiere_pintura ? "Sí" : "No"}
                  </div>

                  <div className="bg-white rounded-2xl p-4 border">
                    Difuminado: {resultado.requiere_difuminado ? "Sí" : "No"}
                  </div>

                  <div className="bg-white rounded-2xl p-4 border">
                    Horas estimadas: {resultado.horas_estimadas}
                  </div>

                </div>

              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

              <div className="bg-gray-50 rounded-3xl p-6">

                <h2 className="text-2xl font-bold mb-4">
                  Descripción del daño
                </h2>

                <p>
                  {resultado.descripcion}
                </p>

              </div>

              <div className="bg-[#f0fff4] rounded-3xl p-6 border border-green-200">

                <h2 className="text-2xl font-bold mb-4">
                  Mercado Cuernavaca
                </h2>

                <p className="mb-4">
                  {resultado.analisis_mercado}
                </p>

                <p>
                  {resultado.consideraciones}
                </p>

              </div>
			  
			  <div className="mt-6 bg-white rounded-3xl p-6 border">

  <h2 className="text-2xl font-bold mb-4">
    Desglose de Costos
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

    <div className="border rounded-2xl p-4">
      Hojalatería
      <br/>
      <strong>{resultado.desglose?.hojalateria}</strong>
    </div>

    <div className="border rounded-2xl p-4">
      Pintura
      <br/>
      <strong>{resultado.desglose?.pintura}</strong>
    </div>

    <div className="border rounded-2xl p-4">
      Materiales
      <br/>
      <strong>{resultado.desglose?.materiales}</strong>
    </div>

    <div className="border rounded-2xl p-4">
      Difuminado
      <br/>
      <strong>{resultado.desglose?.difuminado}</strong>
    </div>

    <div className="border rounded-2xl p-4">
      Refacciones
      <br/>
      <strong>{resultado.desglose?.refacciones}</strong>
    </div>

  </div>

</div>

            </div>

          </div>

        )}

      </section>


{imagenSeleccionada && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
          onClick={() => setImagenSeleccionada(null)}
        >
          <div className="relative">

            <button
              onClick={() => setImagenSeleccionada(null)}
              className="absolute top-2 right-2 bg-white rounded-full px-4 py-2 font-bold"
            >
              ✕
            </button>

            <img
              src={imagenSeleccionada}
              alt="Vista previa"
              className="max-w-[90vw] max-h-[90vh] rounded-3xl shadow-2xl"
            />

          </div>
        </div>
      )}


    </main>
  );
}
