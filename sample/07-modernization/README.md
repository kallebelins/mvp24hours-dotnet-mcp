# 07 - Modernization (.NET 9)

Samples para validação das features modernas do .NET 9 integradas ao Mvp24Hours.

## Componentes a Validar

### Caching
- [ ] HybridCache (L1 + L2)
- [ ] Output Caching
- [ ] Stampede Protection

### Resilience
- [ ] HTTP Resilience
- [ ] Generic Resilience
- [ ] Rate Limiting (System.Threading.RateLimiting)
- [ ] Circuit Breaker
- [ ] Retry Policies

### Time Abstractions
- [ ] TimeProvider
- [ ] PeriodicTimer
- [ ] FakeTimeProvider (testes)

### Dependency Injection
- [ ] Keyed Services
- [ ] Options Pattern
- [ ] Options Configuration

### APIs
- [ ] Problem Details
- [ ] Minimal APIs (TypedResults)
- [ ] Native OpenAPI

### Performance
- [ ] Source Generators ([LoggerMessage])
- [ ] JSON Source Generators ([JsonSerializable])
- [ ] AOT Compatibility

### Cloud Native
- [ ] .NET Aspire
- [ ] Service Discovery
- [ ] Telemetry Integration

## Projetos

| Projeto | Descrição | Status |
|---------|-----------|--------|
| Mvp24Hours.Sample.HybridCache | HybridCache com Redis | Pendente |
| Mvp24Hours.Sample.RateLimiting | Rate limiting nativo | Pendente |
| Mvp24Hours.Sample.TimeProvider | TimeProvider e PeriodicTimer | Pendente |
| Mvp24Hours.Sample.Aspire | .NET Aspire integration | Pendente |
