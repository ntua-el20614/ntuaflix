require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 7117;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}!\n🚀 http://localhost:${PORT} 🚀`));