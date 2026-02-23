import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  server: {
    cors: true, // Cho phép iframe từ domain khác (quan trọng cho Mini App)
    host: true, // Expose server ra mạng LAN để test trên điện thoại
    port: 5175,
  },
  plugins: [vue()],
  base: "./",
});
