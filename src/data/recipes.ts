/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Recipe } from '../types';

export const RECIPES: Recipe[] = [
  {
    id: "rec_1",
    title: "Tarta Colorida rústica de La Verdu",
    description: "Una fantástica tarta repleta de betacarotenos, hojas verdes, tomates asados con fibra saciante y masa integral rápida.",
    ingredients: [
      "2 atados de acelga fresca o espinaca tierna de La Verdu",
      "3 tomates maduros redondos",
      "1 calabaza mediana (hecha puré)",
      "2 zanahorias ralladas finas",
      "1 cebolla picada grande",
      "2 dientes de ajo",
      "1 tapa de masa de tarta integral",
      "2 cucharadas de aceite de oliva",
      "Condimentos: sal, orégano, nuez moscada, pimienta"
    ],
    instructions: [
      "Lavar muy bien todas las verduras frescas de La Verdu.",
      "Cocinar la calabaza al horno para que quede seca y pisarla para lograr un puré consistente.",
      "Saltear la cebolla y el ajo en una sartén con aceite de oliva. Agregar las hojas de acelga cruda cortadas finas por 2 minutos hasta que reduzcan.",
      "Mezclar el salteado con el puré de calabaza y la zanahoria rallada cruda. Condimentar con nuez moscada.",
      "Colocar la tapa de masa en una tartera, rellenarla uniformemente, y coronar con rodajas finas de tomate decorando.",
      "Llevar al horno precalentado a 180°C por 30-35 minutos hasta dorar."
    ],
    prepTime: "45 mins",
    category: "fruits-veg"
  },
  {
    id: "rec_2",
    title: "Infusión Energizante Piporé de Invierno",
    description: "Una reconfortante merienda mateada caliente, saborizada con cascaritas cítricas y endulzada con la miel pura curadora de La Verdu.",
    ingredients: [
      "4 cucharadas soperas de Yerba Mate Piporé tradicional",
      "2 cucharaditas de miel de abeja pura y natural de La Verdu",
      "Cáscaras de media naranja madura orgánica",
      "1 rodaja de jengibre fresco",
      "750ml de agua pura a unos 80°C"
    ],
    instructions: [
      "Calentar el agua vigilando que no hierva (debe quedar justo a 80°C, ideal para conservar nutrientes).",
      "En un copón de barro o taza grande gruesa, colocar una base de Yerba Mate Piporé con las cascaritas de naranja y el trozo de jengibre.",
      "Cebar despacio mojando solo una parte de la yerba para dejar un lado seco (eso extiende el sabor por más tiempo).",
      "Añadir media cucharadita de miel pura directamente en el huequito del mate con cada cebada para un sabor suave, cremoso e inmuno-estimulante."
    ],
    prepTime: "10 mins",
    category: "mate-honey"
  },
  {
    id: "rec_3",
    title: "Budín Frutal Saludable con Miel pura",
    description: "Sustituye por completo las azúcares refinadas preparando este budín de manzana crujiente y manzanas rojas.",
    ingredients: [
      "3 manzanas coloradas de La Verdu (ralladas)",
      "4 cucharadas de miel de abeja pura líquida",
      "2 huevos frescos",
      "1 taza de harina integral o de avena",
      "Media taza de nueces picadas",
      "1 cucharadita de esencia de vainilla y polvo de hornear",
      "1 chorrito de leche o bebida de avena"
    ],
    instructions: [
      "Precalentar el horno a 170°C y engrasar un molde de budín con unas gotas de aceite de coco u oliva.",
      "Batir vigorosamente los dos huevos con las 4 cucharadas de miel pura hasta que espume un poco.",
      "Incorporar la manzana rallada y la vainilla mezclando bien.",
      "Tamizar la harina junto al polvo de hornear e integrarlo lentamente alternando con el chorrito de leche.",
      "Volcar las nueces picadas por arriba y verter sobre el molde.",
      "Hornear durante 35-40 minutos hasta pinchar con cuchillo y que este salga seco. Servir frío con mate Piporé."
    ],
    prepTime: "50 mins",
    category: "mate-honey"
  },
  {
    id: "rec_4",
    title: "Sopa Crema de Huerta y Aromáticas de Balcón",
    description: "Consigue el máximo sabor salteando de lleno tus propios puerros y zapallitos con ramitas de romero de tu propia huerta hogareña.",
    ingredients: [
      "4 ramitas frescas de romero o tomillo de tu huerta",
      "3 zapallitos medianos de La Verdu",
      "1 atado de puerros frescos",
      "2 papas medianas (aportan cremosidad natural sin crema)",
      "1 cebolla grande de verdeo",
      "1 cucharadita de miel pura (para equilibrar acidez)",
      "1 litro de caldo casero de verduras"
    ],
    instructions: [
      "Lavar bien las verduras. Picar los puerros, la cebolla de verdeo y los zapallitos.",
      "En una olla profunda, saltear el puerro y verdeo con un chorrito de aceite de oliva y la ramita de romero entera para perfumar.",
      "Cortar las papas en dados pequeños e incorporarlas junto a los zapallitos. Saltear por 5 minutos.",
      "Vertir el caldo de verduras caliente hasta cubrir y agregar la cucharadita de miel pura.",
      "Cocinar a fuego medio-bajo tapado durante 20-25 minutos hasta que la papa esté ultra tierna.",
      "Retirar la ramita de romero firme, y procesar todo con minipimer hasta lograr una crema suave, homogénea y reconfortante."
    ],
    prepTime: "35 mins",
    category: "garden"
  }
];
