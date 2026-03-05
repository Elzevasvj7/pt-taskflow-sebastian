# Todo List

Aplicación de gestión de tareas construida con **Next.js 16**, **React 19** y **TypeScript**. Consume la API pública [dummyjson.com/todos](https://dummyjson.com/docs/todos) para operaciones CRUD y aplica dos patrones: **Reducer Pattern** (`useReducer`) para gestión de estado y **Post-respuesta** para la sincronización con la API.

## Stack Técnico

| Capa          | Tecnología                                   |
| ------------- | -------------------------------------------- |
| Framework     | Next.js 16 (App Router)                      |
| UI            | React 19, Tailwind CSS 4                     |
| Estado        | `useReducer` (hook personalizado `useTodos`) |
| API           | Server Actions → dummyjson REST API          |
| Tests         | Jest 30, Testing Library                     |
| Calidad       | ESLint, Prettier                             |
| UI Components | Radix UI (Alert Dialog), Sonner (toasts)     |

## Arquitectura

```
app/
  page.tsx                   ← Server Component (punto de entrada)
components/
  todo/
    TodoContainer.tsx        ← Orquestador: conecta hook con componentes
    TodoForm.tsx             ← Formulario de creación
    TodoList.tsx             ← Lista de tareas
    TodoItem.tsx             ← Tarea individual (toggle, edit, delete)
    TodoFilterBar.tsx        ← Filtros: todas / pendientes / completadas
    TodoSearch.tsx           ← Búsqueda por texto
    TodoStatsBar.tsx         ← Barra de estadísticas
hooks/
  useTodos.ts               ← Hook con useReducer (estado + acciones)
lib/
  actions/todo.actions.ts   ← Server Actions (fetch a la API externa)
  selectors/todo.selectors.ts ← Funciones puras de filtrado/búsqueda/stats
  types/todo.ts             ← Tipos e interfaces
```

### Flujo de datos

```
[Server Action] → fetch API dummyjson
        ↓
   [useTodos hook] → dispatch(action) → todoReducer → nuevo estado
        ↓
   [Selectors] → searchTodos → filterTodos → getTodoStats
        ↓
   [TodoContainer] → props → Componentes de presentación
```

---

## Decisiones de Arquitectura

### `useReducer` en lugar de `useState`

El estado del hook `useTodos` tiene 8 campos interdependientes (`todos`, `filter`, `searchQuery`, `isLoading`, `error`, `total`, `limit`, `skip`). Varias operaciones necesitan actualizar múltiples campos de forma atómica en una sola transición — por ejemplo, cargar todos actualiza 6 campos a la vez.

`useReducer` se eligió sobre `useState` porque:

- **Transiciones atómicas**: un `dispatch` actualiza todos los campos necesarios en un solo paso, sin riesgo de estado inconsistente entre renders.
- **Centralización**: todo cambio de estado pasa por `todoReducer`. El type `TodoAction` documenta todas las transiciones posibles y TypeScript las verifica.
- **`dispatch` estable**: mantiene la misma referencia entre renders, lo que simplifica `useCallback` y evita re-renders en componentes hijos.
- **Testabilidad**: el reducer es una función pura `(state, action) → newState`, testeable sin montar componentes.

Con `useState` (ya sea múltiples states o un solo objeto), se pierde la centralización de transiciones y la verificación de tipos discriminados.

### Post-respuesta en lugar de Optimistic Update

La app usa un patrón **post-respuesta**: cada acción (crear, editar, toggle, eliminar) **espera la respuesta del servidor antes de hacer `dispatch`** al reducer. Es decir, la UI solo se actualiza _después_ de confirmar el resultado con la API.

```
Post-respuesta:           await servidor → dispatch → UI se actualiza
Optimistic Update:        dispatch → UI se actualiza → await servidor → rollback si falla
```

Se eligió post-respuesta porque:

- **La API es mock y rápida**. No hay latencia perceptible que justifique feedback instantáneo.
- **No hay estado remoto real**. dummyjson no persiste cambios, así que no tiene sentido implementar rollback contra un servidor que no guarda nada.
- **Menor complejidad**. No requiere merge optimista ni lógica de rollback; un simple `try/catch` es suficiente.

### Fallback local ante 404

dummyjson devuelve siempre `id: 255` para task creados, por lo que la app genera IDs locales con `Date.now()`. Operaciones sobre esos IDs devuelven 404 del servidor. El hook detecta esto y aplica el cambio directamente en el estado local:

```ts
try {
  const updated = await toggleTodo(id); // servidor primero
  dispatch({ type: "UPDATE_TODO", payload: updated });
} catch (err) {
  if (isNotFoundError(err)) {
    dispatch({ type: "TOGGLE_TODO", payload: id }); // fallback local
    return;
  }
  toast.error(/* ... */);
}
```

Esto permite que los todos creados en la sesión funcionen correctamente a pesar de las limitaciones de la API mock.

---

## Scripts disponibles

| Comando           | Descripción                                                |
| ----------------- | ---------------------------------------------------------- |
| `pnpm dev`        | Inicia el servidor de desarrollo                           |
| `pnpm build`      | Genera el build de producción                              |
| `pnpm start`      | Sirve el build de producción                               |
| `pnpm lint`       | Ejecuta ESLint                                             |
| `pnpm format`     | Formatea el código con Prettier                            |
| `pnpm test`       | Ejecuta las pruebas unitarias con Jest                     |
| `pnpm test:watch` | Ejecuta Jest en modo watch (re-ejecuta al guardar cambios) |

## Tests

Las pruebas se ubican en `__tests__/` siguiendo la misma estructura del proyecto:

```
__tests__/
  components/
    TodoFilterBar.test.tsx
    TodoForm.test.tsx
    TodoList.test.tsx
  lib/
    actions/
      todo.actions.test.ts
    services/
      todo.service.test.ts
```

Para ejecutar todas las pruebas:

```bash
pnpm test
```

Para modo watch (útil durante desarrollo):

```bash
pnpm test:watch
```

---

## Getting Started

```bash
# Instalar dependencias
pnpm install

# Servidor de desarrollo
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Variables de entorno

| Variable  | Default                 | Descripción                 |
| --------- | ----------------------- | --------------------------- |
| `API_URL` | `http://localhost:3001` | URL base de la API de todos |

Para usar dummyjson directamente, crear `.env.local`:

```env
API_URL=https://dummyjson.com
```

## Scripts

| Script            | Descripción                   |
| ----------------- | ----------------------------- |
| `pnpm dev`        | Servidor de desarrollo        |
| `pnpm build`      | Build de producción           |
| `pnpm start`      | Servidor de producción        |
| `pnpm lint`       | Ejecutar ESLint               |
| `pnpm format`     | Formatear código con Prettier |
| `pnpm test`       | Ejecutar tests                |
| `pnpm test:watch` | Tests en modo watch           |

## Testing

```bash
pnpm test
```

Los tests cubren:

- **Componentes** (`__tests__/components/`): renderizado, interacciones de usuario, estados de carga y error.
- **Server Actions** (`__tests__/lib/actions/`): llamadas a la API, manejo de errores HTTP.
- **Services** (`__tests__/lib/services/`): lógica de negocio.

## Estructura de Componentes

- **`TodoContainer`**: Componente orquestador. Conecta `useTodos` con los componentes de presentación. Maneja la paginación vía query params de la URL (`?page=1&pageSize=10`).
- **`TodoForm`**: Formulario controlado para crear tareas. Valida que el texto no esté vacío.
- **`TodoList`**: Renderiza la lista de tareas filtradas. Muestra skeleton en estado de carga y mensaje cuando no hay resultados.
- **`TodoItem`**: Tarea individual con acciones: toggle completado, editar (inline) y eliminar (con confirmación via AlertDialog).
- **`TodoFilterBar`**: Grupo de botones para filtrar por estado (todas/pendientes/completadas).
- **`TodoSearch`**: Input de búsqueda que filtra tareas por texto en tiempo real.
- **`TodoStatsBar`**: Muestra estadísticas calculadas: total, pendientes, completadas y porcentaje de avance.

## Deploy

La forma más sencilla de deployar es con [Vercel](https://vercel.com/new):

```bash
pnpm build
```

Consultar la [documentación oficial de deploy de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para más opciones.
