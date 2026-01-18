# ADENDOS DETALHADOS - v1.0.5

## CORRECAO: HTTP Client NAO e projeto separado
Os componentes HTTP fazem parte de Mvp24Hours.Infrastructure
LocalizaÃ§Ã£o: Mvp24Hours.Infrastructure\Http\

---

## NOVA SECAO 5.6 - HTTP Client (dentro de Infrastructure)

| Componente | Sample | Test | Doc | MCP Tool | Observacoes |
|------------|--------|------|-----|----------|-------------|
| TypedHttpClient | [ ] | [ ] | [ ] | [ ] | Base HTTP client tipado |
| ITypedHttpClient | [ ] | [ ] | [ ] | [ ] | Interface |
| HttpClientOptions | [ ] | [ ] | [ ] | [ ] | Opcoes de configuracao |
| HttpClientServiceExtensions | [ ] | [ ] | [ ] | [ ] | Extensions para DI |
| AuthenticationDelegatingHandler | [ ] | [ ] | [ ] | [ ] | Auth handler |
| CircuitBreakerDelegatingHandler | [ ] | [ ] | [ ] | [ ] | Circuit breaker |
| CompressionDelegatingHandler | [ ] | [ ] | [ ] | [ ] | Compressao |
| LoggingDelegatingHandler | [ ] | [ ] | [ ] | [ ] | Logging requests |
| PropagationAuthorizationDelegatingHandler | [ ] | [ ] | [ ] | [ ] | Propaga Authorization |
| PropagationCorrelationIdDelegatingHandler | [ ] | [ ] | [ ] | [ ] | Propaga CorrelationId |
| PropagationHeaderDelegatingHandler | [ ] | [ ] | [ ] | [ ] | Propaga headers |
| RetryDelegatingHandler | [ ] | [ ] | [ ] | [ ] | Retry com Polly |
| TelemetryDelegatingHandler | [ ] | [ ] | [ ] | [ ] | OpenTelemetry |
| TimeoutDelegatingHandler | [ ] | [ ] | [ ] | [ ] | Timeout |
| NativeHttpResilienceExtensions | [ ] | [ ] | [ ] | [ ] | .NET 9 Resilience |

---

## SECAO 5.3 WebAPI - EXPANDIR

### Middlewares (21 itens)
ExceptionMiddleware, ProblemDetailsMiddleware, CorrelationIdMiddleware
RequestLoggingMiddleware, RequestTelemetryMiddleware, CachingMiddleware
CacheControlMiddleware, ETagMiddleware, RateLimitingMiddleware
IdempotencyMiddleware, ApiKeyAuthenticationMiddleware, AntiForgeryMiddleware
ContentNegotiationMiddleware, CorsMiddleware, SecurityHeadersMiddleware
InputSanitizationMiddleware, IpFilteringMiddleware, RequestContextMiddleware
RequestDecompressionMiddleware, RequestSizeLimitMiddleware, RequestTimeoutMiddleware

### Model Binders (6 itens)
DateOnlyModelBinder, DateTimeOffsetModelBinder, EntityIdModelBinder
PagingCriteriaModelBinder, TimeOnlyModelBinder, Mvp24HoursModelBinderProvider

### Idempotency (5 itens)
IIdempotencyKeyGenerator, IIdempotencyStore, DefaultIdempotencyKeyGenerator
CqrsIdempotencyKeyGenerator, DistributedCacheIdempotencyStore

### Rate Limiting (5 itens)
IRateLimitKeyGenerator, IDistributedRateLimiter, DefaultRateLimitKeyGenerator
RedisDistributedRateLimiter, RateLimitPartitionResolver

---

## SECAO 6 RabbitMQ - EXPANDIR

### Saga Pattern (10 itens)
SagaStateMachine, SagaInstance, SagaConsumeContext
InMemorySagaRepository, EFCoreSagaRepository, MongoDbSagaRepository, RedisSagaRepository

### Scheduling (7 itens)
MessageScheduler, ScheduledMessage, CronExpressionHelper
InMemoryScheduledMessageStore, RedisScheduledMessageStore

### Topology (13 itens)
ITopologyBuilder, TopologyBuilder, IMessageTopology, MessageTopology
IEndpointNameFormatter, EndpointNameFormatter
ExchangeBindingHelper, FanoutExchangeHelper, TopicExchangeHelper

### Transactional (9 itens)
ITransactionalBus, TransactionalBus, ITransactionalOutbox
InMemoryTransactionalOutbox, OutboxPublisher

### Testing (7 itens)
TestHarness, TestHarnessBuilder, InMemoryBus
TestConsumeContext, PublishedMessage

### Observability (7 itens)
RabbitMQActivitySource, RabbitMQDiagnostics
IRabbitMQObserver, PrometheusMetrics

### Metrics (3 itens)
IRabbitMQMetrics, RabbitMQMetrics, RabbitMQMetricsSnapshot
