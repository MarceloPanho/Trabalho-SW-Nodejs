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

async function main() {
  console.log('Limpando banco de dados...');
  await prisma.habitLog.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.user.deleteMany();

  console.log('Criando usuários...');
  const passwordHash = await bcrypt.hash('senha123', 10);

  const alice = await prisma.user.create({
    data: {
      name: 'Alice Silva',
      email: 'alice@exemplo.com',
      passwordHash,
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob Souza',
      email: 'bob@exemplo.com',
      passwordHash,
    },
  });

  console.log('Criando hábitos...');

  const aliceHabits = await Promise.all([
    prisma.habit.create({
      data: { userId: alice.id, title: 'Meditar', description: '10 minutos pela manhã', frequency: 'DAILY' },
    }),
    prisma.habit.create({
      data: { userId: alice.id, title: 'Exercitar', description: '30 minutos de caminhada', frequency: 'DAILY' },
    }),
    prisma.habit.create({
      data: { userId: alice.id, title: 'Leitura semanal', description: 'Ler pelo menos 50 páginas', frequency: 'WEEKLY' },
    }),
  ]);

  const bobHabits = await Promise.all([
    prisma.habit.create({
      data: { userId: bob.id, title: 'Beber água', description: '2 litros por dia', frequency: 'DAILY' },
    }),
    prisma.habit.create({
      data: { userId: bob.id, title: 'Estudar inglês', description: '15 minutos no Duolingo', frequency: 'DAILY' },
    }),
    prisma.habit.create({
      data: { userId: bob.id, title: 'Revisão semanal', description: 'Revisar metas da semana', frequency: 'WEEKLY' },
    }),
  ]);

  console.log('Criando logs de hábitos...');

  const allHabits = [...aliceHabits, ...bobHabits];

  for (const habit of allHabits) {
    const logDays = [0, 1, 2, 3, 4, 5, 6];
    for (const day of logDays) {
      await prisma.habitLog.create({
        data: {
          habitId: habit.id,
          date: daysAgo(day),
          note: day === 0 ? 'Feito hoje!' : null,
        },
      });
    }
  }

  console.log(`\nSeed concluído com sucesso!`);
  console.log(`  Usuários criados: alice@exemplo.com / bob@exemplo.com`);
  console.log(`  Senha de ambos: senha123`);
  console.log(`  Hábitos: ${allHabits.length} | Logs: ${allHabits.length * 7}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
