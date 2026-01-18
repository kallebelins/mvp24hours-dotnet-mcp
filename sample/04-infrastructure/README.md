# 04 - Infrastructure

Samples para validação dos módulos de infraestrutura do Mvp24Hours.

## Componentes a Validar

### Pipeline (Pipe and Filters)
- [ ] `IPipeline` / `IPipelineAsync`
- [ ] `IPipeline<TInput, TOutput>` (Typed)
- [ ] `IOperation`
- [ ] `IPipelineInterceptor`
- [ ] Pipeline Builder
- [ ] Fork/Join
- [ ] Saga Pattern
- [ ] Checkpoint/Resume
- [ ] Rollback

### Caching
- [ ] `IDistributedCache`
- [ ] HybridCache (.NET 9)
- [ ] Memory Cache (L1)
- [ ] Redis Cache (L2)
- [ ] Cache Aside Pattern
- [ ] Cache Invalidation
- [ ] Stampede Protection

### CronJob
- [ ] `IScheduledJob`
- [ ] CRON Expression (Cronos)
- [ ] Job Lifecycle
- [ ] Retry Policy
- [ ] Circuit Breaker
- [ ] Distributed Locking
- [ ] Health Checks
- [ ] OpenTelemetry

### Channels (.NET)
- [ ] `ChannelFactory`
- [ ] `MvpChannel<T>`
- [ ] Producer/Consumer
- [ ] Bounded/Unbounded

## Projetos

| Projeto | Descrição | Status |
|---------|-----------|--------|
| Mvp24Hours.Sample.Pipeline | Pipe and Filters pattern | Pendente |
| Mvp24Hours.Sample.Caching | HybridCache, Redis | Pendente |
| Mvp24Hours.Sample.CronJob | Background jobs | Pendente |
| Mvp24Hours.Sample.Channels | Producer/Consumer | Pendente |
