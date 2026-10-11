import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cwd = fileURLToPath(new URL('../', import.meta.url));
function git(...args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

async function main() {
  try { git('rev-parse', '--show-toplevel'); }
  catch { throw new Error('Esta carpeta no es un repositorio Git. Recupera el historial existente según DEPLOYMENT.md.'); }
  const remote = git('remote', 'get-url', 'origin');
  if (!/^(https:\/\/github\.com\/ramko09-oss\/finanzasmainupgraded(?:\.git)?|git@github\.com:ramko09-oss\/finanzasmainupgraded(?:\.git)?)$/.test(remote)) {
    throw new Error('origin no coincide con el repositorio de producción documentado en DEPLOYMENT.md.');
  }
  const branch = git('branch', '--show-current');
  if (!branch) throw new Error('HEAD separado: selecciona la rama de despliegue.');
  if (branch !== 'main') throw new Error('La rama de producción verificada es main. Integra los cambios allí antes de publicar.');
  if (!git('config', 'user.name') || !git('config', 'user.email')) throw new Error('Configura la identidad Git.');
  if (process.argv[2] === '--check') {
    console.log(`Git configurado. Rama: ${branch}. Acceso remoto y Render aún requieren verificación.`);
    console.log(git('status', '--short') || 'Sin cambios locales.');
    return;
  }
  const [message, ...paths] = process.argv.slice(2);
  if (paths.length) git('add', '--', ...paths);
  if (git('diff', '--cached', '--name-only')) {
    if (!message?.trim()) throw new Error('Indica un mensaje: npm run push -- "mensaje" archivo1 archivo2');
    git('diff', '--cached', '--check');
    console.log(git('commit', '-m', message));
  }
  // Reintentar también commits pendientes con un árbol de trabajo limpio.
  console.log(git('push', '--set-upstream', 'origin', branch));
  console.log(`Push completado. Commit: ${git('rev-parse', 'HEAD')}`);
  console.log('Render: comprobar auto-deploy o Actions y confirmar este commit en estado live.');
}

main().catch((error) => {
  if (error.stderr) console.error('Falló un comando Git. Revisa acceso, rama y conflictos antes de reintentar.');
  else console.error(error.message);
  process.exitCode = 1;
});
