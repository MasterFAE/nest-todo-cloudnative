![todo-app](https://gcdnb.pbrd.co/images/LTGGkUpwsai5.png?o=1)

# Todo App - Backend

A Todo Application designed with Microservice Architecture and Cloud Native technologies.

### Services

- /api

  > An API Gateway. Middle layer between the client and the services. Provides authentication, logging and routing.

- /auth

  > JWT Authentication service. Responsible from user authentication, token validation and user operations.

- /todo

  > Responsible from all operations related with "Todo".

- /canva
  > Responsible from all operations related with "Canva".

![todo-app-flow](https://gcdnb.pbrd.co/images/y6E1MJnzcNYj.png?o=1)

### Use cases

- As a user, I should be able to register a new account
- As a user, I should be able to login to existing account
- As a user, I should be able to create a new canva
- As a user, I should be able to update/delete an existing canva
- As a user, I should be able to create a new todo to an existing canva
- As a user, I should be able to update/delete a todo
- As an admin, I should be able to access health status of services from api/health
- System should be able to build and push images to the dockerhub
- System should be able to automatically deploy new images to kubernetes

### Planned Features:

- Front-end application
- Deployment to a cloud provider
- Jenkins image version update

## Technology Stack:

- NestJS with TypeScript
- Prisma
- PostgreSQL
- gRPC
- Docker
- Microservices
- Kubernetes
- Prometheus
- Grafana
- Jenkins
- ArgoCD

### Environment Variables

```
ENVIRONMENT = ""

DATABASE_URL=""

API_HTTP_PORT = "5000"


AUTH_SERVICE_HOST = "localhost"
AUTH_SERVICE_PORT = "50051"
AUTH_SERVICE_HTTP_PORT = "5001"

TODO_SERVICE_HOST = "localhost"
TODO_SERVICE_PORT = "50052"
TODO_SERVICE_HTTP_PORT = "5002"

CANVA_SERVICE_HOST = "localhost"
CANVA_SERVICE_PORT = "50053"
CANVA_SERVICE_HTTP_PORT = "5003"


JWT_SECRET=''
JWT_EXPIRES_IN=""

PROMETHEUS_METRIC_PATH = "/metrics"
```
