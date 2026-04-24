import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

const notes = [
  'Feito! Me senti ótimo.',
  'Completado com esforço.',
  'Fácil hoje.',
  'Melhorei um pouco.',
  null,
  null,
  'Ótima sessão!',
  'Consegui manter o foco.',
  null,
];

function randomNote() {
  return notes[Math.floor(Math.random() * notes.length)];
}

async function seedLogs(habit, daysBack, completionRate = 0.8) {
  for (let day = 0; day < daysBack; day++) {
    if (Math.random() > completionRate) continue;
    await prisma.habitLog.upsert({
      where: { habitId_date: { habitId: habit.id, date: daysAgo(day) } },
      update: {},
      create: { habitId: habit.id, date: daysAgo(day), note: randomNote() },
    });
  }
}

async function main() {
  console.log('Limpando banco de dados...');
  await prisma.habitLog.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.user.deleteMany();

  console.log('Criando usuários...');
  const passwordHash = await bcrypt.hash('senha123', 10);

  const [alice, bob, carol] = await Promise.all([
    prisma.user.create({ data: { name: 'Alice Silva', email: 'alice@exemplo.com', passwordHash } }),
    prisma.user.create({ data: { name: 'Bob Souza', email: 'bob@exemplo.com', passwordHash } }),
    prisma.user.create({ data: { name: 'Carol Lima', email: 'carol@exemplo.com', passwordHash } }),
  ]);

  console.log('Criando hábitos...');

  const aliceHabits = await Promise.all([
    prisma.habit.create({ data: { userId: alice.id, title: 'Meditar', description: '10 minutos pela manhã', frequency: 'DAILY' } }),
    prisma.habit.create({ data: { userId: alice.id, title: 'Caminhar', description: '30 minutos ao ar livre', frequency: 'DAILY' } }),
    prisma.habit.create({ data: { userId: alice.id, title: 'Leitura', description: 'Ler pelo menos 20 páginas', frequency: 'DAILY' } }),
    prisma.habit.create({ data: { userId: alice.id, title: 'Revisão semanal', description: 'Revisar metas e planejar próxima semana', frequency: 'WEEKLY' } }),
  ]);

  const bobHabits = await Promise.all([
    prisma.habit.create({ data: { userId: bob.id, title: 'Beber água', description: '2 litros por dia', frequency: 'DAILY' } }),
    prisma.habit.create({ data: { userId: bob.id, title: 'Estudar inglês', description: '15 minutos no Duolingo', frequency: 'DAILY' } }),
    prisma.habit.create({ data: { userId: bob.id, title: 'Academia', description: 'Treino de força', frequency: 'DAILY' } }),
    prisma.habit.create({ data: { userId: bob.id, title: 'Podcast técnico', description: 'Ouvir 1 episódio por semana', frequency: 'WEEKLY' } }),
  ]);

  const carolHabits = await Promise.all([
    prisma.habit.create({ data: { userId: carol.id, title: 'Journaling', description: 'Escrever gratidões do dia', frequency: 'DAILY' } }),
    prisma.habit.create({ data: { userId: carol.id, title: 'Sem açúcar', description: 'Evitar doces e refrigerantes', frequency: 'DAILY' } }),
    prisma.habit.create({ data: { userId: carol.id, title: 'Organizar finanças', description: 'Registrar gastos da semana', frequency: 'WEEKLY' } }),
  ]);

  console.log('Criando logs de hábitos...');

  // Alice: consistente (90%)
  for (const habit of aliceHabits) {
    await seedLogs(habit, 30, 0.9);
  }

  // Bob: irregular (60%)
  for (const habit of bobHabits) {
    await seedLogs(habit, 30, 0.6);
  }

  // Carol: recente, apenas 10 dias (70%)
  for (const habit of carolHabits) {
    await seedLogs(habit, 10, 0.7);
  }

  const totalHabits = aliceHabits.length + bobHabits.length + carolHabits.length;
  const totalLogs = await prisma.habitLog.count();

  console.log('\nSeed concluído com sucesso!');
  console.log('  Usuários: alice@exemplo.com | bob@exemplo.com | carol@exemplo.com');
  console.log('  Senha de todos: senha123');
  console.log(`  Hábitos criados: ${totalHabits}`);
  console.log(`  Logs criados: ${totalLogs}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
