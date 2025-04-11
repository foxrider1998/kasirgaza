# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

3. 🧪 Jalankan di Lokal (Cek Berjalan)
A. Start backend:
bash
Salin
Edit
npm run dev
B. Jalankan frontend (kalau terpisah):
bash
Salin
Edit
cd frontend
npm run dev
4. 🔒 Setting Produksi & Build
A. Ganti .env untuk production (misal IP VPS):
ini
Salin
Edit
DATABASE_URL="mysql://username:password@127.0.0.1:3306/posapp"
VITE_API_BASE_URL="http://123.123.123.123:3000/api"
PORT=3000
B. Build Project:
bash
Salin
Edit
npm run build
Kalau pakai Vite, hasilnya ada di folder dist/.

5. 📦 Serve Hasil Build di Server
A. Install serve (kalau pakai frontend):
bash
Salin
Edit
npm install -g serve
serve -s dist
Bisa juga pakai Nginx atau PM2 kalau backendnya Express.

B. Kalau pakai PM2 (untuk Node.js/Express):
bash
Salin
Edit
npm install pm2 -g
pm2 start server.js --name posapp
pm2 startup
pm2 save
6. 🌐 Akses dari Luar
A. Pastikan firewall/server VPS mengizinkan port 3000:
bash
Salin
Edit
sudo ufw allow 3000
B. Akses via IP:
cpp
Salin
Edit
http://123.123.123.123:3000



npm install -g serve
npm install -g pm2

