# ⏰ ENTREGABLE 5: CRONOGRAMA DE PENDIENTES
## Timeline de Desarrollo - Mercado Campesino Digital

---

## 📋 RESUMEN EJECUTIVO

Este documento presenta el cronograma de mejoras y funcionalidades pendientes para llevar el MVP al siguiente nivel. Las tareas están organizadas por **fase**, **prioridad** y **estimación de esfuerzo**.

---

## 🎯 FASES DE DESARROLLO

### FASE 1: MVP (✅ COMPLETADA - ACTUAL)
**Estado**: Listo para pruebas de usuarios
**Duración**: Completada
**Funcionalidades**: 25+ características básicas funcionales

---

## 📅 FASE 2: MEJORAS INMEDIATAS (Semana 1-2)

### 🔴 PRIORIDAD ALTA - CRÍTICO (Hacer AHORA)

#### 1. Carrito de Compras
- **Descripción**: Permitir múltiples productos antes de enviar pedido
- **Esfuerzo**: 16 horas
- **Inicio**: Semana 1
- **Fin estimado**: Semana 1.5
- **Tareas**:
  - [ ] Crear componente Cart
  - [ ] Agregar cartStore (Zustand)
  - [ ] Funciones add/remove/update
  - [ ] Persintencia en localStorage
  - [ ] Resumen de carrito
  - [ ] Envío de múltiples items a WhatsApp
  - [ ] Testing

**Estimación**: 16 horas

---

#### 2. Sistema de Notificaciones
- **Descripción**: Alertas visuales para acciones importantes
- **Esfuerzo**: 8 horas
- **Inicio**: Semana 1
- **Fin estimado**: Semana 1.3
- **Tareas**:
  - [ ] Crear NotificationContext
  - [ ] Componente Toast mejorado
  - [ ] Sonidos opcionales
  - [ ] Histórico de notificaciones
  - [ ] Mensajes específicos por acción
  
**Estimación**: 8 horas

---

#### 3. Historial de Pedidos
- **Descripción**: Guardar y mostrar pedidos anteriores
- **Esfuerzo**: 12 horas
- **Inicio**: Semana 1
- **Fin estimado**: Semana 2
- **Tareas**:
  - [ ] Crear tabla orders en BD
  - [ ] Guardar pedido después de enviar
  - [ ] Página de historial
  - [ ] Filtros por fecha/estado
  - [ ] Repetir pedido anterior
  - [ ] Testing

**Estimación**: 12 horas

---

#### 4. Validación de Permisos
- **Descripción**: Mejorar control de acceso
- **Esfuerzo**: 6 horas
- **Inicio**: Semana 1
- **Fin estimado**: Semana 1.2
- **Tareas**:
  - [ ] Middleware de autenticación
  - [ ] Verificación de rol en rutas
  - [ ] Mensajes de acceso denegado
  - [ ] Redirect automático

**Estimación**: 6 horas

---

### 🟠 PRIORIDAD MEDIA (Hacer en Semana 2-3)

#### 5. Mejorar Búsqueda
- **Descripción**: Búsqueda avanzada con más filtros
- **Esfuerzo**: 10 horas
- **Inicio**: Semana 2
- **Fin estimado**: Semana 2.5
- **Tareas**:
  - [ ] Búsqueda por rango de precio
  - [ ] Búsqueda por productor
  - [ ] Filtros múltiples simultáneos
  - [ ] Ordenamiento (precio, fecha, popularidad)
  - [ ] Guardado de búsquedas favoritas
  - [ ] Sugerencias autocomplete

**Estimación**: 10 horas

---

#### 6. Edición de Cantidad en Catálogo
- **Descripción**: Poder modificar cantidad antes de enviar
- **Esfuerzo**: 6 horas
- **Inicio**: Semana 2
- **Fin estimado**: Semana 2.2
- **Tareas**:
  - [ ] Spinner +/- en catálogo
  - [ ] Límite máximo (cantidad disponible)
  - [ ] Total actualizado en tiempo real
  - [ ] Validación

**Estimación**: 6 horas

---

