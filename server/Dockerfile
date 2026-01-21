# Base runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app

# Create a non-root user
RUN adduser --disabled-password --home /app appuser && chown -R appuser /app

# Expose port and configure ASP.NET Core
ENV PORT=8080
ENV ASPNETCORE_URLS=http://+:${PORT}

# Optional MongoDB environment variables (override on Render)
ENV MONGODB_URI=""
ENV MONGODB_DB="scrum-board"

EXPOSE 8080

# SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy csproj and restore
COPY ["ScrumBoardBackend.csproj", "."]
RUN dotnet restore "./ScrumBoardBackend.csproj"

# Copy rest of the source and build
COPY . .
RUN dotnet build "./ScrumBoardBackend.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./ScrumBoardBackend.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Run as non-root
USER appuser

# Start application
ENTRYPOINT ["dotnet", "ScrumBoardBackend.dll"]
