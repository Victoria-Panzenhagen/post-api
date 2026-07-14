import dataSource from '../data-source';
import { runDisciplineSeed } from './discipline.seed';

async function seed(): Promise<void> {
  await dataSource.initialize();

  try {
    await runDisciplineSeed(dataSource);

    console.log('✔ Todas as seeds foram executadas.');
  } catch (error) {
    console.error('Erro ao executar as seeds:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

seed().catch((error) => {
  console.error('Erro ao iniciar a execução das seeds:', error);
  process.exit(1);
});
