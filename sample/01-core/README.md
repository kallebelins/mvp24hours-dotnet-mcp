# 01 - Core Patterns

Samples para validação dos patterns do módulo Core do Mvp24Hours.

## Componentes a Validar

### Entities
- [ ] `EntityBase<TId>` - Entidade base com ID genérico
- [ ] `EntityBaseLog` - Entidade com campos de auditoria
- [ ] `AuditableEntity` - Created/Modified timestamps
- [ ] `SoftDeletableEntity` - Soft delete com IsDeleted

### Value Objects
- [ ] `BaseVO` - Value Object base
- [ ] `Email` - VO para email com validação
- [ ] `Cpf` - VO para CPF brasileiro
- [ ] `Cnpj` - VO para CNPJ brasileiro
- [ ] `PhoneNumber` - VO para telefone
- [ ] `Money` - VO para valores monetários
- [ ] `Address` - VO para endereço
- [ ] `DateRange` - VO para intervalo de datas
- [ ] `Percentage` - VO para percentuais

### Strongly-Typed IDs
- [ ] `EntityId<T>` - ID fortemente tipado
- [ ] JSON Converters

### Functional Patterns
- [ ] `Maybe<T>` - Option pattern
- [ ] `Either<TLeft, TRight>` - Either monad
- [ ] `BusinessResult<T>` - Result pattern

### Guard Clauses
- [ ] `Guard.Against.Null`
- [ ] `Guard.Against.NullOrEmpty`
- [ ] `Guard.Against.OutOfRange`

### Exceptions
- [ ] `BusinessException`
- [ ] `ValidationException`
- [ ] `NotFoundException`
- [ ] Demais exceptions

### Specifications
- [ ] `Specification<T>`
- [ ] `CompositeSpecifications`

### Infrastructure Abstractions
- [ ] `IClock` / `SystemClock` / `TestClock`
- [ ] `IGuidGenerator` e implementações
- [ ] `IEncryptionProvider`

## Como Executar

```bash
cd Mvp24Hours.Sample.Core.Entities
dotnet build
dotnet test
```

## Projetos

| Projeto | Descrição | Status |
|---------|-----------|--------|
| Mvp24Hours.Sample.Core.Entities | Samples de entidades | Pendente |
| Mvp24Hours.Sample.Core.ValueObjects | Samples de value objects | Pendente |
| Mvp24Hours.Sample.Core.Guards | Samples de guard clauses | Pendente |
| Mvp24Hours.Sample.Core.Specifications | Samples de specifications | Pendente |
| Mvp24Hours.Sample.Core.Functional | Samples de patterns funcionais | Pendente |
