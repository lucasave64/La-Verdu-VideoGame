/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Level } from '../types';

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "Frutas y Verduras Frescas",
    description: "Multiplica tu vitalidad y aprende sobre el arcoíris nutricional y alimentos de temporada de La Verdu.",
    colorClass: "bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-400",
    accentColor: "emerald",
    lessons: [
      {
        id: "l1_1",
        title: "El Arcoíris en tu Plato",
        description: "Descubre qué significan los colores de los vegetales y por qué combinarlos.",
        xpReward: 100,
        questions: [
          {
            id: "q_1_1_1",
            type: "multiple-choice",
            questionText: "¿Qué beneficios aportan los vegetales de color ROJO intenso, como los tomates y las frutillas de La Verdu?",
            options: [
              "Contienen licopeno, un potente antioxidante que cuida tu corazón",
              "Aportan principalmente grasas saturadas",
              "Solo sirven para decorar el plato, sin nutrientes reales",
              "Previene que el cabello se torne gris al instante"
            ],
            correctAnswer: "Contienen licopeno, un potente antioxidante que cuida tu corazón",
            explanation: "¡Exacto! El color rojo indica una abundancia de licopeno y antocianinas, excelentes cardioprotectores y antioxidantes provistos por la naturaleza.",
            rewardExp: 20
          },
          {
            id: "q_1_1_2",
            type: "true-false",
            questionText: "Verdadero o falso: Las espinacas y acelgas oscuras de hoja verde aportan hierro que se absorbe mejor si se combinan con vitamina C (como juguito de limón fresco).",
            options: [
              "Verdadero",
              "Falso"
            ],
            correctAnswer: "Verdadero",
            explanation: "¡Correcto! El hierro no hemo de los vegetales de hojas verdes oscuras multiplica su absorción en nuestro cuerpo cuando agregamos unas gotas de limón, rico en vitamina C.",
            rewardExp: 20
          },
          {
            id: "q_1_1_3",
            type: "multiple-choice",
            questionText: "¿Por qué se recomienda consumir frutas de ESTACIÓN en lugar de frutas de cámara artificial?",
            options: [
              "Porque conservan su máximo sabor, nutrientes y son mucho más económicas y amigables con el planeta",
              "Porque de estación duran 5 meses más en la heladera sin helarse",
              "Porque contienen azúcar sintética inocua",
              "Solo por capricho de los agricultores"
            ],
            correctAnswer: "Porque conservan su máximo sabor, nutrientes y son mucho más económicas y amigables con el planeta",
            explanation: "¡Así es! Las frutas recolectadas en su momento óptimo de maduración natural en La Verdu tienen mayor concentración de vitaminas, mejor aroma y apoyan el comercio local.",
            rewardExp: 20
          },
          {
            id: "q_1_1_4",
            type: "sorting",
            questionText: "Ordena estos alimentos de MENOR a MAYOR contenido de contenido calórico, priorizando alimentos frescos saludables de volumen:",
            options: [
              "Lechuga Criolla",
              "Manzana Manzana",
              "Palta Cremosa",
              "Yerba Mate Seca"
            ],
            correctAnswer: ["Lechuga Criolla", "Manzana Manzana", "Palta Cremosa", "Yerba Mate Seca"],
            explanation: "¡Excelente! La lechuga está compuesta por más de 95% de agua, la manzana provee fructosa y fibra, la palta grasas saludables calóricas, y el mate procesado seco al disolverse es concentrado.",
            rewardExp: 20
          }
        ]
      },
      {
        id: "l1_2",
        title: "Nutrición Inteligente",
        description: "Aprende trucos cotidianos para no desperdiciar nada y comer con bienestar.",
        xpReward: 100,
        questions: [
          {
            id: "q_1_2_1",
            type: "multiple-choice",
            questionText: "¿Qué se puede hacer con las hojas tiernas de los nabos, remolachas o zanahorias que sueles cortar?",
            options: [
              "Saltearlas con ajo, utilizarlas en budines, tortillas o licuados, ya que son hiper-nutritivas",
              "Tirarlas al tacho inmediatamente, dado que son tóxicas",
              "Consumirlas secas únicamente para evitar fiebre",
              "Plancharlas para usarlas de servilletas"
            ],
            correctAnswer: "Saltearlas con ajo, utilizarlas en budines, tortillas o licuados, ya que son hiper-nutritivas",
            explanation: "¡Totalmente! Las hojas de remolacha y nabo tienen más calcio y hierro que muchas otras verduras corrientes. ¡En La Verdu incentivamos el desperdicio cero!",
            rewardExp: 25
          },
          {
            id: "q_1_2_2",
            type: "true-false",
            questionText: "Consumir una manzana entera CON SU CÁSCARA (bien lavada) aporta más fibra y antioxidantes que tomar solo su jugo filtrado.",
            options: [
              "Verdadero",
              "Falso"
            ],
            correctAnswer: "Verdadero",
            explanation: "¡Exacto! Al retirar la cáscara y exprimir, perdemos la fibra soluble que regula el azúcar en sangre, quedando solo el agua con fructosa.",
            rewardExp: 25
          },
          {
            id: "q_1_2_3",
            type: "multiple-choice",
            questionText: "¿Cuál es el beneficio de consumir vegetales anaranjados como la calabaza, la zanahoria y el durazno?",
            options: [
              "Su alta concentración de Betacarotenos (Provitamina A) vitales para la salud ocular y cutánea",
              "Que tiñen la sangre de naranja para rechazar parásitos",
              "No tienen ningún valor vitamínico, solo agua de almidón",
              "Prevenir dolores en la punta de los dedos"
            ],
            correctAnswer: "Su alta concentración de Betacarotenos (Provitamina A) vitales para la salud ocular y cutánea",
            explanation: "¡Es correcto! Los betacarotenos son antioxidantes que el cuerpo transforma en vitamina A, ideal para la vista, la regeneración epitelial y proteger la salud celular.",
            rewardExp: 25
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Yerba Mate Piporé y Miel",
    description: "Explora la energía natural de la yerba de tradición argentina y el poder sanador de la miel pura.",
    colorClass: "bg-amber-500 hover:bg-amber-600 focus:ring-amber-400",
    accentColor: "amber",
    lessons: [
      {
        id: "l2_1",
        title: "Yerba Mate Piporé, Herencia Guaraní",
        description: "El secreto del mate perfecto y los inmensos beneficios de la yerba con mística regional.",
        xpReward: 120,
        questions: [
          {
            id: "q_2_1_1",
            type: "multiple-choice",
            questionText: "¿Qué beneficios antioxidantes y energizantes tiene consumir Yerba Mate Piporé regularmente?",
            options: [
              "Aporta polifenoles, cafeína natural (mateína) que mejora el enfoque mental sin el nerviosismo del café, y potasio",
              "Ayuda a dormir 14 horas seguidas instantáneamente",
              "Sustituye completamente la necesidad de ingerir verduras físicas",
              "Solo sirve de diurético, no contiene vitaminas ni minerales"
            ],
            correctAnswer: "Aporta polifenoles, cafeína natural (mateína) que mejora el enfoque mental sin el nerviosismo del café, y potasio",
            explanation: "¡Maravilloso! El Mate Piporé de Santo Pipó es rico en antioxidantes, superando incluso al té verde en cantidad de polifenoles activos.",
            rewardExp: 30
          },
          {
            id: "q_2_1_2",
            type: "true-false",
            questionText: "Para cebar un buen mate Piporé sin quemar la yerba, el agua óptima debe estar entre 75°C y 82°C (nunca hervida a 100°C).",
            options: [
              "Verdadero",
              "Falso"
            ],
            correctAnswer: "Verdadero",
            explanation: "¡Correcto! El agua hirviendo altera los componentes aromáticos y quema los polifenoles, volviendo el mate extremadamente amargo e irritante.",
            rewardExp: 30
          },
          {
            id: "q_2_1_3",
            type: "multiple-choice",
            questionText: "¿Por qué la Yerba Mate Piporé destaca por su suave amargor equilibrado?",
            options: [
              "Por su estacionado tradicional natural prolongado de hasta un año o más",
              "Porque le inyectan endulzantes químicos en las fábricas",
              "Porque la lavan con agua purificada antes de empaquetar",
              "Porque es mezclada con aserrín fino"
            ],
            correctAnswer: "Por su estacionado tradicional natural prolongado de hasta un año o más",
            explanation: "¡Exactamente! El estacionamiento natural madura la yerba mate dándole ese carácter noble, duradero y de digestión amigable.",
            rewardExp: 30
          }
        ]
      },
      {
        id: "l2_2",
        title: "La Miel Pura, Oro Líquido",
        description: "Aprende a diferenciar la verdadera miel salvaje de los jarabes ultraprocesados de góndola.",
        xpReward: 120,
        questions: [
          {
            id: "q_2_2_1",
            type: "multiple-choice",
            questionText: "¿Cómo puedes verificar que una miel comprada en La Verdu es 100% PURA de abeja y no jarabe adulterado?",
            options: [
              "La miel pura cristaliza (se endurece) a bajas temperaturas, y al disolverse en agua cae firmemente al fondo sin disgregarse rápido",
              "La miel pura siempre se mantiene líquida transparente como agua dulce",
              "La miel pura tiene olor fuerte a alcohol etílico esterilizado",
              "Debe brillar en la oscuridad ante luz ultravioleta"
            ],
            correctAnswer: "La miel pura cristaliza (se endurece) a bajas temperaturas, y al disolverse en agua cae firmemente al fondo sin disgregarse rápido",
            explanation: "¡Exacto! La cristalización es una garantía natural de que la miel contiene polem y azúcares nativos complejos, no jarabes de maíz industriales adicionados.",
            rewardExp: 35
          },
          {
            id: "q_2_2_2",
            type: "true-false",
            questionText: "Verdadero o falso: La miel pura contiene compuestos antibacterianos, enzimas activas beneficiosas y sirve como un excelente calmante de garganta natural.",
            options: [
              "Verdadero",
              "Falso"
            ],
            correctAnswer: "Verdadero",
            explanation: "¡Verdadero! Gracias a la inhibina y enzimas puestas por las abejas, la miel es antiséptica, cicatriza tejidos inflamados de la faringe y restituye energías rápidamente.",
            rewardExp: 35
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Huertas Hogareñas",
    description: "Aprende a cultivar tus propios alimentos frescos, compostar tus residuos y cuidar la tierra viva.",
    colorClass: "bg-lime-600 hover:bg-lime-700 focus:ring-lime-500",
    accentColor: "lime",
    lessons: [
      {
        id: "l3_1",
        title: "Mi Primer Cultivo en Casa",
        description: "Comienza con aromáticas e ingredientes fáciles para iniciar tu soberanía alimentaria.",
        xpReward: 150,
        questions: [
          {
            id: "q_3_1_1",
            type: "multiple-choice",
            questionText: "¿Cuáles son las plantas aromáticas ideales para principiantes debido a su resiliencia y adaptabilidad en macetas hogareñas?",
            options: [
              "Romero, menta, albahaca y orégano",
              "Coco, plantín de palta Hass de 3 metros y piña madura",
              "Helechos silvestres y cactus espinosos gigantes",
              "Solo champiñones y setas de sótano húmedo"
            ],
            correctAnswer: "Romero, menta, albahaca y orégano",
            explanation: "¡Sí! El romero resiste muy bien la falta de agua, la menta crece vigorosa (conviene tenerla en maceta individual porque es invasiva) y la albahaca alegra tus fideos veraniegos.",
            rewardExp: 40
          },
          {
            id: "q_3_1_2",
            type: "true-false",
            questionText: "Verdadero o falso: Para que las huertas prosperen, es fundamental que reciban como mínimo de 4 a 6 horas diarias de luz solar directa.",
            options: [
              "Verdadero",
              "Falso"
            ],
            correctAnswer: "Verdadero",
            explanation: "¡Correcto! La energía solar activa la fotosíntesis requerida para que las hortalizas concentren azúcares, carotenos y se desarrollen con tallos robustos.",
            rewardExp: 40
          },
          {
            id: "q_3_1_3",
            type: "multiple-choice",
            questionText: "¿Qué es la 'Asociación de Cultivos' en una huerta familiar?",
            options: [
              "Plantar juntas especies que se ayudan mutuamente a ahuyentar plagas o aportar nutrientes (como tomate con albahaca)",
              "Constituir un gremio de sembradores para fijar precios de remates",
              "Regar las plantaciones solo los días domingos de manera colectiva",
              "Separar las plantas 4 metros una de la otra obligatoriamente"
            ],
            correctAnswer: "Plantar juntas especies que se ayudan mutuamente a ahuyentar plagas o aportar nutrientes (como tomate con albahaca)",
            explanation: "¡Fantástico! Por ejemplo, la albahaca actúa como repelente natural de insectos que atacan al tomate, y este le brinda una sombra reparadora en horas pico de calor.",
            rewardExp: 40
          }
        ]
      },
      {
        id: "l3_2",
        title: "Compostaje y Suelos Sabios",
        description: "Devuélvele a la tierra los nutrientes transformando cáscaras y ramitas en abono orgánico fértil.",
        xpReward: 150,
        questions: [
          {
            id: "q_3_2_1",
            type: "multiple-choice",
            questionText: "¿Cuáles de los siguientes elementos SÍ se deben depositar en tu compostera de hogar?",
            options: [
              "Cáscaras de frutas/verduras húmedas, restos de yerba mate usada, café molido y restos de hojas secas",
              "Carne vacuna cruda, quesos duros, plásticos biodegradables gruesos y pilas gastadas",
              "Excremento de mascotas domésticas de más de cinco días de guardado",
              "Solo vidrios rotos limpios"
            ],
            correctAnswer: "Cáscaras de frutas/verduras húmedas, restos de yerba mate usada, café molido y restos de hojas secas",
            explanation: "¡Perfecto! Los orgánicos crudos, yerba usada y partes secas vegetales crean una relación carbono/nitrógeno fabulosa, que con ayuda del aire y lombrices se vuelve humus puro.",
            rewardExp: 45
          },
          {
            id: "q_3_2_2",
            type: "true-false",
            questionText: "En el compostaje doméstico, se debe intercalar capas de 'verdes y húmedos' (aporte de Nitrógeno) con capas de 'secos y marrones' (aporte de Carbono) para evitar malos olores y putrefacción.",
            options: [
              "Verdadero",
              "Falso"
            ],
            correctAnswer: "Verdadero",
            explanation: "¡Verdad absoluta! El exceso de humedad causa falta de oxígeno y fermentaciones ácidas con olor feo. Capas secas airean el sistema protegiendo a los microorganismos benéficos.",
            rewardExp: 45
          }
        ]
      }
    ]
  }
];
