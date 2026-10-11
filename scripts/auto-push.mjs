import { execSync } from 'child_process';

const POLL_INTERVAL_MS = 5000;
const DEBOUNCE_WAIT_MS = 5000;

function exec(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    return null;
  }
}

function execWithOutput(cmd) {
  try {
    const out = execSync(cmd, { encoding: 'utf-8' });
    return { ok: true, output: out.trim() };
  } catch (err) {
    return { 
      ok: false, 
      output: (err.stdout ? err.stdout.toString() : '') + '\n' + (err.stderr ? err.stderr.toString() : '')
    };
  }
}

function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19);
}

function hasGitChanges() {
  const status = exec('git status --porcelain');
  return Boolean(status && status.length > 0);
}

function getCurrentBranch() {
  return exec('git branch --show-current') || 'main';
}

function hasRemoteOrigin() {
  return Boolean(exec('git remote get-url origin'));
}

function hasUserConfig() {
  const name = exec('git config user.name');
  const email = exec('git config user.email');
  return Boolean(name && email);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runAutoSync() {
  console.log('\n==========================================================');
  console.log('MONITOR DE PUBLICACIÓN AUTOMÁTICA A GITHUB INICIADO');
  console.log('==========================================================');
  console.log(`⏱️  Monitoreando cambios cada ${POLL_INTERVAL_MS / 1000}s`);
  console.log('🛑 Presiona Ctrl+C en cualquier momento para detenerlo.');
  console.log('==========================================================\n');

  let isSyncing = false;

  while (true) {
    try {
      if (!isSyncing && hasGitChanges()) {
        isSyncing = true;
        console.log(`[${getTimestamp()}] 📝 Se detectaron cambios en el proyecto. Esperando ${DEBOUNCE_WAIT_MS / 1000}s para consolidar...`);
        
        await sleep(DEBOUNCE_WAIT_MS);

        if (!hasUserConfig()) {
          console.error(`\n[${getTimestamp()}] ❌ Error: Usuario de Git no configurado.`);
          console.error('👉 Ejecuta en otra terminal: npm run setup-git\n');
          isSyncing = false;
          await sleep(POLL_INTERVAL_MS * 2);
          continue;
        }

        // 1. Stage changes
        exec('git add -A');

        // 2. Count changed files
        const statusShort = exec('git status --short') || '';
        const changedLines = statusShort.split('\n').filter(Boolean);
        const fileCount = changedLines.length;

        if (fileCount === 0) {
          isSyncing = false;
          continue;
        }

        // 3. Commit
        const commitMsg = `auto: sincronización ${getTimestamp()} (${fileCount} archivo${fileCount > 1 ? 's' : ''})`;
        console.log(`[${getTimestamp()}] 💾 Creando commit: "${commitMsg}"...`);
        
        const commitResult = execWithOutput(`git commit -m "${commitMsg}"`);
        if (!commitResult.ok) {
          console.error(`[${getTimestamp()}] ⚠️ No se pudo realizar el commit:\n${commitResult.output}`);
          isSyncing = false;
          await sleep(POLL_INTERVAL_MS);
          continue;
        }

        // 4. Push
        const branch = getCurrentBranch();
        if (!hasRemoteOrigin()) {
          console.warn(`[${getTimestamp()}] ⚠️ Commit local creado, pero no hay un remoto 'origin' configurado.`);
          console.warn(`👉 Para conectar tu GitHub ejecuta: git remote add origin <URL-de-tu-repo>`);
          console.warn(`   O ejecuta el asistente: npm run setup-git\n`);
        } else {
          console.log(`[${getTimestamp()}] 🚀 Subiendo a GitHub (rama: ${branch})...`);
          const pushResult = execWithOutput(`git push origin ${branch}`);
          
          if (pushResult.ok) {
            console.log(`[${getTimestamp()}] ✅ ¡Push completado con éxito a GitHub!`);

            // Disparar Render si hay deploy hook configurado
            const renderHook = process.env.RENDER_DEPLOY_HOOK_URL;
            if (renderHook) {
              try {
                console.log(`[${getTimestamp()}] 🌐 Disparando despliegue en Render...`);
                await fetch(renderHook, { method: 'POST' });
                console.log(`[${getTimestamp()}] 🚀 ¡Despliegue en Render solicitado con éxito!\n`);
              } catch (e) {
                console.warn(`[${getTimestamp()}] ⚠️ No se pudo disparar el webhook de Render:`, e.message);
              }
            } else {
              console.log(`[${getTimestamp()}] ℹ️  Render detectará el push automáticamente vía webhook/GitHub Actions.\n`);
            }
          } else {
            console.error(`[${getTimestamp()}] ⚠️ Error al hacer push:\n${pushResult.output}`);
            console.error(`👉 Si es la primera vez, asegúrate de haber autenticado tu cuenta de GitHub o de haber hecho 'git pull' si hay cambios remotos.\n`);
          }
        }

        isSyncing = false;
      }
    } catch (err) {
      console.error(`[${getTimestamp()}] Error inesperado en el ciclo de auto-push:`, err.message);
      isSyncing = false;
    }

    await sleep(POLL_INTERVAL_MS);
  }
}

process.on('SIGINT', () => {
  console.log('\n👋 Auto-push detenido por el usuario.');
  process.exit(0);
});

runAutoSync();