#### 7. Validación de Email
- **Descripción**: Envío de correo de confirmación
- **Esfuerzo**: 8 horas
- **Inicio**: Semana 2
- **Fin estimado**: Semana 2.3
- **Tareas**:
  - [ ] Configurar Supabase emails
  - [ ] Template HTML para confirmación
  - [ ] Verificación de email antes de usar
  - [ ] Reenvío de correo
  - [ ] Link con expiración

**Estimación**: 8 horas

---

#### 8. Dashboard de Productor Mejorado
- **Descripción**: Estadísticas e información útil
- **Esfuerzo**: 12 horas
- **Inicio**: Semana 2
- **Fin estimado**: Semana 3
- **Tareas**:
  - [ ] Total de productos
  - [ ] Total en stock
  - [ ] Valor total del inventario
  - [ ] Gráfico de productos por categoría
  - [ ] Últimos productos creados
  - [ ] Acciones rápidas

**Estimación**: 12 horas

---

---

## 📅 FASE 3: CARACTERÍSTICAS SECUNDARIAS (Semana 3-4)

### 🟡 PRIORIDAD MEDIA-BAJA

#### 9. Sistema de Calificaciones
- **Descripción**: Reseñas de usuarios sobre productos
- **Esfuerzo**: 14 horas
- **Inicio**: Semana 3
- **Fin estimado**: Semana 3.5
- **Tareas**:
  - [ ] Crear tabla reviews
  - [ ] Componente de rating (stars)
  - [ ] Formulario de reseña
  - [ ] Mostrar promedio de calificación
  - [ ] Listado de reseñas
  - [ ] Validación: comprador debe tener pedido

**Estimación**: 14 horas

---

#### 10. Chat Integrado
- **Descripción**: Mensajería entre productor y consumidor
- **Esfuerzo**: 20 horas
- **Inicio**: Semana 3
- **Fin estimado**: Semana 4
- **Tareas**:
  - [ ] Crear tabla messages
  - [ ] Componente chat
  - [ ] Conexión Socket.io
  - [ ] Notificación de mensajes nuevos
  - [ ] Historial de conversación
  - [ ] Typing indicator
  - [ ] Multimedia (imágenes)

**Estimación**: 20 horas

---

#### 11. Geolocalización Básica
- **Descripción**: Mostrar ubicación del productor
- **Esfuerzo**: 10 horas
- **Inicio**: Semana 3
- **Fin estimado**: Semana 3.5
- **Tareas**:
  - [ ] Agregar campos lat/lng a users
  - [ ] Mapa en perfil del productor
  - [ ] Distancia aproximada
  - [ ] Filtrar por ubicación
  - [ ] Google Maps integration

**Estimación**: 10 horas

---

#### 12. Favoritos
- **Descripción**: Guardar productos favoritos
- **Esfuerzo**: 6 horas
- **Inicio**: Semana 3
- **Fin estimado**: Semana 3.2
- **Tareas**:
  - [ ] Crear tabla favorites
  - [ ] Botón corazón en productos
  - [ ] Página de favoritos
  - [ ] Persistencia en BD
  - [ ] Badge de cantidad

**Estimación**: 6 horas

---

---

## 📅 FASE 4: SISTEMA DE PAGOS (Semana 4-6)

### 🔴 PRIORIDAD ALTA - IMPORTANTE

#### 13. Integración de Pagos
- **Descripción**: Pagos en línea (Stripe, PayPal)
- **Esfuerzo**: 24 horas
- **Inicio**: Semana 4
- **Fin estimado**: Semana 5
- **Tareas**:
  - [ ] Configurar cuenta Stripe
  - [ ] Componente de pago
  - [ ] Webhook para confirmación
  - [ ] Guardado de tarjetas
  - [ ] Facturación automática
  - [ ] Testing de pagos
  - [ ] Manejo de errores

**Estimación**: 24 horas

---

#### 14. Estados de Pedido
- **Descripción**: Tracking del pedido en tiempo real
- **Esfuerzo**: 10 horas
- **Inicio**: Semana 4
- **Fin estimado**: Semana 4.5
- **Tareas**:
  - [ ] Estados: pending, confirmed, preparing, shipped, delivered
  - [ ] Actualización de estado por productor
  - [ ] Notificación al consumidor
  - [ ] Historial de cambios
  - [ ] Timeline visual

