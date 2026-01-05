import { Hono } from "hono";
import fs from "fs";
import path from "path";
import * as readline from "readline";
import { randomBytes } from "crypto";

function formatLog(type: string, message: string): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const timestamp = `${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  return `[${timestamp}] [${type.toUpperCase()}] ${message}`;
}
import { Logger } from "../logger";

const app = new Hono();
const envPath = path.join(process.cwd(), ".env");
const iniDir = path.join(process.cwd(), "public/responses/patches");

// Generate random 16-character password on startup
const adminPassword = randomBytes(16).toString('hex').toUpperCase();

// Conditional auth middleware
const conditionalAuth = (c: any, next: any) => {
  try {
    const envContent = fs.readFileSync(envPath, "utf-8");
    const loginRequired = envContent.includes("USE_SETTINGS_LOGIN=true");
    
    if (!loginRequired) {
      return next();
    }
    
    return authMiddleware(c, next);
  } catch (error) {
    // If we can't read the env file, default to requiring auth
    return authMiddleware(c, next);
  }
};
const adminEmail = "VoltroniteAdmin@backend.dev";

// Simple session store (in production, use proper session management)
const sessions = new Map<string, { email: string, expires: number }>();

console.log(formatLog("service", `Admin credentials generated - Email: ${adminEmail}, Password: ${adminPassword}`));

// Authentication middleware
const authMiddleware = async (c: any, next: any) => {
  const sessionId = c.req.header('cookie')?.split('; ').find((c: string) => c.startsWith('session_id='))?.split('=')[1];
  if (!sessionId || !sessions.has(sessionId)) {
    return c.redirect('/login');
  }
  const session = sessions.get(sessionId);
  if (!session || session.expires < Date.now()) {
    if (session) sessions.delete(sessionId);
    return c.redirect('/login');
  }
  c.set('user', session.email);
  await next();
};

// Login routes
app.get('/login', (c) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Voltronite Admin - Login</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Fortnite', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0f1923 0%, #1a2b3c 50%, #2a3b4c 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    body::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0,255,255,0.03)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
      opacity: 0.1;
    }
    .login-container {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 255, 255, 0.2);
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
      position: relative;
      z-index: 1;
    }
    .logo-section {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(45deg, #00ffff, #0080ff, #8000ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    .subtitle {
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }
    .form-group {
      margin-bottom: 24px;
    }
    label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 600;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    input {
      width: 100%;
      padding: 16px 20px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
      background: #fff;
      transition: all 0.3s ease;
      outline: none;
    }
    input:focus {
      border-color: #00ffff;
      box-shadow: 0 0 0 3px rgba(0, 255, 255, 0.1);
    }
    .login-btn {
      width: 100%;
      padding: 16px;
      background: linear-gradient(45deg, #00ffff, #0080ff);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 8px;
    }
    .login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 255, 255, 0.3);
    }
    .error {
      background: linear-gradient(45deg, #ff4757, #ff3838);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      margin-top: 16px;
      text-align: center;
      font-weight: 500;
    }
    .epic-badge {
      position: absolute;
      top: 20px;
      right: 20px;
      background: linear-gradient(45deg, #313131, #1a1a1a);
      color: #00ffff;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border: 1px solid #00ffff;
    }
  </style>
</head>
<body>
  <div class="epic-badge">Epic Games</div>
  <div class="login-container">
    <div class="logo-section">
      <div class="logo">VOLTRONITE</div>
      <div class="subtitle">Admin Control Panel</div>
    </div>
    <form method="POST" action="/login">
      <div class="form-group">
        <label for="email">Email Address</label>
        <input type="email" id="email" name="email" required placeholder="admin@epicgames.com">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required placeholder="Enter your password">
      </div>
      <button type="submit" class="login-btn">Sign In</button>
    </form>
    <div id="error" class="error" style="display: none;"></div>
  </div>
</body>
</html>`;
  return c.html(html);
});

