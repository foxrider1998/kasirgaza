# stop
#!/bin/bash

# Stop proses berdasarkan keyword (pastikan cuma kamu yang pakai 'serve' dan 'index.js')
pkill -f "serve -s dist"
pkill -f "src/index.js"



# running dari sini 
cd backend
npm run dev > backend.log 2>&1 &

cd ..

cd frontend
nohup npx serve -s dist -l 55664 > frontend.log 2>&1 &


