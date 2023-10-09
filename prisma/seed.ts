// async function main()  {
//     // create two dummy users
//     const user1 = await prisma.user.upsert({
//       where: { email: 'sabin@adams.com' },
//       update: {},
//       create: {
//         email: 'sabin@adams.com',
//         name: 'Sabin Adams',
//         password: 'password-sabin',
//       },
//     });

//     const user2 = await prisma.user.upsert({
//       where: { email: 'alex@ruheni.com' },
//       update: {},
//       create: {
//         email: 'alex@ruheni.com',
//         name: 'Alex Ruheni',
//         password: 'password-alex',
//       },
//     });
// }