**Estimación**: 10 horas

---

#### 15. Facturación
- **Descripción**: Generar facturas PDF
- **Esfuerzo**: 12 horas
- **Inicio**: Semana 5
- **Fin estimado**: Semana 5.5
- **Tareas**:
  - [ ] Template de factura
  - [ ] Generación de PDF
  - [ ] Email con factura
  - [ ] Historial de facturas
  - [ ] Descarga desde plataforma
  - [ ] Cumplimiento fiscal

**Estimación**: 12 horas

---

---

## 📅 FASE 5: PRODUCCIÓN (Semana 6-8)

### 🔴 PRIORIDAD CRÍTICA

#### 16. Despliegue a Producción
- **Descripción**: Llevar app a servidor público
- **Esfuerzo**: 8 horas
- **Inicio**: Semana 6
- **Fin estimado**: Semana 6.3
- **Tareas**:
  - [ ] Elegir host (Vercel, Netlify, AWS)
  - [ ] Configurar dominio
  - [ ] Certificado SSL
  - [ ] Variables de entorno
  - [ ] CD/CI pipeline
  - [ ] Backups automáticos
  - [ ] Monitoring

**Estimación**: 8 horas

---

#### 17. Optimización de Performance
- **Descripción**: Hacer app más rápida
- **Esfuerzo**: 16 horas
- **Inicio**: Semana 6
- **Fin estimado**: Semana 7
- **Tareas**:
  - [ ] Análisis con Lighthouse
  - [ ] Compresión de imágenes
  - [ ] Code splitting
  - [ ] Lazy loading
  - [ ] Minificación
  - [ ] Cache strategy
  - [ ] CDN para assets
  - [ ] Database indexes

**Estimación**: 16 horas

---

#### 18. Seguridad
- **Descripción**: Hardening de la aplicación
- **Esfuerzo**: 12 horas
- **Inicio**: Semana 6
- **Fin estimado**: Semana 6.5
- **Tareas**:
  - [ ] HTTPS everywhere
  - [ ] CORS configuration
  - [ ] Rate limiting
  - [ ] Input validation
  - [ ] SQL injection prevention
  - [ ] XSS prevention
  - [ ] CSRF tokens
  - [ ] Security headers

**Estimación**: 12 horas

---

#### 19. Testing
- **Descripción**: Suite de pruebas automatizadas
- **Esfuerzo**: 20 horas
- **Inicio**: Semana 7
- **Fin estimado**: Semana 7.5
- **Tareas**:
  - [ ] Unit tests (Services)
  - [ ] Component tests
  - [ ] Integration tests
  - [ ] E2E tests (Cypress)
  - [ ] Coverage > 80%
  - [ ] CI/CD integración

**Estimación**: 20 horas

---

#### 20. Documentación
- **Descripción**: Documentación técnica completa
- **Esfuerzo**: 12 horas
- **Inicio**: Semana 7
- **Fin estimado**: Semana 8
- **Tareas**:
  - [ ] README completo
  - [ ] API documentation
  - [ ] Guía de instalación
  - [ ] Guía de contribución
  - [ ] Troubleshooting
  - [ ] Video tutoriales
  - [ ] Wiki/Docs

**Estimación**: 12 horas

---

---

## 📅 FASE 6: ESCALA Y EXPANSIÓN (Mes 2+)

### 🟠 PRIORIDAD MEDIA

#### 21. Aplicación Móvil
- **Descripción**: App nativa iOS/Android
- **Esfuerzo**: 80+ horas
- **Opciones**:
  - React Native (compartir código)
  - Flutter (mejor performance)
  - PWA (más rápido)
- **Timeline**: Mes 2-3

---

#### 22. Multi-idioma
- **Descripción**: Soporte para múltiples idiomas
- **Esfuerzo**: 16 horas
- **Idiomas**: Español, Inglés, Português
- **Tools**: i18n
- **Timeline**: Mes 2

---

#### 23. Integración Múltiples Ciudades
- **Descripción**: Expandir a diferentes regiones
- **Esfuerzo**: 24 horas
- **Tareas**:
  - [ ] Selección de ciudad
  - [ ] Datos específicos por ciudad
  - [ ] Admin por ciudad
  - [ ] Reportes por ciudad
