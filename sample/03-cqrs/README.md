# 03 - CQRS / Mediator

Samples para validação do módulo CQRS/Mediator do Mvp24Hours.

## Componentes a Validar

### Core Abstractions
- [ ] `IMediator` / `ISender` / `IPublisher`
- [ ] `Mediator` implementation

### Commands
- [ ] `ICommand` / `ICommand<TResponse>`
- [ ] `ICommandHandler<T>`
- [ ] Command Validation

### Queries
- [ ] `IQuery<TResponse>`
- [ ] `IQueryHandler<T, R>`
- [ ] `PaginatedQuery<T>` / `SortedQuery<T>`

### Notifications
- [ ] `INotification` / `INotificationHandler<T>`
- [ ] Multiple Handlers
- [ ] Publishing Strategies

### Pipeline Behaviors
- [ ] `LoggingBehavior`
- [ ] `ValidationBehavior`
- [ ] `TransactionBehavior`
- [ ] `CachingBehavior`
- [ ] `RetryBehavior`
- [ ] `CircuitBreakerBehavior`
- [ ] `IdempotencyBehavior`
- [ ] `AuthorizationBehavior`
- [ ] `AuditBehavior`
- [ ] `TenantBehavior`
- [ ] `TracingBehavior`

### Domain Events
- [ ] `IDomainEvent`
- [ ] `IHasDomainEvents`
- [ ] `DomainEventDispatcher`

### Integration Events
- [ ] `IIntegrationEvent`
- [ ] Inbox/Outbox Pattern

### Event Sourcing
- [ ] `AggregateRoot<T>`
- [ ] `IEventStore`
- [ ] Snapshots
- [ ] Projections

### Saga Pattern
- [ ] `ISaga` / `SagaBase<TState>`
- [ ] Compensation
- [ ] State Store

### Scheduling
- [ ] `ICommandScheduler`
- [ ] Scheduled Commands

### Multi-Tenancy
- [ ] `ITenantContext`
- [ ] `ICurrentUser`
- [ ] Query Filters

## Projetos

| Projeto | Descrição | Status |
|---------|-----------|--------|
| Mvp24Hours.Sample.Cqrs.Basic | Commands, Queries, Notifications | Pendente |
| Mvp24Hours.Sample.Cqrs.Behaviors | Pipeline Behaviors | Pendente |
| Mvp24Hours.Sample.Cqrs.EventSourcing | Event Store, Aggregates | Pendente |
| Mvp24Hours.Sample.Cqrs.Saga | Saga Pattern, Compensation | Pendente |
| Mvp24Hours.Sample.Cqrs.Projections | Projections, Read Models | Pendente |
