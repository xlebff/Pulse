FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["Pulse.Api/Pulse.Api.csproj", "Pulse.Api/"]
RUN dotnet restore "Pulse.Api/Pulse.Api.csproj"

COPY . .
WORKDIR /src/Pulse.Api
RUN dotnet publish "Pulse.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:5000 \
    DOTNET_RUNNING_IN_CONTAINER=true \
    DOTNET_EnableDiagnostics=0

EXPOSE 5000
ENTRYPOINT ["dotnet", "Pulse.Api.dll"]