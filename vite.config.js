import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { exec } from 'child_process'

// In-memory launch log to debounce duplicate pings
const lastLaunchTimes = {};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-app-launcher',
      configureServer(server) {
        server.middlewares.use('/api/launch-app', (req, res) => {
          try {
            const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
            const app = reqUrl.searchParams.get('app');
            
            // Debounce check: block pings within 3 seconds
            const now = Date.now();
            if (lastLaunchTimes[app] && (now - lastLaunchTimes[app] < 3000)) {
              console.log(`[ArVerse OS Middleware] Debounced duplicate launch request for: ${app}`);
              res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
              res.end(JSON.stringify({ status: 'success', message: 'Request debounced.' }));
              return;
            }
            lastLaunchTimes[app] = now;

            console.log(`[ArVerse OS Middleware] Request received to launch: ${app}`);
            let command = '';
            let options = {};

            if (app === 'arkon') {
              command = `Launch-ArKon.cmd`;
              options.cwd = `C:\\Users\\aryan\\OneDrive\\Desktop\\Antigravity Projects\\ArKon-Personal-AI\\ArKon-Personal-AI`;
            } else if (app === 'arlip') {
              command = `run_arlip.bat`;
              options.cwd = `C:\\Users\\aryan\\OneDrive\\Desktop\\Antigravity Projects\\ArLip`;
            } else if (app === 'arft') {
              command = `launcher.bat`;
              options.cwd = `C:\\Users\\aryan\\OneDrive\\Desktop\\Antigravity Projects\\ArFt`;
            } else if (app === 'arch') {
              const q = reqUrl.searchParams.get('q') || '';
              command = q ? `run_arch.bat "${q}"` : `run_arch.bat`;
              options.cwd = `C:\\Users\\aryan\\OneDrive\\Desktop\\Antigravity Projects\\ArCh`;
            }


            if (command) {
              console.log(`[ArVerse OS Middleware] Executing: ${command} in ${options.cwd}`);
              exec(command, options, (error) => {
                if (error) {
                  console.error(`[ArVerse OS Middleware] Exec error for ${app}:`, error);
                }
              });
              res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              });
              res.end(JSON.stringify({ status: 'success', message: `${app} launched.` }));
            } else {
              res.writeHead(400, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              });
              res.end(JSON.stringify({ status: 'error', message: 'Invalid app query.' }));
            }
          } catch (err) {
            console.error('[ArVerse OS Middleware] Server crashed:', err);
            res.writeHead(500, { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ status: 'error', message: err.message }));
          }
        });
      }
    }
  ],
  server: {
    port: 3000
  }
})
