import { execSync } from 'child_process';

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

async function main() {
  console.log('\n========================================');
  console.log('🚀 SINCRONIZACIÓN RÁPIDA CON GITHUB');
  console.log('========================================\n');

  const name = exec('git config user.name');
  const email = exec('git config user.email');
  if (!name || !email) {
    console.error('❌ Error: Usuario de Git no configurado.');
    console.error('👉 Ejecuta primero: npm run setup-git\n');
    process.exit(1);
  }

  const status = exec('git status --porcelain');
  if (!status) {
    console.log('✨ No hay cambios pendientes en el proyecto para subir.\n');
    process.exit(0);
  }

  // 1. Stage
  console.log('📦 Agregando archivos modificados...');
  exec('git add -A');

  // 2. Commit message
  const customMessage = process.argv.slice(2).join(' ').trim();
  const commitMsg = customMessage || `chore: actualización manual ${getTimestamp()}`;
  console.log(`💾 Creando commit: "${commitMsg}"...`);

  const commitResult = execWithOutput(`git commit -m "${commitMsg}"`);
  if (!commitResult.ok) {
    console.error(`❌ Error al crear commit:\n${commitResult.output}`);
    process.exit(1);
  }

  // 3. Push
  const remote = exec('git remote get-url origin');
  if (!remote) {
    console.warn('\n⚠️ Commit local creado con éxito, pero no hay un remoto \'origin\' configurado.');
    console.warn('👉 Conecta tu GitHub con: git remote add origin <URL-de-tu-repo>');
    console.warn('   O ejecuta: npm run setup-git\n');
    process.exit(0);
  }

  const branch = exec('git branch --show-current') || 'main';
  console.log(`🚀 Subiendo a GitHub (${remote} -> rama ${branch})...`);
  
  const pushResult = execWithOutput(`git push origin ${branch}`);
  if (pushResult.ok) {
    console.log('\n✅ ¡Cambios sincronizados exitosamente con GitHub!');

    const renderHook = process.env.RENDER_DEPLOY_HOOK_URL;
    if (renderHook) {
      try {
        console.log('🌐 Notificando a Render para despliegue...');
        await fetch(renderHook, { method: 'POST' });
        console.log('🚀 ¡Despliegue disparado en Render exitosamente!\n');
      } catch (e) {
        console.warn('⚠️ No se pudo disparar el webhook de Render:', e.message);
      }
    } else {
      console.log('ℹ️  Render detectará el push automáticamente vía webhook/GitHub Actions.\n');
    }
  } else {
    console.error(`\n❌ Error al hacer push:\n${pushResult.output}`);
    console.error('👉 Posibles soluciones:');
    console.error('   1. Si hay cambios remotos nuevos: git pull --rebase origin ' + branch);
    console.error('   2. Verifica tus permisos y credenciales en GitHub.\n');
    process.exit(1);
  }
}

main();
