FROM mcr.microsoft.com/dotnet/sdk:5.0 AS BUILD

WORKDIR /build

COPY . .

RUN dotnet build -c Project -o dist 'Apollo.Web/Apollo.Web.csproj'

RUN apt-get update \
    && apt-get install -y --allow-unauthenticated \
        libc6-dev \
        libgdiplus \
        libx11-dev

#WORKDIR /build/Apollo.Web/Client
#
#RUN yarn install
#CMD yarn watch
#
#WORKDIR /build

#FROM node:12-buster
#
#WORKDIR /build/Apollo.Web/Client
#
#COPY . .

#RUN apt-get update \
#    && apt-get install -y --allow-unauthenticated \

#RUN npm install --global yarn
#
#RUN yarn install
#CMD ["yarn", "watch"]
#
#WORKDIR /build

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS BUILD

LABEL maintainer="roof.is.on.fire.science@gmail.com"

WORKDIR /app

COPY . .

ENV ASPNETCORE_URLS=http://+:7501
EXPOSE 7501

ENTRYPOINT ["dotnet", "Apollo.Web.dll"]






