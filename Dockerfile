FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app

COPY ./out .

RUN apt-get update \
    && apt-get install -y --allow-unauthenticated \
        libc6-dev \
        libgdiplus \
        libx11-dev

ENTRYPOINT ["dotnet", "Apollo.Web.dll"]