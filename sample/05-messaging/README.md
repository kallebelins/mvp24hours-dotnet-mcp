# 05 - Messaging (RabbitMQ)

Samples para validação do módulo RabbitMQ do Mvp24Hours.

## Componentes a Validar

### Basic Messaging
- [ ] Connection Setup
- [ ] `IMvpRabbitMQClient`
- [ ] Producer
- [ ] Consumer
- [ ] `IMessageConsumer<T>` (Typed)

### Advanced Patterns
- [ ] Dead Letter Queue
- [ ] Retry with Polly
- [ ] Message Scheduling
- [ ] Batch Processing
- [ ] Request/Response (RPC)
- [ ] Saga Pattern (State Machines)
- [ ] Multi-tenancy
- [ ] Transactional Outbox
- [ ] Message Deduplication
- [ ] JSON Serialization
- [ ] MessagePack Serialization
- [ ] OpenTelemetry Tracing
- [ ] Health Checks

## Connection String

```json
{
  "RabbitMQ": {
    "HostName": "localhost",
    "Port": 5672,
    "UserName": "mvp24hours",
    "Password": "Mvp24Hours@2026",
    "VirtualHost": "/"
  }
}
```

## Pré-requisitos

```bash
# Subir RabbitMQ
cd ../docker
docker-compose up -d rabbitmq

# Acessar Management UI
# http://localhost:15672
# User: mvp24hours
# Pass: Mvp24Hours@2026
```

## Projetos

| Projeto | Descrição | Status |
|---------|-----------|--------|
| Mvp24Hours.Sample.RabbitMQ.Basic | Producer/Consumer básico | Pendente |
| Mvp24Hours.Sample.RabbitMQ.Saga | Saga pattern com state machines | Pendente |
| Mvp24Hours.Sample.RabbitMQ.Outbox | Transactional outbox pattern | Pendente |