- **Timeline**: Mes 2

---

#### 24. Sistema de Suscripción
- **Descripción**: Planes premium para productores
- **Esfuerzo**: 20 horas
- **Planes**:
  - Básico (gratuito)
  - Pro ($5/mes)
  - Premium ($15/mes)
- **Beneficios**:
  - Más productos
  - Analytics avanzado
  - Sin anuncios
  - Prioridad en búsqueda
- **Timeline**: Mes 2-3

---

#### 25. Análisis y Reportes
- **Descripción**: Dashboard de analytics
- **Esfuerzo**: 20 horas
- **Métricas**:
  - Productos vendidos
  - Ingresos
  - Clientes nuevos
  - Tendencias
  - Gráficos y reportes
- **Tools**: Chart.js, Recharts
- **Timeline**: Mes 2

---

---

## 📊 RESUMEN DE CRONOGRAMA

| Fase | Semanas | Horas | Estado |
|------|---------|-------|--------|
| **1. MVP** | 0 | 0 | ✅ Completa |
| **2. Mejoras** | 1-3 | 78 | ⏳ Próxima |
| **3. Características** | 3-4 | 50 | ⏳ Próxima |
| **4. Pagos** | 4-6 | 46 | ⏳ Futura |
| **5. Producción** | 6-8 | 68 | ⏳ Futura |
| **6. Expansión** | Mes 2+ | 160+ | ⏳ Futura |
| **TOTAL** | 8+ semanas | 402+ horas | 📅 En desarrollo |

---

## 🎯 RECOMENDACIONES

### INMEDIATO (Esta semana)
1. ✅ Carrito de compras
2. ✅ Notificaciones
3. ✅ Historial de pedidos
4. ✅ Validación de permisos

**Esfuerzo**: 42 horas (1 semana con 2-3 desarrolladores)

---

### CORTO PLAZO (Próximas 2 semanas)
1. ✅ Búsqueda mejorada
2. ✅ Edición de cantidad
3. ✅ Validación de email
4. ✅ Dashboard mejorado

**Esfuerzo**: 38 horas (1 semana con 2 desarrolladores)

---

### MEDIANO PLAZO (Mes 1)
1. ✅ Calificaciones
2. ✅ Chat integrado
3. ✅ Geolocalización
4. ✅ Favoritos

**Esfuerzo**: 50 horas (2.5 semanas)

---

### LARGO PLAZO (Mes 2)
1. ✅ Integración de pagos
2. ✅ Estados de pedido
3. ✅ Facturación
4. ✅ Despliegue producción
5. ✅ Optimizaciones

**Esfuerzo**: 126 horas (6-8 semanas)

---

## 💰 ESTIMACIÓN DE RECURSOS

### Equipo Recomendado (Fase 2)
- 1 Full-stack Developer
- 1 Frontend Developer (opcional)
- 1 QA Tester

**Costo Estimado**: Variable según ubicación

---

### Infraestructura
- Supabase (BaaS): $25/mes+
- Hosting (Vercel): $20/mes
- Dominio: $12/año
- Email (SendGrid): $20/mes+

**Costo Mensual**: ~$77-100

---

## ⚠️ RIESGOS Y MITIGACIÓN

| Riesgo | Impacto | Mitigación |
|--------|---------|-----------|
| Retrasos en BD | Alto | Usar query builders |
| Escalabilidad | Alto | Índices, caché |
| Seguridad | Crítico | Auditoría regular |
| Experiencia Usuario | Medio | Testing temprano |
| Rendimiento | Medio | Monitoring |

---

## ✅ CHECKLIST DE DEFINICIÓN DE HECHO

Para cada tarea:
- [ ] Código escrito y funcionando
- [ ] Tests pasando
- [ ] Code review aprobado
- [ ] Documentación actualizada
- [ ] Desplegado a staging
- [ ] Testeado en producción (si aplica)
- [ ] Monitoreado 24h sin issues

---

## 📞 CONTACTO PARA CONSULTAS

Cualquier cambio o actualización del cronograma debe ser coordinada con el team lead.

---

**Cronograma versión**: 1.0
**Última actualización**: Junio 2026
**Revisión recomendada**: Cada 2 semanas
