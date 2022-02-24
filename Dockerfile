FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS BUILD

WORKDIR /build

COPY . .

RUN dotnet build -c Project -o dist 'Apollo.Web/Apollo.Web.csproj'

RUN apt-get update \
    && apt-get install -y --allow-unauthenticated \
        libc6-dev \
        libgdiplus \
        libx11-dev

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS BUILD

LABEL maintainer="roof.is.on.fire.science@gmail.com"

WORKDIR /app

COPY --from=build /build/dist ./

ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "Apollo.Web.dll"]