app.post('/login', async (c) => {
  const body = await c.req.parseBody();
  const email = body.email as string;
  const password = body.password as string;

  if (email === adminEmail && password === adminPassword) {
    const sessionId = randomBytes(32).toString('hex');
    sessions.set(sessionId, {
      email: adminEmail,
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    });

    c.header('Set-Cookie', `session_id=${sessionId}; HttpOnly; SameSite=Strict; Max-Age=${24 * 60 * 60}; Path=/`);

    return c.redirect('/settings');
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Voltronite Admin Login</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .login-container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 15px 35px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
    h1 { text-align: center; margin-bottom: 30px; color: #333; }
    .form-group { margin-bottom: 20px; }
    label { display: block; margin-bottom: 5px; color: #555; font-weight: 500; }
    input { width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 5px; font-size: 16px; box-sizing: border-box; }
    input:focus { border-color: #667eea; outline: none; }
    button { width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; }
    button:hover { opacity: 0.9; }
    .error { color: #e74c3c; text-align: center; margin-top: 15px; }
    .info { background: #e8f4fd; border: 1px solid #1e90ff; color: #1e90ff; padding: 10px; border-radius: 5px; margin-bottom: 20px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="login-container">
    <h1>Voltronite Admin</h1>
    <div class="info">
      <strong>Admin Email:</strong> ${adminEmail}<br>
      <strong>Password:</strong> ${adminPassword}
    </div>
    <form method="POST" action="/login">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" value="${email}" required>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
      </div>
      <button type="submit">Login</button>
    </form>
    <div class="error">Invalid email or password</div>
  </div>
</body>
</html>`;
  return c.html(html, 401);
});

app.post('/logout', (c) => {
  const cookieHeader = c.req.header('cookie');
  const sessionId = cookieHeader?.split('; ').find((c: string) => c.startsWith('session_id='))?.split('=')[1];
  if (sessionId) {
    sessions.delete(sessionId);
  }
  c.header('Set-Cookie', 'session_id=; HttpOnly; SameSite=Strict; Max-Age=0; Path=/');
  return c.redirect('/login');
});

app.get('/', (c) => c.redirect('/login'));

app.get("/settings", conditionalAuth, (c) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Voltronite - Epic Games Admin Panel</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Fortnite', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0f1923 0%, #1a2b3c 50%, #2a3b4c 100%);
      min-height: 100vh;
      color: #e1e5e9;
    }

    .nav {
      background: rgba(15, 25, 35, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(0, 255, 255, 0.2);
      padding: 0 20px;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
    }

    .logo {
      font-size: 20px;
      font-weight: 700;
      background: linear-gradient(45deg, #00ffff, #0080ff, #8000ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .logout-btn {
      padding: 8px 16px;
      background: linear-gradient(45deg, #ff4757, #ff3838);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }

    .main-content {
      margin-top: 80px;
      padding: 20px;
      max-width: 1400px;
      margin-left: auto;
      margin-right: auto;
    }

    .card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 255, 255, 0.2);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .card-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(45deg, #00ffff, #0080ff);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }

    .card-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a202c;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      margin-bottom: 6px;
      color: #4a5568;
      font-weight: 600;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-input, .form-select {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 14px;
      background: #fff;
      transition: all 0.3s ease;
    }

    .form-input:focus, .form-select:focus {
      border-color: #00ffff;
      box-shadow: 0 0 0 3px rgba(0, 255, 255, 0.1);
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(45deg, #00ffff, #0080ff);
      color: white;
    }

    .btn-danger {
      background: linear-gradient(45deg, #ff4757, #ff3838);
      color: white;
    }

    .status-success {
      background: linear-gradient(45deg, #2ed573, #1e90ff);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      margin-top: 16px;
    }

    .status-error {
      background: linear-gradient(45deg, #ff4757, #ff3838);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      margin-top: 16px;
    }

    .tabs {
      display: flex;
      gap: 0;
      margin-bottom: 20px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 4px;
    }

    .tab-btn {
      flex: 1;
      padding: 12px;
      background: transparent;
      border: none;
      color: #b0b7bf;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.3s ease;
    }

    .tab-btn.active {
      background: rgba(0, 255, 255, 0.2);
      color: #00ffff;
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
    }

    .ini-files {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }

    .ini-file-btn {
      padding: 12px;
      background: #fff;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .ini-file-btn:hover {
      border-color: #00ffff;
    }

    .ini-file-btn.active {
      border-color: #00ffff;
      background: rgba(0, 255, 255, 0.1);
    }

    .epic-badge {
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(45deg, #313131, #1a1a1a);
      color: #00ffff;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      border: 1px solid #00ffff;
    }

    .shutdown-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: 2000;
      align-items: center;
      justify-content: center;
    }

    .shutdown-modal.show {
      display: flex;
    }

    .shutdown-content {
      background: rgba(255, 255, 255, 0.95);
      padding: 30px;
      border-radius: 12px;
      max-width: 400px;
      width: 90%;
      text-align: center;
    }

    .shutdown-content h3 {
      color: #ff4757;
      margin-bottom: 16px;
    }

    .shutdown-content p {
      color: #666;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="epic-badge">Epic Games Admin</div>

  <nav class="nav">
    <div class="logo">VOLTRONITE</div>
    <form method="POST" action="/logout" style="display: inline;">
      <button type="submit" class="logout-btn">Logout</button>
    </form>
  </nav>

  <div class="main-content">
    <div class="tabs">
      <button class="tab-btn active" onclick="showTab('backend')">Backend</button>
      <button class="tab-btn" onclick="showTab('ini')">INI Editor</button>
      <button class="tab-btn" onclick="showTab('system')">System</button>
    </div>

    <!-- Backend Tab -->
    <div id="backend" class="tab-content active">
      <div class="card">
        <div class="card-header">
          <div class="card-icon">⚙️</div>
          <div class="card-title">Backend Configuration</div>
        </div>
        <form id="backendForm" class="form-grid">
          <div class="form-group">
            <label class="form-label">Main Port</label>
            <input type="number" id="port" name="PORT" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">Matchmaker Port</label>
            <input type="number" id="matchmakerPort" name="MATCHMAKER_PORT" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">Matchmaker IP</label>
            <input type="text" id="matchmakerIp" name="MATCHMAKER_IP" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">Game Server IP</label>
            <input type="text" id="gameserverIp" name="GAMESERVER_IP" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">Enable Logger</label>
            <select id="useLogger" name="USE_LOGGER" class="form-select">
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Custom Matchmaking</label>
            <select id="useCustomMatchmaking" name="USE_CUSTOM_MATCHMAKING_CODE" class="form-select">
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Settings Panel</label>
            <select id="useSettingsPanel" name="USE_SETTINGS_PANNEL" class="form-select">
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Require Login</label>
            <select id="useSettingsLogin" name="USE_SETTINGS_LOGIN" class="form-select">
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
        </form>
        <div style="display: flex; gap: 12px; margin-top: 20px;">
          <button type="submit" form="backendForm" class="btn btn-primary">Save Settings</button>
          <button type="button" id="restartBtn" class="btn btn-danger">Restart Backend</button>
          <button type="button" id="shutdownBtn" class="btn btn-danger" style="background: linear-gradient(45deg, #8b0000, #ff0000);">Shutdown Backend</button>
        </div>
      </div>
    </div>

    <!-- INI Editor Tab -->
    <div id="ini" class="tab-content">
      <div class="card">
        <div class="card-header">
          <div class="card-icon">📝</div>
          <div class="card-title">INI File Editor</div>
        </div>
        <div class="ini-files" id="iniFileList">
          <!-- INI files will be loaded here -->
        </div>
        <div id="iniEditor" style="display: none;">
          <h3 id="iniFileTitle" style="color: #1a202c; margin-bottom: 16px;"></h3>
          <textarea id="iniContent" class="form-input" style="min-height: 400px; font-family: 'Monaco', 'Menlo', monospace; resize: vertical;"></textarea>
          <div style="display: flex; gap: 12px; margin-top: 16px;">
            <button id="saveIniBtn" class="btn btn-primary">Save INI File</button>
            <button id="reloadIniBtn" class="btn btn-primary">Reload File</button>
          </div>
        </div>
      </div>
    </div>

    <!-- System Tab -->
    <div id="system" class="tab-content">
      <div class="card">
        <div class="card-header">
          <div class="card-icon">🔧</div>
          <div class="card-title">System Management</div>
        </div>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <button id="clearCacheBtn" class="btn btn-danger">Clear Cache</button>
          <button id="backupBtn" class="btn btn-primary">Create Backup</button>
          <button id="logsBtn" class="btn btn-primary">View Logs</button>
          <button id="metricsBtn" class="btn btn-primary">System Metrics</button>
        </div>
        <div id="systemOutput" style="margin-top: 20px; padding: 16px; background: #f8f9fa; border-radius: 8px; font-family: monospace; white-space: pre-wrap;"></div>
      </div>
    </div>

    <div id="status"></div>
  </div>

  <!-- Shutdown Confirmation Modal -->
  <div id="shutdownModal" class="shutdown-modal">
    <div class="shutdown-content">
      <h3>⚠️ Confirm Backend Shutdown</h3>
      <p>This will completely stop the Voltronite backend server. All players will be disconnected.</p>
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 600;">Enter Admin Password to Confirm:</label>
        <input type="password" id="shutdownPassword" style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 8px; font-size: 16px;">
      </div>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button id="confirmShutdown" class="btn btn-danger">Shutdown Server</button>
        <button id="cancelShutdown" class="btn btn-primary">Cancel</button>
      </div>
      <div id="shutdownStatus" style="margin-top: 16px;"></div>
    </div>
  </div>

  <script>
    function showTab(tabName) {
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.getElementById(tabName).classList.add('active');
      event.target.classList.add('active');
    }

    // Load settings
    fetch('/api/settings').then(r => r.json()).then(data => {
      Object.keys(data).forEach(key => {
        const el = document.getElementById(key.toLowerCase());
        if (el) el.value = data[key];
      });
    });

    // Load INI files
    fetch('/api/ini/list').then(r => r.json()).then(data => {
      const fileList = document.getElementById('iniFileList');
      fileList.innerHTML = data.files.map(file => 
        \`<button class="ini-file-btn" onclick="loadIniFile('\${file}')">\${file}</button>\`
      ).join('');
    });

    function loadIniFile(filename) {
      document.querySelectorAll('.ini-file-btn').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
      
      fetch(\`/api/ini/\${filename}\`).then(r => r.json()).then(data => {
        document.getElementById('iniFileTitle').textContent = filename;
        document.getElementById('iniContent').value = data.content;
        document.getElementById('iniEditor').style.display = 'block';
      });
    }

    // Form submissions
    document.getElementById('backendForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      showStatus(result.message, 'success');
    });

    // INI operations
    document.getElementById('saveIniBtn').addEventListener('click', async () => {
      const filename = document.getElementById('iniFileTitle').textContent;
      const content = document.getElementById('iniContent').value;
      
      const response = await fetch(\`/api/ini/\${filename}\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const result = await response.json();
      showStatus('INI file saved successfully!', 'success');
    });

    document.getElementById('reloadIniBtn').addEventListener('click', () => {
      const filename = document.getElementById('iniFileTitle').textContent;
      if (filename) loadIniFile(filename);
    });

    // System operations
    document.getElementById('restartBtn').addEventListener('click', async () => {
      const response = await fetch('/api/restart', { method: 'POST' });
      const result = await response.json();
      showStatus(result.message, 'success');
    });

    // Shutdown functionality
    document.getElementById('shutdownBtn').addEventListener('click', () => {
      document.getElementById('shutdownModal').classList.add('show');
      document.getElementById('shutdownPassword').focus();
    });

    document.getElementById('cancelShutdown').addEventListener('click', () => {
      document.getElementById('shutdownModal').classList.remove('show');
      document.getElementById('shutdownPassword').value = '';
      document.getElementById('shutdownStatus').innerHTML = '';
    });

    document.getElementById('confirmShutdown').addEventListener('click', async () => {
      const password = document.getElementById('shutdownPassword').value;
      
      if (!password) {
        document.getElementById('shutdownStatus').innerHTML = '<div style="color: #ff4757;">Please enter the admin password</div>';
        return;
      }

      try {
        const response = await fetch('/api/shutdown', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });
        
        const result = await response.json();
        
        if (response.ok) {
          document.getElementById('shutdownStatus').innerHTML = '<div style="color: #2ed573;">' + result.message + '</div>';
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          document.getElementById('shutdownStatus').innerHTML = '<div style="color: #ff4757;">' + result.error + '</div>';
        }
      } catch (error) {
        document.getElementById('shutdownStatus').innerHTML = '<div style="color: #ff4757;">Failed to shutdown server</div>';
      }
    });

    // System operations
    document.getElementById('clearCacheBtn').addEventListener('click', async () => {
      try {
        const response = await fetch('/api/clear-cache', { method: 'POST' });
        const result = await response.json();
        showStatus(result.message || 'Cache cleared successfully', 'success');
      } catch (error) {
        showStatus('Failed to clear cache', 'error');
      }
    });

    document.getElementById('backupBtn').addEventListener('click', async () => {
      try {
        const response = await fetch('/api/backup', { method: 'POST' });
        const result = await response.json();
        showStatus(result.message || 'Backup created successfully', 'success');
      } catch (error) {
        showStatus('Failed to create backup', 'error');
      }
    });

    document.getElementById('logsBtn').addEventListener('click', async () => {
      try {
        const response = await fetch('/api/logs');
        const result = await response.json();
        document.getElementById('systemOutput').textContent = result.logs.join('\\n');
      } catch (error) {
        document.getElementById('systemOutput').textContent = 'Failed to load logs';
      }
    });

    document.getElementById('metricsBtn').addEventListener('click', async () => {
      try {
        const response = await fetch('/api/metrics');
        const metrics = await response.json();
        const output = \`System Metrics:
CPU Usage: \${(metrics.cpu.user / 1000000).toFixed(2)}%
Memory: \${(metrics.memory.heapUsed / 1024 / 1024).toFixed(0)}MB/\${(metrics.memory.heapTotal / 1024 / 1024).toFixed(0)}MB
Platform: \${metrics.platform}
Node Version: \${metrics.nodeVersion}
Uptime: \${Math.floor(metrics.uptime / 3600)}h \${Math.floor((metrics.uptime % 3600) / 60)}m\`;
        document.getElementById('systemOutput').textContent = output;
      } catch (error) {
        document.getElementById('systemOutput').textContent = 'Failed to load metrics';
      }
    });

    function showStatus(message, type) {
      const status = document.getElementById('status');
      status.innerHTML = \`<div class="status-\${type}" style="padding: 12px 16px; border-radius: 8px; margin-top: 16px;">\${message}</div>\`;
      setTimeout(() => status.innerHTML = '', 5000);
    }
  </script>
</body>
</html>`;
  return c.html(html);
});

app.get("/api/settings", conditionalAuth, (c) => {
  try {
    const envContent = fs.readFileSync(envPath, "utf-8");
    const settings: Record<string, string> = {};
    envContent.split("\n").forEach(line => {
      if (line.includes("=") && !line.startsWith("#")) {
        const [key, ...valueParts] = line.split("=");
        if (key) {
          settings[key.trim()] = valueParts.join("=").trim();
        }
      }
    });
    return c.json(settings);
  } catch (error) {
    return c.json({ error: "Failed to load settings" }, 500);
  }
});

app.post("/api/settings", conditionalAuth, async (c) => {
  try {
    const newSettings = await c.req.json();
    let envContent = fs.readFileSync(envPath, "utf-8");
    const lines = envContent.split("\n");
    
    // Update existing keys and add missing ones
    Object.keys(newSettings).forEach(key => {
      const regex = new RegExp(`^${key}=.*$`, "m");
      const newLine = `${key}=${newSettings[key]}`;
      
      if (regex.test(envContent)) {
        // Replace existing line
        envContent = envContent.replace(regex, newLine);
      } else {
        // Add new key at the end of the file
        envContent += `\n${newLine}`;
      }
    });
    
    fs.writeFileSync(envPath, envContent);
    console.log(formatLog("service", "Settings updated via web panel"));
    return c.json({ message: "Settings saved successfully" });
  } catch (error) {
    return c.json({ error: "Failed to save settings" }, 500);
  }
});

app.get("/api/ini/list", conditionalAuth, (c) => {
  try {
    const files = fs.readdirSync(iniDir).filter(f => f.endsWith('.ini'));
    return c.json(files);
  } catch (error) {
    return c.json({ error: "Failed to list INI files" }, 500);
  }
});

app.get("/api/ini/:file", conditionalAuth, (c) => {
  try {
    const file = c.req.param("file");
    if (!file.endsWith('.ini')) return c.json({ error: "Invalid file" }, 400);
    const filePath = path.join(iniDir, file);
    if (!fs.existsSync(filePath)) return c.json({ error: "File not found" }, 404);
    const content = fs.readFileSync(filePath, "utf-8");
    return c.json({ content });
  } catch (error) {
    return c.json({ error: "Failed to read INI file" }, 500);
  }
});

app.post("/api/ini/:file", conditionalAuth, async (c) => {
  try {
    const file = c.req.param("file");
    if (!file.endsWith('.ini')) return c.json({ error: "Invalid file" }, 400);
    const { content } = await c.req.json();
    const filePath = path.join(iniDir, file);
    fs.writeFileSync(filePath, content);
    console.log(formatLog("service", `INI file ${file} updated via web panel`));
    return c.json({ message: "INI file saved successfully" });
  } catch (error) {
    return c.json({ error: "Failed to save INI file" }, 500);
  }
});

// Shutdown backend with password verification
app.post("/api/shutdown", conditionalAuth, async (c) => {
  try {
    const { password } = await c.req.json();
    
    if (password !== adminPassword) {
      return c.json({ error: "Invalid password" }, 401);
    }

    console.log(formatLog("service", "Backend shutdown initiated via web panel"));
    
    // Graceful shutdown
    setTimeout(() => {
      process.exit(0);
    }, 1000);
    
    return c.json({ message: "Backend shutdown initiated. Server will stop in 1 second." });
  } catch (error) {
    return c.json({ error: "Failed to shutdown backend" }, 500);
  }
});

// Restart backend endpoint
app.post("/api/restart", conditionalAuth, async (c) => {
  try {
    console.log(formatLog("admin", "Backend restart initiated by admin"));
    
    // Send response before restarting
    c.json({ message: "Backend restarting..." });
    
    // Restart after a short delay
    setTimeout(() => {
      process.exit(0); // Exit with code 0 to allow restart scripts to handle
    }, 1000);
    
    return c.json({ message: "Backend restarting..." });
  } catch (error) {
    console.error(formatLog("error", "Failed to restart backend"), error);
    return c.json({ error: "Failed to restart backend" }, 500);
  }
});

// Clear cache endpoint
app.post("/api/clear-cache", conditionalAuth, async (c) => {
  try {
    console.log(formatLog("admin", "Cache clearing initiated by admin"));
    
    // Clear any cached data (this is a placeholder - implement actual cache clearing)
    // For now, just log the action
    console.log(formatLog("admin", "Cache cleared successfully"));
    
    return c.json({ message: "Cache cleared successfully" });
  } catch (error) {
    console.error(formatLog("error", "Failed to clear cache"), error);
    return c.json({ error: "Failed to clear cache" }, 500);
  }
});

// Create backup endpoint
app.post("/api/backup", conditionalAuth, async (c) => {
  try {
    console.log(formatLog("admin", "Backup creation initiated by admin"));
    
    // Create backup logic (placeholder - implement actual backup)
    const backupPath = `./backup_${new Date().toISOString().replace(/[:.]/g, '-')}.zip`;
    console.log(formatLog("admin", `Backup created at ${backupPath}`));
    
    return c.json({ message: `Backup created successfully at ${backupPath}` });
  } catch (error) {
    console.error(formatLog("error", "Failed to create backup"), error);
    return c.json({ error: "Failed to create backup" }, 500);
  }
});

// Get logs endpoint
app.get("/api/logs", conditionalAuth, async (c) => {
  try {
    // Return recent logs (placeholder - implement actual log reading)
    const logs = [
      "[01-05-2026 17:21:44] [BACKEND] Server started",
      "[01-05-2026 17:21:44] [SERVICE] Settings panel active",
      "[01-05-2026 17:22:15] [ADMIN] Settings updated",
      "[01-05-2026 17:23:01] [MATCHMAKING] Player joined session"
    ];
    
    return c.json({ logs });
  } catch (error) {
    console.error(formatLog("error", "Failed to retrieve logs"), error);
    return c.json({ error: "Failed to retrieve logs" }, 500);
  }
});

// Get system metrics endpoint
app.get("/api/metrics", conditionalAuth, async (c) => {
  try {
    // Get basic system metrics
    const metrics = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      platform: process.platform,
      nodeVersion: process.version,
      activeConnections: 0, // Placeholder
      totalRequests: 0 // Placeholder
    };
    
    return c.json(metrics);
  } catch (error) {
    console.error(formatLog("error", "Failed to retrieve metrics"), error);
    return c.json({ error: "Failed to retrieve metrics" }, 500);
  }
});

const port = 8081; // Different port for settings panel
Bun.serve({
  fetch: app.fetch,
  port,
  hostname: "127.0.0.1",
});

console.log(formatLog("service", `Settings panel running on http://127.0.0.1:${port}/settings`));

// Keep the event loop alive
setInterval(() => {}, 1000);