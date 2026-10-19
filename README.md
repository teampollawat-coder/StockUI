# Shop (Next.js + C# REST API)

## Run
Backend (http://localhost:5104):

    cd backend && dotnet run --launch-profile http

Frontend (http://localhost:3000):

    cd frontend && npm install && npm run dev

## API
- GET  /api/products      -> [{code,name,price,stock}]
- POST /api/checkout      -> body {items:[{code,quantity}]}; 200 {lines,total} | 409 stock not enough
- POST /api/stock/reset   -> reset mock stock

## DB
EF Core + SQLite (`shop.db`, auto-created and seeded with mock data). Change `ConnectionStrings:Default`
in backend/appsettings.json, or swap `UseSqlite` for `UseSqlServer` in Program.cs to use another DB.
