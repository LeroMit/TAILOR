# Spring Boot Minio Example
>**MinIO example with Spring Boot application**

>**For about [MinIO](https://min.io/)**

## Prerequisites

*  Docker
*  Docker Compose

## Installation
>Container creation with [Buildpacks](https://buildpacks.io/) 
```
mvn clean install && docker-compose up -d
```

## Used Dependencies
* Spring Boot Hateoas
* Spring Boot Actuator
* Spring Boot Web
* Sringdoc OpenApi (openapi-ui + openapi-hateoas)
* Jlefebure Minio
* Mapstruct
* Lombok
* Jackson Dataformat Xml

## Abilities
* Content Negotiation Support(Json,Xml,Hal Support)
* MinIO Storage

## Swagger
> **Access : http://localhost:8080/api/documentation/**


## Resource
* https://medium.com/@kaoxyd/minio-and-spring-boot-with-minio-starter-d7efcce5f99a
* https://github.com/jlefebure/spring-boot-starter-minio
* https://docs.min.io/

