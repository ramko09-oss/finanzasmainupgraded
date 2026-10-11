import { execSync } from 'child_process';
import readline from 'readline';

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    return null;
  }
}

async function ask(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

async function main() {
  console.log('\n========================================');
  console.log('🛠️  CONFIGURACIÓN DE GIT Y GITHUB');
  console.log('========================================\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    let currentName = run('git config user.name');
    let currentEmail = run('git config user.email');
    let currentRemote = run('git remote get-url origin');

    // 1. Nombre
    const namePrompt = currentName 
      ? `👤 Nombre en Git actual [${currentName}] (Enter para mantener): `
      : '👤 Introduce tu nombre para Git (ej. Juan Perez): ';
    const name = await ask(rl, namePrompt);
    if (name) {
      execSync(`git config user.name "${name}"`);
      console.log(`✅ Nombre configurado: ${name}`);
    } else if (currentName) {
      console.log(`✅ Nombre conservado: ${currentName}`);
    } else {
      console.log('⚠️ No se definió nombre. Git puede solicitarlo en el commit.');
    }

    // 2. Correo
    const emailPrompt = currentEmail
      ? `📧 Correo en Git actual [${currentEmail}] (Enter para mantener): `
      : '📧 Introduce tu correo de GitHub (ej. usuario@ejemplo.com): ';
    const email = await ask(rl, emailPrompt);
    if (email) {
      execSync(`git config user.email "${email}"`);
      console.log(`✅ Correo configurado: ${email}`);
    } else if (currentEmail) {
      console.log(`✅ Correo conservado: ${currentEmail}`);
    } else {
      console.log('⚠️ No se definió correo. Git puede solicitarlo en el commit.');
    }

    // 3. Repositorio Remoto
    const remotePrompt = currentRemote
      ? `🔗 URL del repositorio GitHub [${currentRemote}] (Enter para mantener): `
      : '🔗 Pega la URL de tu repositorio en GitHub (ej. https://github.com/usuario/repo.git): ';
    const repoUrl = await ask(rl, remotePrompt);
    if (repoUrl) {
      if (currentRemote) {
        execSync(`git remote set-url origin "${repoUrl}"`);
        console.log(`✅ Remoto actualizado a: ${repoUrl}`);
      } else {
        execSync(`git remote add origin "${repoUrl}"`);
        console.log(`✅ Remoto agregado: ${repoUrl}`);
      }
    } else if (currentRemote) {
      console.log(`✅ Remoto conservado: ${currentRemote}`);
    } else {
      console.log('⚠️ Recuerda agregar el remoto luego con: git remote add origin <URL>');
    }

    // 4. Rama principal a main
    execSync('git branch -M main');
    console.log('✅ Rama principal asegurada: main\n');

    console.log('========================================');
    console.log('✨ Configuración completa. Listo para usar:');
    console.log('   npm run auto-push  -> Sincronización automática continua');
    console.log('   npm run push -- --check -> Comprobar configuración y cambios');
    console.log('   npm run push -- "mensaje" archivo1 archivo2 -> Publicar archivos revisados');
    console.log('========================================\n');
  } finally {
    rl.close();
  }
}

main().catch(console.error);
