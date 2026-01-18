# 02 - Database

Samples para validação dos módulos de banco de dados do Mvp24Hours.

## Componentes a Validar

### Relational (EF Core)

#### Providers
- [ ] SQL Server
- [ ] PostgreSQL
- [ ] MySQL
- [ ] InMemory (testes)

#### Repository Pattern
- [ ] `IRepository<T>` / `IRepositoryAsync<T>`
- [ ] CRUD Operations
- [ ] Pagination

#### Unit of Work
- [ ] `IUnitOfWork` / `IUnitOfWorkAsync`
- [ ] Transactions

#### Advanced Features
- [ ] Interceptors (Audit, SoftDelete, SlowQuery)
- [ ] Multi-tenancy
- [ ] Bulk Operations
- [ ] Dapper Integration

### NoSQL

#### MongoDB
- [ ] Connection
- [ ] Repository Pattern
- [ ] GridFS
- [ ] Aggregation
- [ ] Change Streams
- [ ] Geospatial

#### Redis
- [ ] Connection
- [ ] String/Hash/List/Set/SortedSet
- [ ] Pub/Sub
- [ ] Distributed Lock

## Connection Strings

```json
{
  "ConnectionStrings": {
    "SqlServer": "Server=localhost,1433;Database=mvp24hours_db;User Id=sa;Password=Mvp24Hours@2026;TrustServerCertificate=true",
    "PostgreSQL": "Host=localhost;Port=5432;Database=mvp24hours_db;Username=mvp24hours;Password=Mvp24Hours@2026",
    "MySQL": "Server=localhost;Port=3306;Database=mvp24hours_db;User=mvp24hours;Password=Mvp24Hours@2026",
    "MongoDB": "mongodb://mvp24hours:Mvp24Hours%402026@localhost:27017",
    "Redis": "localhost:6379,password=Mvp24Hours@2026"
  }
}
```

## Pré-requisitos

```bash
# Subir infraestrutura
cd ../docker
docker-compose up -d sqlserver postgres mysql mongodb redis
```

## Projetos

| Projeto | Provider | Status |
|---------|----------|--------|
| Mvp24Hours.Sample.Database.SqlServer | SQL Server | Pendente |
| Mvp24Hours.Sample.Database.PostgreSQL | PostgreSQL | Pendente |
| Mvp24Hours.Sample.Database.MySQL | MySQL | Pendente |
| Mvp24Hours.Sample.Database.MongoDB | MongoDB | Pendente |
| Mvp24Hours.Sample.Database.Redis | Redis | Pendente |
