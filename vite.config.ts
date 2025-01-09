import {defineConfig} from "vite";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig({
	base: "./",
	server: {
		host: "0.0.0.0",
		port: 5173,
		proxy: {
			'^/api/.*': {
				target: 'http://localhost:3001',
				changeOrigin: true,
				secure: false,
				ws: true,
				configure: (proxy, options) => {
					proxy.on('error', (err, req, res) => {
						console.log('proxy error', err);
					});
					proxy.on('proxyReq', (proxyReq, req, res) => {
						console.log('Sending Request:', req.method, req.url);
					});
					proxy.on('proxyRes', (proxyRes, req, res) => {
						console.log('Received Response:', proxyRes.statusCode, req.url);
					});
				}
			}
		}
	},
	css: {
		postcss: {
			plugins: [
				autoprefixer({
					overrideBrowserslist: [
						"Android 4.1",
						"iOS 7.1",
						"Chrome > 31",
						"ff > 31",
						"ie >= 8",
						"> 1%",
					]
				})
			]
		}
	}
});
