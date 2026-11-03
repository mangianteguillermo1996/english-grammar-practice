# English Grammar Practice

App web para practicar gramática en inglés, del nivel **A2+ hacia B1**. Trae
ejercicios que se renuevan solos, explicaciones en español y seguimiento del
progreso. Funciona sin instalar nada, sin cuenta y sin conexión a internet.

## Qué tiene

- **17 temas**: present simple vs continuous, past simple y continuous,
  comparativos, cuantificadores, *going to* / *will*, present perfect (y contra
  past simple), *for* / *since*, condicionales primero y segundo, modales,
  *used to*, relativos, voz pasiva, gerundio vs infinitivo y estilo indirecto.
- **Cuatro tipos de ejercicio**: opción múltiple, completar el espacio, encontrar
  el error y reescribir la oración.
- **Ejercicios que no se agotan**: más de 340 escritos a mano y generadores por
  plantilla que arman ejercicios nuevos en cada sesión.
- **Correcciones que explican**: por qué la respuesta correcta lo es, por qué la
  tuya no y más ejemplos del mismo caso. Si le errás por una letra, te avisa
  "Casi…" y te da otro intento.
- **Pistas**: la primera letra de la respuesta, una opción tachada o la regla
  del tema. Un acierto con pista vuelve a aparecer al día siguiente.
- **Repetición espaciada**: lo que fallás vuelve pronto, y lo que acertás vuelve
  cada vez más espaciado (1, 3, 7, 16 y 35 días).
- **Libreta de errores**: todo lo que fallaste, con la respuesta correcta y la
  explicación. Un error queda superado cuando lo acertás dos veces seguidas.
- **Test de nivel**: 34 preguntas que ordenan la hoja de ruta según lo que ya
  sabés.
- **Hábito**: meta diaria, días de racha, gráfico de los últimos 14 días y
  dominio por tema.
- **Modo claro y oscuro**, según la configuración del sistema.

## Cómo usarla

Descargá o cloná el repo y abrí `index.html` con doble clic. No necesita
servidor ni build.

```bash
git clone https://github.com/mangianteguillermo1996/english-grammar-practice.git
```

Para publicarla en internet sirve cualquier hosting estático, por ejemplo
Netlify (arrastrar la carpeta a [app.netlify.com/drop](https://app.netlify.com/drop))
o GitHub Pages. No hace falta ninguna configuración extra.

## Dónde se guarda el progreso

En el `localStorage` del navegador: no sale de tu dispositivo ni se comparte con
nadie. Por eso cada navegador y cada dispositivo tiene su propio progreso.

Para pasarlo a otro lado o tener un respaldo, usá **Progreso → Exportar
progreso** y después **Importar progreso** en el otro navegador. Si borrás los
datos del navegador sin exportar, el progreso se pierde.

## Estructura

```
index.html        página y orden de carga de los scripts
styles.css        estilos (modo claro y oscuro)
data/topics.js    temas: reglas, estructura, palabras señal, errores típicos y conceptos
data/a2.js        ejercicios escritos a mano de A2
data/b1.js        ejercicios escritos a mano de A2+ / B1
generators.js     plantillas que generan ejercicios nuevos
progress.js       progreso, repetición espaciada, estadísticas y respaldo
app.js            corrección, sesiones, pantallas y navegación
```

Los datos están en archivos `.js` y no en `.json` para que la app funcione
abierta directamente desde el disco (`file://`), donde el navegador no permite
cargar archivos con `fetch`.

## Agregar ejercicios

Cada tema agrega sus ejercicios con `addExercises(tema, [...])` en
`data/a2.js` o `data/b1.js`, con este formato compacto:

```js
["mc",  "She ___ to work every day.", ["goes", "is going", "go"], 0, "Explicación…", "habit", { "is going": "Por qué está mal…" }]
["gap", "I ___ (not / like) coffee.", ["don't like", "do not like"], "Explicación…", "habit"]
["err", ["She", "don't", "like", "coffee."], 1, "doesn't", "Explicación…", "habit"]
["rw",  "Nobody cleans this room.", "This room", ["isn't cleaned", "is not cleaned"], "Explicación…", "present"]
```

- El penúltimo campo (o el último, en `mc`) es el **concepto** del tema que
  explica el caso. Tiene que existir en `concepts` de `data/topics.js`.
- En opción múltiple, cada opción incorrecta lleva su explicación.
- Los ejercicios nuevos van **siempre al final** de la lista del tema. El id de
  cada ejercicio es `tema:posición`: insertar en el medio o reordenar mezclaría
  el historial de repaso de quienes ya practicaron.

Las convenciones de trabajo del repo (ramas, versionado y verificación) están en
[CLAUDE.md](CLAUDE.md).

## Versión

La versión actual está en el archivo [`VERSION`](VERSION).
