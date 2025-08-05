#!/bin/bash

echo "🚀 Starting Smart Mill Service containers..."

# Остановить существующие контейнеры
docker-compose down

# Собрать и запустить контейнеры
docker-compose up --build -d

echo "✅ Containers started successfully!"
echo ""
echo "📊 Services:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend:  http://localhost:4000"
echo "  - Database: localhost:5432"
echo ""
echo "🔗 API Endpoints:"
echo "  - GET    /products     - Получить список товаров"
echo "  - GET    /products/:id - Получить товар по ID"
echo "  - POST   /products     - Создать новый товар"
echo "  - PUT    /products/:id - Обновить товар"
echo "  - DELETE /products/:id - Удалить товар"
echo ""
echo "📝 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down" 