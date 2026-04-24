# Crypto Dashboard

Dashboard analítico de criptomonedas en tiempo real. Muestra las 20 principales por capitalización de mercado, permite buscar y filtrar, y visualiza el historial de precios de los últimos 7 días para cualquier activo seleccionado.

## Requisitos

- Node.js >= 18
- npm >= 9

## Instalación

```bash
git clone https://github.com/gonzalofmattia/crypto-dashboard-emergencias.git
cd crypto-dashboard-emergencias
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Scripts disponibles

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run test     # corre los tests con Vitest
```

## Stack y decisiones de arquitectura

**Vite + React + TypeScript** — elegí Vite por sobre Create React App o Next.js porque el proyecto es una SPA pura sin necesidad de SSR, y Vite ofrece un tiempo de arranque y hot reload notablemente más rápido en desarrollo. TypeScript en modo estricto desde el inicio para evitar errores en runtime y tener contratos claros entre componentes.

**TanStack Query** — maneja todo el ciclo de vida de las llamadas a la API: loading, error, caché y refetch automático. Sin esta librería habría que implementar ese estado manualmente con `useEffect` y `useState` en cada componente, lo cual escala mal. El `staleTime` de 30 segundos evita refetches innecesarios cuando el usuario navega entre vistas, y el `refetchInterval` de 60 segundos mantiene los precios actualizados sin saturar la API gratuita de CoinGecko.

**Recharts** — elegida sobre Chart.js o D3 porque está construida sobre componentes React nativos, lo que simplifica la integración con el estado y las props. D3 es más potente pero requiere manipulación directa del DOM, que va en contra del modelo de React.

**Tailwind CSS** — para un proyecto de este tipo donde la velocidad de desarrollo importa, Tailwind permite iterar sobre el diseño sin salir del archivo del componente. El resultado final es CSS minificado y sin clases no utilizadas gracias al tree-shaking que hace Vite en el build.

**Arquitectura de carpetas** — separé la lógica en tres capas: `services/` para las llamadas HTTP puras, `hooks/` para la integración con TanStack Query y el estado derivado, y `components/` para la presentación. Los tipos están centralizados en `types/` para evitar duplicación. Esta separación hace que cada pieza sea testeable de forma independiente y facilita cambiar la fuente de datos sin tocar los componentes.

## Fuente de datos

La app consume la API pública de CoinGecko. El plan gratuito tiene un límite de requests por minuto, por lo que el refetch está configurado en 60 segundos para no saturarlo durante el desarrollo.

Endpoint de mercados:
```
GET https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1
```

Endpoint de historial:
```
GET https://api.coingecko.com/api/v3/coins/{id}/market_chart?vs_currency=usd&days=7
```

## Tests

Los tests están en `src/__tests__/` y cubren:

- `formatPrice.test.ts` — lógica de formateo de precios en USD para valores mayores y menores a 1
- `SearchBar.test.tsx` — renderizado del componente y disparo del evento onChange
- `AssetTable.test.tsx` — estado de carga con skeletons y renderizado de datos reales

```bash
npm run test
```

## Decisiones de UX

- El gráfico se muestra en un panel lateral fijo para no interrumpir el scroll de la tabla.
- Al cargar la app se selecciona automáticamente el primer activo para que el gráfico siempre tenga contenido visible.
- La fila seleccionada se resalta visualmente para dar contexto sobre qué activo se está visualizando en el gráfico.

## Trade-offs

**WebSockets vs polling** — CoinGecko en el plan gratuito no expone WebSockets. Implementé polling con TanStack Query como alternativa viable. En un entorno de producción con acceso a una API que soporte WebSockets, el hook `useAssets` se podría reemplazar por una conexión persistente sin cambiar ningún componente.

**Infinite scroll** — implementado con useInfiniteQuery de TanStack Query. La tabla carga 20 activos por página y solicita la siguiente automáticamente usando IntersectionObserver.

**Rate limiting** — CoinGecko en el plan gratuito tiene un límite estricto de requests por minuto. En producción esto puede causar que el historial de precios tarde en cargar o falle temporalmente. La app maneja estos casos con reintentos automáticos (retry: 2) y muestra estados de carga y error explícitos en el panel del gráfico. La solución definitiva sería usar un plan pago de CoinGecko o cachear las respuestas en un backend propio.

**Tests E2E** — no incluidos por tiempo. El flujo principal a cubrir sería: carga inicial de la tabla → búsqueda por nombre → click en un activo → visualización del gráfico.