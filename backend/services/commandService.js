const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

// ─── Command Map ──────────────────────────────────────────────────────────────
// Each entry: [regex pattern, windows command, friendly description]
const COMMAND_MAP = [
  // ── Camera & Media ──────────────────────────────────────────
  [/open camera/i,                         'explorer "microsoft.windows.camera:"',                               'Camera app opened'],
  [/open spotify/i,                         'explorer "spotify:"',                                                'Spotify opened'],
  [/open (media player|vlc)/i,             'start wmplayer',                                                      'Media Player opened'],

  // ── Browsers ────────────────────────────────────────────────
  [/open (chrome|google chrome)/i,         'start chrome',                                                        'Google Chrome opened'],
  [/open (edge|microsoft edge)/i,          'start msedge',                                                        'Microsoft Edge opened'],
  [/open (firefox)/i,                      'start firefox',                                                       'Firefox opened'],
  [/open browser/i,                        'start msedge',                                                        'Browser opened'],

  // ── Websites ────────────────────────────────────────────────
  [/open youtube/i,                        'explorer "https://www.youtube.com"',                                  'YouTube opened'],
  [/open google/i,                         'explorer "https://www.google.com"',                                   'Google opened'],
  [/open gmail/i,                          'explorer "https://mail.google.com"',                                  'Gmail opened'],
  [/open github/i,                         'explorer "https://www.github.com"',                                   'GitHub opened'],
  [/open (whatsapp web|whatsapp)/i,        'explorer "https://web.whatsapp.com"',                                 'WhatsApp Web opened'],
  [/open netflix/i,                        'explorer "https://www.netflix.com"',                                  'Netflix opened'],
  [/open instagram/i,                      'explorer "https://www.instagram.com"',                                'Instagram opened'],
  [/open twitter/i,                        'explorer "https://www.twitter.com"',                                  'Twitter opened'],
  [/open chatgpt/i,                        'explorer "https://chat.openai.com"',                                  'ChatGPT opened'],

  // ── System Apps ─────────────────────────────────────────────
  [/open notepad/i,                        'start notepad',                                                       'Notepad opened'],
  [/open calculator|open calc/i,           'start calc',                                                          'Calculator opened'],
  [/open paint/i,                          'start mspaint',                                                       'Paint opened'],
  [/open (task manager|taskmanager)/i,     'start taskmgr',                                                       'Task Manager opened'],
  [/open settings/i,                       'explorer "ms-settings:"',                                             'Settings opened'],
  [/open (file explorer|explorer|files)/i,'explorer',                                                             'File Explorer opened'],
  [/open downloads/i,                      `explorer "${process.env.USERPROFILE}\\Downloads"`,                    'Downloads folder opened'],
  [/open desktop/i,                        `explorer "${process.env.USERPROFILE}\\Desktop"`,                      'Desktop folder opened'],
  [/open documents/i,                      `explorer "${process.env.USERPROFILE}\\Documents"`,                    'Documents folder opened'],
  [/open (pictures|photos)/i,              `explorer "${process.env.USERPROFILE}\\Pictures"`,                     'Pictures folder opened'],
  [/open (vs code|vscode|visual studio code)/i, 'start code',                                                    'VS Code opened'],
  [/open (cmd|command prompt)/i,           'start cmd',                                                           'Command Prompt opened'],
  [/open powershell/i,                     'start powershell',                                                    'PowerShell opened'],
  [/open (word|microsoft word)/i,          'start winword',                                                       'Microsoft Word opened'],
  [/open (excel|microsoft excel)/i,        'start excel',                                                         'Microsoft Excel opened'],
  [/open (powerpoint|microsoft powerpoint)/i, 'start powerpnt',                                                   'PowerPoint opened'],

  // ── Volume Control ───────────────────────────────────────────
  [/(volume up|increase volume|louder)/i,  'powershell -c "(New-Object -ComObject WScript.Shell).SendKeys([char]175)"',  'Volume increased'],
  [/(volume down|decrease volume|lower volume|quieter)/i, 'powershell -c "(New-Object -ComObject WScript.Shell).SendKeys([char]174)"', 'Volume decreased'],
  [/^mute$|^mute (audio|sound|volume)/i,  'powershell -c "(New-Object -ComObject WScript.Shell).SendKeys([char]173)"',  'Audio muted/unmuted'],

  // ── Screenshot ───────────────────────────────────────────────
  [/(take screenshot|screenshot)/i,        'powershell -c "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait(\'%{PRTSC}\')"', 'Screenshot captured'],

  // ── Power ────────────────────────────────────────────────────
  [/lock (screen|computer|pc|laptop)/i,    'rundll32.exe user32.dll,LockWorkStation',                             'Screen locked'],
  [/sleep (mode|computer|pc|laptop)/i,     'rundll32.exe powrprof.dll,SetSuspendState 0,1,0',                     'System going to sleep'],
  [/restart (computer|pc|laptop|system)/i, 'shutdown /r /t 30',                                                   'Restarting in 30 seconds'],
  [/shutdown (computer|pc|laptop|system)/i,'shutdown /s /t 30',                                                   'Shutting down in 30 seconds'],
  [/cancel (shutdown|restart)/i,           'shutdown /a',                                                         'Shutdown/restart cancelled'],
];

