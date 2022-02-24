# apollo/Apollo



## Getting Started

Download links:

SSH clone URL: ssh://git@git.jetbrains.space/sm/apollo/Apollo.git

HTTPS clone URL: https://git.jetbrains.space/sm/apollo/Apollo.git


These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## How build

### Local
Build backend
```
cd Apollo.Web
dotnet build --configuration Project
dotnet run
```
Build frontend
```
cd Apollo.Web/Client
yarn install
yarn watch
```

### Docker
Infrastructure
```
docker-compose -d Configurations/docker-compose.infrastructure.local.yaml up
```

Services
```
docker-compose -d docker-compose.apollo.services.local.yml up
```

## Deployment

Add additional notes about how to deploy this on a production system.

## Resources

Add links to external resources for this project, such as CI server, bug tracker, etc.
