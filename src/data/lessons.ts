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
            questionText: "Ordena estos alimentos de MENOR a MAYOR contenido calórico, priorizando alimentos frescos saludables de volumen:",
            options: [
              "Lechuga Criolla",
              "Manzana Manzana",
              "Palta Cremosa",
              "Yerba Mate Seca"
            ],
            correctAnswer: ["Lechuga Criolla", "Manzana Manzana", "Palta Cremosa", "Yerba Mate Seca"],
            explanation: "¡Excelente! La lechuga está compuesta por más de 95% de agua, la manzana provee fructosa y fibra, la palta grasas saludables calóricas, y el mate procesado seco al disolverse es concentrado.",
            rewardExp: 20
          },
          {
            id: "q_1_1_5",
            type: "multiple-choice",
            questionText: "Según las investigaciones científicas de María Lucía Baraquet (Córdoba), ¿qué importante efecto benéfico tiene el incremento del consumo diario de frutas frente a enfermedades cardiometabólicas?",
            options: [
              "Actúa como un factor protector clave frente a la hipertensión arterial, reduciendo los marcadores de estrés oxidativo e inflamación celular",
              "Te vuelve completamente inmune a cualquier virus respiratorio de forma instantánea",
              "Sustituye completamente la necesidad de consumir agua potable durante el día",
              "Permite metabolizar carbohidratos simples sin que el cuerpo aumente su porcentaje de grasa en absoluto"
            ],
            correctAnswer: "Actúa como un factor protector clave frente a la hipertensión arterial, reduciendo los marcadores de estrés oxidativo e inflamación celular",
            explanation: "¡Excelente! Baraquet demostró científicamente que el consumo frecuente de compuestos fitoquímicos de frutas ayuda a combatir la hipertensión y reduce el estrés oxidativo patogénico celular.",
            rewardExp: 25
          },
          {
            id: "q_1_1_6",
            type: "multiple-choice",
            questionText: "De acuerdo con los estudios de frecuencia de consumo alimentario del CONICET en Córdoba, ¿cuáles son las frutas y hortalizas más consumidas respectivamente por la población?",
            options: [
              "Frutas: mandarina, naranja y banana. Verduras: tomate, papa y calabaza.",
              "Frutas: mango, arándano y guayaba. Verduras: espárrago, alcaucil y brotes de soja.",
              "Frutas: pera, sandía y durazno. Verduras: acelga, remolacha y lechuga.",
              "Frutas: manzana, ciruela y pomelo. Verduras: verdeo, cebolla y morrón."
            ],
            correctAnswer: "Frutas: mandarina, naranja y banana. Verduras: tomate, papa y calabaza.",
            explanation: "¡Exacto! El estudio preliminar reveló que estas frutas y vegetales tradicionales encabezan el consumo diario. Sumarles mayor variedad aporta más micro-nutrientes saludables.",
            rewardExp: 25
          },
          {
            id: "q_1_1_7",
            type: "multiple-choice",
            questionText: "Josefina Wohlfeiler (INTA, Mendoza) estudia el fitomejoramiento genético de la zanahoria. ¿Qué relevancia tiene este vegetal para la salud humana según sus estudios?",
            options: [
              "Se considera un alimento funcional por excelencia que aporta más del 80% de la Vitamina A (como betacarotenos) a la dieta humana",
              "Aporta grasas vegetales poliinsaturadas esenciales que regulan el colesterol",
              "Sustituye de forma idónea a las proteínas completas de origen animal",
              "Contiene altos niveles de clorofila libre que oxigena directamente la hemoglobina"
            ],
            correctAnswer: "Se considera un alimento funcional por excelencia que aporta más del 80% de la Vitamina A (como betacarotenos) a la dieta humana",
            explanation: "¡Muy bien! Los betacarotenos de la zanahoria no solo le dan su hermoso color, sino que son fundamentales para la vista, la salud celular y la regeneración epitelial.",
            rewardExp: 25
          }
        ]
      },
      {
        id: "l1_2",
        title: "Nutrición Inteligente",
        description: "Descubre cómo simplificar tus comidas, conservar frescos tus ingredientes y reducir desperdicios.",
        xpReward: 100,
        questions: [
          {
            id: "q_1_2_1",
            type: "multiple-choice",
            questionText: "¿Qué se recomienda hacer con las sobras de comidas en el hogar para evitar el desperdicio?",
            options: [
              "Guardarlas en recipientes herméticos dentro de la heladera o freezer para consumirlas o reutilizarlas en otras recetas",
              "Desecharlas de inmediato para que no atraigan malos olores",
              "Dejarlas a temperatura ambiente toda la noche destapadas",
              "Solo se pueden usar para hacer compostaje directo"
            ],
            correctAnswer: "Guardarlas en recipientes herméticos dentro de la heladera o freezer para consumirlas o reutilizarlas en otras recetas",
            explanation: "¡Totalmente! Guardar y congelar porciones es clave. Con las de La Verdu puedes crear tortillas sabias o croquetas nutritivas en minutos.",
            rewardExp: 25
          },
          {
            id: "q_1_2_2",
            type: "true-false",
            questionText: "La humectación controlada (como colocar lechugas bien secas en recipientes plásticos cerrados) permite conservarlas frescas por hasta 20 días en tu heladera.",
            options: [
              "Verdadero",
              "Falso"
            ],
            correctAnswer: "Verdadero",
            explanation: "¡Verdad! En La Verdu promovemos escurrir bien las hojas verdes y guardarlas con papel absorbente para mantener la turgencia y evitar putrefacciones tempranas.",
            rewardExp: 25
          },
          {
            id: "q_1_2_3",
            type: "multiple-choice",
            questionText: "¿Cómo se debe almacenar adecuadamente la papa, el boniato y las cebollas?",
            options: [
              "Fuera de la heladera, en un lugar aireado, seco y oscuro; y siempre separados, ya que las cebollas aceleran el brotado de las papas",
              "Juntos en bolsas plásticas cerradas herméticamente en el estante superior del refrigerador",
              "Totalmente sumergidos en agua fría dentro de la heladera",
              "Expuestos a la luz directa del sol junto al balcón para maduración"
            ],
            correctAnswer: "Fuera de la heladera, en un lugar aireado, seco y oscuro; y siempre separados, ya que las cebollas aceleran el brotado de las papas",
            explanation: "¡Súper correcto! Conservar las papas y cebollas en recipientes separados previene que el gas etileno de la cebolla estropee tus papas y boniatos de temporada.",
            rewardExp: 25
          },
          {
            id: "q_1_2_4",
            type: "multiple-choice",
            questionText: "El doctor Ariel Vicente (LIPA, CONICET) busca optimizar el manejo poscosecha. ¿Por qué es estratégico este estudio para reducir las pérdidas globales?",
            options: [
              "Porque se estima que cerca de un tercio de la producción alimentaria global se pierde en la cadena; regular temperatura y humedad lo evita",
              "Porque ayuda a mutar genéticamente las hortalizas para que no necesiten agua dulce",
              "Porque elimina la necesidad de refrigeración utilizando únicamente conservantes químicos",
              "Porque incrementa artificialmente el dulzor inyectando azúcares sintéticos en las aduanas"
            ],
            correctAnswer: "Porque se estima que el agua que se utiliza para producir alimentos que luego se descartan sería suficiente para satisfacer a dos mil millones de personas",
            explanation: "¡Increíble dato! Controlar la temperatura y humedad poscosecha reduce drásticamente las pérdidas, cuidando el agua, suelo y trabajo invertidos en el cultivo.",
            rewardExp: 25
          },
          {
            id: "q_1_2_5",
            type: "multiple-choice",
            questionText: "El snack de calabaza desarrollado por investigadores de la UBA-CONICET (Marina de Escalada Pla) está fortificado de forma inteligente. ¿Con qué está enriquecido y qué combate?",
            options: [
              "Hierro y bacterias probióticas; combate la prevalencia de la anemia a nivel de salud pública",
              "Vitamina D y cafeína concentrada; combate el desvelo escolar",
              "Fósforo y proteínas de pescado sintéticas; combate la debilidad muscular",
              "Biorremediadores microscópicos; combate el exceso de azúcar en legumbres convencionales"
            ],
            correctAnswer: "Hierro y bacterias probióticas; combate la prevalencia de la anemia a nivel de salud pública",
            explanation: "¡Exactamente! Marina de Escalada Pla diseñó este alimento funcional que aporta cerca de un tercio de las necesidades diarias de hierro y probióticos estables en una matriz vegetal deliciosa.",
            rewardExp: 30
          },
          {
            id: "q_1_2_6",
            type: "multiple-choice",
            questionText: "El libro de cocina saludable destaca que las hojas de verduras habitualmente descartadas son muy ricas. ¿Cómo se prepara el sabroso pesto de hojas de ZANAHORIA?",
            options: [
              "Picando hojas verdes limpias de zanahoria, ajo, maní tostado sin sal, sal, aceite y unas gotas de limón",
              "Procesando raíces de zanahoria ralladas, manteca, coco rallado y queso de rallar",
              "Herviendo cáscaras de zanahoria junto a avena, vinagre y manzana verde",
              "Extrayendo flores secas de zanahoria para emulsionarlas con yogur natural descremado"
            ],
            correctAnswer: "Picando hojas verdes limpias de zanahoria, ajo, maní tostado sin sal, sal, aceite y unas gotas de limón",
            explanation: "¡Súper gourmet! Las hojas de zanahoria tienen abundante potasio, calcio y fibra. Reutilizarlas en un pesto con maní combate el desperdicio con sabor inigualable.",
            rewardExp: 25
          },
          {
            id: "q_1_2_7",
            type: "multiple-choice",
            questionText: "La receta de postre saludable Budín de Cacao y Remolacha de 'Sabores Andantes' logra una textura exquisita. ¿Cómo se incorpora la remolacha?",
            options: [
              "Se hierven y pelan las remolachas, se licúan con aceite y luego se incorporan a la mezcla tradicional de huevos, harina, azúcar y cacao",
              "Se rallan las remolachas crudas con cáscara directamente sobre el molde enharinado",
              "Se pican remolachas asadas y se mezclan con chocolate amargo derretido únicamente",
              "Se extrae el jugo filtrado de la remolacha cruda y se mezcla con crema de manteca y avena"
            ],
            correctAnswer: "Se hierven y pelan las remolachas, se licúan con aceite y luego se incorporan a la mezcla tradicional de huevos, harina, azúcar y cacao",
            explanation: "¡Así es! Integrar puré de remolacha licuada con aceite aporta humedad natural y un dulzor mineral fantástico, permitiendo disminuir el uso de azúcares y grasas malas.",
            rewardExp: 25
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Yerba Mate Piporé y Miel",
    description: "Explora la energía natural de la yerba de tradición argentina y el poder sanador de la miel pura y arropes.",
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
          },
          {
            id: "q_2_1_4",
            type: "multiple-choice",
            questionText: "Piporé es una marca emblemática con raíces profundas. ¿Cuál es el significado del nombre 'Piporé' según la tradición guaraní y su cooperativa?",
            options: [
              "Significa 'Huellas de Manos y Pies' (Pi: pie, Po: mano, Ré: huellas) en honor a la leyenda del cacique protegido por los jesuitas",
              "Significa 'Yerba fuerte de hojas verdes', que describe su color noble",
              "Significa 'Tradición Santo Pipó', acuñado por los fundadores suizos en 1933",
              "Significa 'Bebida de la mañana', en idioma nativo del litoral"
            ],
            correctAnswer: "Significa 'Huellas de Manos y Pies' (Pi: pie, Po: mano, Ré: huellas) en honor a la leyenda del cacique protegido por los jesuitas",
            explanation: "¡Extraordinario! La leyenda cuenta que el cacique huyó de peligros dejando sus huellas grabadas de forma milagrosa e imborrable en las piedras de un arroyo.",
            rewardExp: 25
          },
          {
            id: "q_2_1_5",
            type: "multiple-choice",
            questionText: "¿En qué año se fundó la cooperativa madre de Piporé en el pueblo San Ignacio/Santo Pipó, Misiones, por parte de intrépidos colonos suizos?",
            options: [
              "Comenzó a gestarse en 1930 (formalizada en 1933), uniendo a familias pioneras suizas en agricultura familiar",
              "Fue fundada en 1970 durante el boom industrial del Mercosur",
              "Fue creada en 1910 tras un acuerdo con el Virreinato del Río de la Plata",
              "Nació en 1985 con la mecanización robótica de las cintas de sapecado"
            ],
            correctAnswer: "Comenzó a gestarse en 1930 (formalizada en 1933), uniendo a familias pioneras suizas en agricultura familiar",
            explanation: "¡Súper correcto! Esos colonos suizos establecieron las bases de la cooperativa agrícola Piporé en Santo Pipó, un baluarte nacional de herencia y esfuerzo cooperativo.",
            rewardExp: 25
          },
          {
            id: "q_2_1_6",
            type: "multiple-choice",
            questionText: "De acuerdo con el blog oficial de Piporé, ¿cómo se adapta la molienda de yerba mate especialmente para cebar un buen TERERÉ refrescante?",
            options: [
              "Se elabora una molienda de bajo contenido de polvo y hojas con corte mucho más grueso para tolerar agua helada sin tapar la bombilla",
              "Se procesa una yerba fina e impalpable para disolución ultra-veloz en jugo de limón artificial",
              "Se le adiciona edulcorantes concentrados de estevia líquida directamente en el empaque",
              "Se tuesta la hoja hasta que se pulverice para ser usada libre de ramas"
            ],
            correctAnswer: "Se elabora una molienda de bajo contenido de polvo y hojas con corte mucho más grueso para tolerar agua helada sin tapar la bombilla",
            explanation: "¡Correcto! Una molienda gruesa con pocas partículas de polvo fino permite el flujo constante de jugos o agua helada, conservando la frescura en climas calurosos.",
            rewardExp: 25
          },
          {
            id: "q_2_1_7",
            type: "multiple-choice",
            questionText: "¿Por qué el estacionamiento natural de 12 a 18 meses que realiza Piporé es considerado superior para el bienestar estomacal comparado con procesos acelerados?",
            options: [
              "Porque descompone los taninos fuertes y la clorofila de forma lenta, dándole aroma noble y evitando la indeseada acidez estomacal",
              "Porque permite que la yerba mate adquiera un intenso aroma artificial a madera quemada",
              "Porque deshidrata completamente todas las fibras insolubles para facilitar la digestión en el colon",
              "Porque eleva los niveles de sodio para conservar el sabor en botes metálicos durante más tiempo"
            ],
            correctAnswer: "Porque descompone los taninos fuertes y la clorofila de forma lenta, dándole aroma noble y evitando la indeseada acidez estomacal",
            explanation: "¡Buenísimo! El estacionamiento tradicional natural madura la yerba respetuosamente con el tiempo, asegurando mates aromáticos, amigables con el estómago de la vecindad.",
            rewardExp: 25
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
            explanation: "¡Asombroso! No te asustes si tu miel se endurece. Ese proceso de cristalización es la mayor garantía de que no contiene aditivos ni jarabe de maíz de alta fructosa artificial.",
            rewardExp: 25
          },
          {
            id: "q_2_2_2",
            type: "true-false",
            questionText: "La miel cruda tiene valiosos nutrientes que mueren si la calientas a más de 45°C, por lo que es mejor endulzar tus infusiones templadas, no hirviendo.",
            options: [
              "Verdadero",
              "Falso"
            ],
            correctAnswer: "Verdadero",
            explanation: "¡Correcto! Los tratamientos de calor destructivos y la pasteurización industrial degradan las enzimas digestivas florales, los fitocompuestos y la inhibina.",
            rewardExp: 25
          },
          {
            id: "q_2_2_3",
            type: "multiple-choice",
            questionText: "Irene Lantos (CONICET) estudia el patrimonio alimentario andino. ¿Qué endulzante nativo tradicional elaboraban las poblaciones de Catamarca a partir de frutos silvestres de monte?",
            options: [
              "Arrope de Chañar, un jarabe denso, dulce y digestivo que además se usa socialmente para aliviar la tos y suavizar la garganta",
              "Stevia natural deshidratada y pulverizada con piedras de moler prehispánicas",
              "Miel de abejas reinas africanas criadas en corrales de barro",
              "Jarabe concentrado de raíces de cactus fermentadas bajo tierra"
            ],
            correctAnswer: "Arrope de Chañar, un jarabe denso, dulce y digestivo que además se usa socialmente para aliviar la tos y suavizar la garganta",
            explanation: "¡Estupendo! Los frutos silvestres de chañar y algarroba eran recolectados en el 'salka' (ámbito silvestre) andino, aportando azúcares, minerales y asombrosas propiedades terapéuticas.",
            rewardExp: 30
          },
          {
            id: "q_2_2_4",
            type: "multiple-choice",
            questionText: "De acuerdo a la receta tradicional recopilada en Saujil (Catamarca), ¿cómo se elabora el tradicional Arrope de Chañar?",
            options: [
              "Se lavan los frutos de chañar, se hierven por 4 horas para ablandarlos, se estrujan para separar la pulpa de cáscaras, se cuelan y se reducen a fuego lento hasta punto de hilo",
              "Se maceran las hojas de chañar en jugo de uva helado por 30 días, y se filtra con embudo metálico",
              "Se tuestan las semillas secas del árbol en hornos caseros, se muelen y se amasan con azúcar rubia hasta endurecer",
              "Se hierven únicamente las ramas frescas del arbusto con vinagre y miel pura por 15 minutos en ollas de barro"
            ],
            correctAnswer: "Se lavan los frutos de chañar, se hierven por 4 horas para ablandarlos, se estrujan para separar la pulpa de cáscaras, se cuelan y se reducen a fuego lento hasta punto de hilo",
            explanation: "¡Súper correcto! Es un saber ancestral que se transmite de generación en generación. No lleva ningún colorante ni azúcar artificial, es 100% natural, espeso y aromático.",
            rewardExp: 25
          },
          {
            id: "q_2_2_5",
            type: "multiple-choice",
            questionText: "¿Qué compuesto enzímico o propiedad otorga a la miel y arropes puros de abejas su potente efecto antibacteriano natural?",
            options: [
              "La inhibina, que al combinarse con agua produce bajas concentraciones de peróxido de hidrógeno antiséptico",
              "La caseína vegetal segregada de las flores de algarrobo silvestre",
              "La presencia artificial de alcohol etílico generado en los panales",
              "La alta concentración de almidones refinados insolubles que deshidratan bacterias"
            ],
            correctAnswer: "La inhibina, que al combinarse con agua produce bajas concentraciones de peróxido de hidrógeno antiséptico",
            explanation: "¡Es correcto! Gracias al aporte de las abejas y a la inhibina, la miel pura es un ungüento milenario ideal para calmar estados irritativos orofaríngeos de forma sana.",
            rewardExp: 25
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
          },
          {
            id: "q_3_1_4",
            type: "multiple-choice",
            questionText: "El doctor Juan Carlos Díaz Ricci (CONICET - Tucumán) desarrolló una tecnología basada en la proteína 'AsES'. ¿Qué logran con su aplicación en cultivos de frutilla?",
            options: [
              "Activan las defensas inmunes naturales de la propia planta (pared celular y antimicrobianos), haciéndola tolerante a hongos patógenos sin agroquímicos tóxicos",
              "Triplican el tamaño de las frutillas convirtiéndolas en frutos gigantescos de laboratorio",
              "Eliminan la necesidad de regarlas, permitiendo cosechar en suelos secos y áridos",
              "Le otorgan un tinte azulado sintético que asusta a los insectos depredadores"
            ],
            correctAnswer: "Activan las defensas inmunes naturales de la propia planta (pared celular y antimicrobianos), haciéndola tolerante a hongos patógenos sin agroquímicos tóxicos",
            explanation: "¡Espléndido! La biotecnología moderna de CONICET enseña a 'despertar' las defensas de la planta de frutilla, obteniendo cultivos orgánicos y sumamente limpios para la mesa familiar.",
            rewardExp: 25
          },
          {
            id: "q_3_1_5",
            type: "multiple-choice",
            questionText: "Según las investigaciones de Paula Filippone (Tucumán), ¿qué son los 'Bioinsumos' en la agricultura urbana y cuáles son sus tres tipos principales?",
            options: [
              "Son productos desarrollados a partir de bacterias, hongos o extractos vegetales; se clasifican en Biofertilizantes, Bioestimulantes y Biopesticidas",
              "Unidades electrónicas microscópicas instaladas en la tierra para sensor de humedad",
              "Abonos químicos sintéticos de disolución rápida con altos niveles de nitrógeno inorgánico",
              "Semillas modificadas térmicamente en laboratorios estériles para crecer sin sol"
            ],
            correctAnswer: "Son productos desarrollados a partir de bacterias, hongos o extractos vegetales; se clasifican en Biofertilizantes, Bioestimulantes y Biopesticidas",
            explanation: "¡Espectacular! Estos bioinsumos respetan la fauna del suelo, estimulan el vigor de las hojas y raíces y protegen los ecosistemas de aguas y polinizadores.",
            rewardExp: 25
          },
          {
            id: "q_3_1_6",
            type: "multiple-choice",
            questionText: "En los 'Circuitos Cortos de Comercialización' que investiga Lisandro Fernández (UNLP) para fomentar la agricultura sostenible y familiar, ¿cuál es el gran beneficio?",
            options: [
              "Eliminar o reducir los intermediarios en la cadena, permitiendo que la vecindad adquiera productos más frescos, baratos y brindando un trato equitativo y humano al productor",
              "Establecer aduanas municipales que impongan impuestos fijos a los cultivos de estación",
              "Facilitar la exportación exclusiva de hortalizas a mercados de Medio Oriente y Europa",
              "Centralizar todo en almacenes hiper-industriales con conservación en refrigeradores por meses"
            ],
            correctAnswer: "Eliminar o reducir los intermediarios en la cadena, permitiendo que la vecindad adquiera productos más frescos, baratos y brindando un trato equitativo y humano al productor",
            explanation: "¡Exacto! El comercio de cercanía de La Verdu beneficia a las familias del cordón hortícola local, asegura la sustentabilidad y reduce el empaque innecesario.",
            rewardExp: 25
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
            questionText: "La investigadora Débora Manuale (INCAPE-CONICET) investiga la economía circular de desechos. ¿Qué compuestos valiosos se extraen hoy de los descartes de zanahorias y papas?",
            options: [
              "Carotenos (antioxidantes y colorantes naturales de alto valor comercial), fibras dietarias y azúcares para fermentar bioetanol",
              "Proteínas animales sintéticas de asimilación rápida para deportistas",
              "Compuestos desinfectantes basados en lavandina industrial concentrada",
              "Plásticos rígidos de alta densidad para fabricar contenedores domésticos"
            ],
            correctAnswer: "Carotenos (antioxidantes y colorantes naturales de alto valor comercial), fibras dietarias y azúcares para fermentar bioetanol",
            explanation: "¡Genial! Los residuos vegetales son ricos en compuestos bioactivos. En lugar de pudrirse en basurales, la ciencia recupera estos colorantes naturales que usualmente importamos.",
            rewardExp: 25
          },
          {
            id: "q_3_2_2",
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
            id: "q_3_2_3",
            type: "true-false",
            questionText: "En el compostaje doméstico, se debe intercalar capas de 'verdes y húmedos' (aporte de Nitrógeno) con capas de 'secos y marrones' (aporte de Carbono) para evitar malos olores y putrefacción.",
            options: [
              "Verdadero",
              "Falso"
            ],
            correctAnswer: "Verdadero",
            explanation: "¡Verdad absoluta! El exceso de humedad causa falta de oxígeno y fermentaciones ácidas con olor feo. Capas secas airean el sistema protegiendo a los microorganismos benéficos.",
            rewardExp: 45
          },
          {
            id: "q_3_2_4",
            type: "multiple-choice",
            questionText: "Para alimentar orgánicamente tus plantas en macetas, la receta del fertilizante natural de cáscara de BANANA de La Verdu enseña:",
            options: [
              "Hervir 5 cáscaras de banana en 1.5 litros de agua por 15 minutos, colar y diluir en agua limpia al regar para aportar potasio en floración",
              "Licuar las cáscaras de banana crudas con cal común y espolvorear sobre las hojas enfermas del jardín",
              "Sumergir las cáscaras en vinagre concentrado por 3 semanas y regar los brotes recién nacidos de acelgas",
              "Moler cáscaras secas al sol mezcladas con harina integral para rellenar los surcos"
            ],
            correctAnswer: "Hervir 5 cáscaras de banana in 1.5 litros de agua por 15 minutos, colar y diluir en agua limpia del regar para aportar potasio en floración",
            explanation: "¡Maravilloso! El agua resultante del hervor concentra el potasio presente en la cáscara de banana, dándole una energía biológica increíble a las flores y frutos de tus hortalizas.",
            rewardExp: 25
          },
          {
            id: "q_3_2_5",
            type: "multiple-choice",
            questionText: "Puedes fabricar un limpiador multiuso desengrasante cítrico sin tóxicos a partir de descartes del exprimidor. ¿Cómo se elabora según la receta zero waste?",
            options: [
              "Fermentando cáscaras cítricas en agua en una botella tapada por 30 días, ventilando el gas cada 3 días y colando el líquido final",
              "Herviendo limón y pomelo en lavandina concentrada a baño María por 3 minutos",
              "Mezclando cítricos crudos licuados con jabón en polvo comercial para frotar las hornallas",
              "Tostando cáscaras de mandarina en horno fuerte hasta carbonizarlas por completo"
            ],
            correctAnswer: "Fermentando cáscaras cítricas en agua en una botella tapada por 30 días, ventilando el gas cada 3 días y colando el líquido final",
            explanation: "¡Estupenda sabiduría ecológica! La fermentación cítrica genera un extracto ácido sumamente desengrasante con exquisito aroma que cuida tu piel y vajilla de forma natural.",
            rewardExp: 25
          }
        ]
      }
    ]
  }
];