/**
 * Check if user message contains a system command and execute it.
 * @param {string} message
 * @returns {{ executed: boolean, description?: string, success?: boolean, error?: string }}
 */
const detectAndExecute = async (message) => {
  for (const [pattern, command, description] of COMMAND_MAP) {
    if (pattern.test(message)) {
      try {
        await execAsync(command);
        console.log(`[CommandService] Executed: ${description}`);
        return { executed: true, description, success: true };
      } catch (err) {
        // explorer.exe often returns exit code 1 even when it successfully opens a URL/folder
        if (command.startsWith('explorer') && err.code === 1) {
          console.log(`[CommandService] Executed (Explorer code 1): ${description}`);
          return { executed: true, description, success: true };
        }
        
        console.error(`[CommandService] Failed: ${description}`, err.message);
        return { executed: true, description, success: false, error: err.message };
      }
    }
  }
  return { executed: false };
};

/**
 * Collect real-time system info from Windows WMI.
 */
const getSystemInfo = async () => {
  const run = async (cmd) => {
    try {
      const { stdout } = await execAsync(cmd);
      return stdout.trim();
    } catch {
      return null;
    }
  };

  const [battery, cpu, totalMem, freeMem, hostname, os, uptime] = await Promise.all([
    run('powershell -c "(Get-WmiObject Win32_Battery).EstimatedChargeRemaining"'),
    run('powershell -c "(Get-WmiObject Win32_Processor).LoadPercentage"'),
    run('powershell -c "[Math]::Round((Get-WmiObject Win32_ComputerSystem).TotalPhysicalMemory/1GB, 1)"'),
    run('powershell -c "[Math]::Round((Get-WmiObject Win32_OperatingSystem).FreePhysicalMemory/1MB, 1)"'),
    run('powershell -c "$env:COMPUTERNAME"'),
    run('powershell -c "(Get-WmiObject Win32_OperatingSystem).Caption"'),
    run('powershell -c "[Math]::Round((Get-Date - (gcim Win32_OperatingSystem).LastBootUpTime).TotalHours, 1)"'),
  ]);

  return {
    battery: battery ? `${battery}%` : 'N/A',
    batteryLevel: battery ? parseInt(battery) : null,
    cpu: cpu ? `${cpu}%` : 'N/A',
    cpuLevel: cpu ? parseInt(cpu) : null,
    totalMemory: totalMem ? `${totalMem} GB` : 'N/A',
    freeMemory: freeMem ? `${freeMem} GB` : 'N/A',
    hostname: hostname || 'N/A',
    os: os || 'Windows',
    uptimeHours: uptime || 'N/A',
    timestamp: new Date().toISOString(),
  };
};

module.exports = { detectAndExecute, getSystemInfo };
