
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import OpenAI from "openai";
import path from "path";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function imageToBase64(path) {
  return fs.readFileSync(path).toString("base64");
}


async function actualizarPreciosIA() {

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0,
    response_format: {
      type: "json_object"
    },
    messages: [
      {
        role: "user",
        content: `
Actualiza precios promedio para talleres de hojalatería y pintura en Cuernavaca Morelos.

Devuelve SOLO JSON:

{
  "generalista": {
    "hora_hojalateria": 0,
    "hora_pintura": 0,
    "materiales_base": 0,
    "difuminado": 0
  },
  "premium": {
    "hora_hojalateria": 0,
    "hora_pintura": 0,
    "materiales_base": 0,
    "difuminado": 0
  }
}
`
      }
    ]
  });

  return JSON.parse(
    response.choices[0].message.content
  );
}

app.post("/actualizar-precios", async (req, res) => {

  try {

    const precios = await actualizarPreciosIA();

    const archivo = {
      ultima_actualizacion: new Date().toISOString(),
      ciudad: "Cuernavaca",
      fuente: "IA + Mercado Local",
      ...precios
    };

    fs.writeFileSync(
      "./precios/cuernavaca.json",
      JSON.stringify(archivo, null, 2)
    );

    res.json({
      success: true,
      precios: archivo
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});

app.post("/cotizar", upload.array("fotos", 10), async (req, res) => {


const precios = JSON.parse(
  fs.readFileSync(
    "./precios/cuernavaca.json",
    "utf8"
  )
);

  try {

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No se subieron imágenes"
      });
    }

	const comentarios = req.body.comentarios || "";
	const metodo = req.body.metodo || "hibrido";
	const ciudad = req.body.ciudad || "Cuernavaca";
	const tipoTaller = req.body.tipoTaller || "Generalista";






    const content = [
  {
    type: "text",
text: `
Analiza TODAS las imágenes automotrices.

Ciudad: ${ciudad}

Tipo de taller: ${tipoTaller}

Método de cálculo: ${metodo}

Comentarios del cliente:
${comentarios}

Basado en mercado automotriz actual de ${ciudad}, México.

Además genera un valor "estimado_ia" en pesos mexicanos basado en:

- Daño observado
- Cantidad de piezas afectadas
- Costos promedio de hojalatería y pintura en ${ciudad}
- Materiales y pintura requeridos
- Necesidad de difuminado
- Posibles refacciones

El valor debe representar una cotización promedio realista.

Devuelve SOLO JSON:

{
  "piezas_danadas":[],
  "nivel_dano":"leve|medio|fuerte",

  "horas_hojalateria":0,
  "horas_pintura":0,

  "requiere_refacciones":false,
  "costo_refacciones_estimado":0,

  "estimado_ia":0,

  "reparar_o_cambiar":"",
  "requiere_pintura":true,
  "requiere_difuminado":true,

  "descripcion":"",
  "consideraciones":"",
  "analisis_mercado":""
}
`
  }
];

    for (const file of req.files) {

      const base64Image = imageToBase64(file.path);

      content.push({
        type: "image_url",
        image_url: {
          url: `data:image/jpeg;base64,${base64Image}`
        }
      });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content
        }
      ],
      response_format: {
        type: "json_object"
      }
    });

const result = JSON.parse(
  response.choices[0].message.content
);

// =========================
// MODO IA
// =========================

if (metodo === "ia") {

if (
  result.estimado_ia === undefined ||
  result.estimado_ia === null
) {
  return res.status(500).json({
    success: false,
    error: "GPT no devolvió estimado_ia"
  });
}

const base =
  Number(result.estimado_ia);

  result.estimado_minimo_mxn =
    `$${Math.round(base * 0.9).toLocaleString("es-MX")}`;

  result.estimado_promedio_mxn =
    `$${base.toLocaleString("es-MX")}`;

  result.estimado_maximo_mxn =
    `$${Math.round(base * 1.15).toLocaleString("es-MX")}`;

  result.desglose = {
    metodo: "IA",
    observacion:
      "Estimación generada por IA"
  };

  return res.json({
    success: true,
    data: result
  });

}

// =========================
// MODO MANUAL
// =========================

if (metodo === "manual") {

  const tabla =
    tipoTaller === "Premium"
      ? precios.premium
      : precios.generalista;

  const subtotal =
    tabla.materiales_base +
    tabla.difuminado;

  result.estimado_minimo_mxn =
    `$${Math.round(subtotal * 0.9).toLocaleString("es-MX")}`;

  result.estimado_promedio_mxn =
    `$${subtotal.toLocaleString("es-MX")}`;

  result.estimado_maximo_mxn =
    `$${Math.round(subtotal * 1.15).toLocaleString("es-MX")}`;

  result.desglose = {
    metodo: "Manual",
    materiales:
      `$${tabla.materiales_base.toLocaleString("es-MX")}`,
    difuminado:
      `$${tabla.difuminado.toLocaleString("es-MX")}`
  };

  return res.json({
    success: true,
    data: result
  });

}

if (metodo === "hibrido") {
const tabla =
  tipoTaller === "Premium"
    ? precios.premium
    : precios.generalista;

const horasHojalateria =
  Number(result.horas_hojalateria || 0);

const horasPintura =
  Number(result.horas_pintura || 0);

const costoHojalateria =
  horasHojalateria *
  tabla.hora_hojalateria;

const costoPintura =
  horasPintura *
  tabla.hora_pintura;

const costoMateriales =
  tabla.materiales_base;

const costoDifuminado =
  result.requiere_difuminado
    ? tabla.difuminado
    : 0;

let factorDano = 1;

if (result.nivel_dano === "medio")
  factorDano = 1.15;

if (result.nivel_dano === "fuerte")
  factorDano = 1.35;

const subtotal =
(
  costoHojalateria +
  costoPintura +
  costoMateriales +
  costoDifuminado
) * factorDano;

const minimo =
  Math.round(subtotal * 0.90);

const promedio =
  Math.round(subtotal);

const maximo =
  Math.round(subtotal * 1.15);

result.estimado_minimo_mxn =
  `$${minimo.toLocaleString("es-MX")}`;

result.estimado_promedio_mxn =
  `$${promedio.toLocaleString("es-MX")}`;

result.estimado_maximo_mxn =
  `$${maximo.toLocaleString("es-MX")}`;

result.desglose = {
  hojalateria:
    `$${costoHojalateria.toLocaleString("es-MX")}`,

  pintura:
    `$${costoPintura.toLocaleString("es-MX")}`,

  materiales:
    `$${costoMateriales.toLocaleString("es-MX")}`,

  difuminado:
    `$${costoDifuminado.toLocaleString("es-MX")}`,

  refacciones:
    "Por validar",

  subtotal:
    `$${subtotal.toLocaleString("es-MX")}`
};

return res.json({
  success: true,
  data: result
});


}



return res.status(400).json({
  success: false,
  error: "Método inválido"
});


  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});


const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
    res.json({
        status: "ok",
        servicio: "Cotizador IA Premium",
        version: "1.0"
    });
});

app.listen(PORT, () => {
    console.log(`Servidor premium iniciado en puerto ${PORT}`);
});
