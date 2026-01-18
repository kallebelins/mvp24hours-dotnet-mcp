# 08 - Observability

Samples para validação do stack de observabilidade do Mvp24Hours.

## Componentes a Validar

### Logging
- [ ] ILogger Integration
- [ ] Structured Logging
- [ ] NLog Configuration
- [ ] Serilog Configuration
- [ ] [LoggerMessage] Source Gen
- [ ] Correlation ID

### Tracing
- [ ] Activity API
- [ ] OpenTelemetry Tracing
- [ ] Distributed Tracing
- [ ] Custom Activities
- [ ] Trace Context Propagation

### Metrics
- [ ] Counter
- [ ] Histogram
- [ ] Gauge
- [ ] Observable Metrics
- [ ] Custom Metrics

### Exporters
- [ ] Console Exporter
- [ ] OTLP Exporter
- [ ] Jaeger Exporter
- [ ] Zipkin Exporter
- [ ] Prometheus Exporter
- [ ] Application Insights

### Health Checks
- [ ] SQL Server Health
- [ ] PostgreSQL Health
- [ ] MongoDB Health
- [ ] Redis Health
- [ ] RabbitMQ Health
- [ ] Custom Health Checks
- [ ] Health UI

## URLs de Acesso

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Jaeger UI | http://localhost:16686 | Distributed tracing |
| Prometheus | http://localhost:9090 | Metrics |
| Grafana | http://localhost:3000 | Dashboards |
| Seq | http://localhost:8081 | Structured logs |

## Pré-requisitos

```bash
# Subir stack de observabilidade
cd ../docker
docker-compose up -d jaeger prometheus grafana seq
```

## Projetos

| Projeto | Descrição | Status |
|---------|-----------|--------|
| Mvp24Hours.Sample.OpenTelemetry | Full observability stack | Pendente |
| Mvp24Hours.Sample.HealthChecks | Health checks completos | Pendente |
