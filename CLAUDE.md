# CLAUDE.md

Guía de trabajo para Claude Code en este repositorio.

## Qué es este proyecto

App para practicar gramática en inglés de nivel A2+ hacia B1 (17 temas). Es un sitio
estático en HTML, CSS y JS vanilla. No tiene build, servidor ni dependencias: se abre
con doble clic en `index.html` (`file://`) y se puede publicar tal cual en Netlify.

- `data/topics.js`: niveles, temas (intro, estructura, palabras señal, errores
  típicos, conceptos) y `addExercises()`.
- `data/a2.js`, `data/b1.js`: ejercicios escritos a mano.
- `data/verbs.js`: verbos regulares e irregulares con sus formas, significado y
  pronunciación aproximada.
- `data/es.js`: traducciones al español (ver más abajo).
- `generators.js`: plantillas que generan ejercicios nuevos para cada tema.
- `progress.js`: progreso en `localStorage`, repetición espaciada, estadísticas,
  test de nivel y exportación/importación.
- `app.js`: corrección, armado de sesiones, vistas y rutas por hash (`#inicio`,
  `#errores`, `#progreso`, `#practica`, `#verbos`, `#regla/<tema>`).

Los datos van en `.js`, no en `.json`, porque desde `file://` el navegador no
permite `fetch`. Los scripts se cargan en orden en `index.html`.

## Reglas que no se pueden romper

- **El progreso guardado del usuario no se pierde.** Vive en `localStorage` bajo la
  clave `grammar-practice-v1`. Un campo nuevo en el progreso se agrega en
  `emptyProgress()`, y `withDefaults()` lo completa en los progresos viejos. No
  cambiar la clave ni el significado de los campos existentes.
- **Los ids de los ejercicios escritos a mano son `tema:posición`.** Los ejercicios
  nuevos se agregan siempre **al final** de la lista de su tema. Nunca se insertan
  en el medio, se reordenan ni se borran: eso cambiaría los ids y mezclaría el
  historial de repaso. Para retirar uno, dejarlo y avisar.
- **Los ejercicios generados codifican sus parámetros en el id** (`g:tema:...`). Si
  se cambia un generador, el mismo id tiene que seguir describiendo el mismo
  ejercicio.
- Todo ejercicio tiene un `concept` que existe en su tema, y toda opción incorrecta
  de opción múltiple tiene su explicación en `wrongWhy`.
- Las explicaciones están en español rioplatense (voseo) y los ejemplos en inglés.

## Formato compacto de ejercicios

```
["mc",  prompt, opciones, índiceCorrecto, explicación, concepto, { opciónIncorrecta: porqué }]
["gap", prompt, respuestas, explicación, concepto]
["err", partes, índiceDelError, corrección, explicación, concepto, oraciónCorregida?]
["rw",  oraciónOriginal, comienzo, respuestas, explicación, concepto]
```

Las claves con apóstrofo van entre comillas (`"didn't": "..."`).

En `err`, la oración corregida completa (con `<b>` en lo que cambia) es opcional: hace
falta cuando reemplazar la parte marcada por la corrección no arma una oración
correcta (por ejemplo, si la corrección tiene alternativas con `/` o cambia más de
una parte).

## Traducciones

`data/es.js` tiene la traducción al español de cada ejemplo de concepto (`c`) y de
cada ejercicio escrito a mano (`ex`, en el mismo orden que los ejercicios del tema).
Todo ejercicio o ejemplo nuevo lleva su traducción en la misma posición; si falta,
la app no la muestra, pero el chequeo de cantidades falla. Los ejercicios generados
no tienen traducción.

## Verificar cambios

No hay tests en el repo. Antes de dar un cambio por terminado:

1. `node --check` sobre cada `.js` modificado.
2. Cargar los scripts en Node con un DOM simulado (`vm`) y validar: conceptos
   existentes, `wrongWhy` completos, un solo `___` por prompt, al menos 20
   ejercicios por tema y una muestra de cada generador.
3. Abrir `index.html` en el navegador y recorrer la pantalla tocada, en ancho de
   escritorio y de celular, y en modo claro y oscuro.

## Flujo de Git — obligatorio

1. Arrancar siempre desde `develop` actualizado (`git checkout develop && git pull`
   si hay remoto configurado).
2. Crear una rama nueva para cada tarea, sin excepción (ni siquiera para cambios
   chicos o de contenido). Nunca commitear directo en `develop` o `master`.
   - Convención de nombres: `feature/*`, `fix/*`, `content/*` (ejercicios y
     explicaciones), `docs/*`, `chore/*`.
3. Desarrollar y commitear en esa rama.
4. Mergear la rama a `develop` para probar que todo esté ok.
5. Si está ok en `develop`, mergear `develop` a `master` y subir (`push`).

## Regla crítica: nunca mergear ni pushear sin confirmación

Antes de cualquier merge (a `develop` o a `master`) y antes de cualquier `git push`,
**preguntar al usuario y esperar confirmación explícita**. No hacerlo de forma
automática bajo ninguna circunstancia, aunque los pasos anteriores del flujo hayan
sido aprobados. Lo mismo vale para publicar en Netlify.

## Ramas de Git

| Rama | Uso |
|---|---|
| `master` | Versión estable — solo merges desde `develop`. Es la que se publica. |
| `develop` | Integración — base para nuevas ramas |
| `feature/*`, `fix/*`, `content/*`, `docs/*`, `chore/*` | Ramas de trabajo por tarea |

## Versionado

El número de versión vive en el archivo `VERSION` (raíz del proyecto, texto plano,
ej. `1.0.0`) y se sube a Git.

Criterio de versión (semver):
- **PATCH** (`1.0.x`): bugs, ajustes de UI, correcciones de ejercicios o explicaciones.
- **MINOR** (`1.x.0`): funcionalidades nuevas, temas o tandas de ejercicios nuevos.
- **MAJOR** (`x.0.0`): cambios en el formato del progreso guardado que requieran
  migración, o cualquier cosa que rompa la compatibilidad con progresos exportados.

Antes de mergear `develop` → `master` para un release, editar `VERSION` con el
número nuevo y commitear ese cambio (`git commit -m "Release vX.Y.Z"`) antes de
hacer el merge. Sigue siendo obligatorio pedir confirmación antes del merge/push.
