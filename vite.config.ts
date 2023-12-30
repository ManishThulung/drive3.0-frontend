import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react-swc"

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  return {
    plugins: [react()],
    define: {
      // "process.env.PINATA_API_SECRET": JSON.stringify(env.PINATA_API_SECRET),
      // "process.env.PINATA_API_KEY": env.PINATA_API_KEY,
      // If you want to exposes all env variables, which is not recommended
      "process.env": env,
    },
  }
})
