// import { Test, TestingModule } from '@nestjs/testing';
// import { OrdersModule } from 'src/orders/orders.module';
// import { PrismaModule } from 'src/prisma/prisma.module';
// import { StoresModule } from 'src/stores/stores.module';
// import { AuthModule } from 'src/users/auth/auth.module';
// import { ReviewsController } from './reviews.controller';
// import { ReviewsModule } from './reviews.module';
// import { ReviewsRepository } from './reviews.repository';
// import { ReviewsService } from './reviews.service';

// describe('ReviewsModule', () => {
//   let reviewsModule: ReviewsModule;
//   let module: TestingModule;

//   beforeEach(async () => {
//     module = await Test.createTestingModule({
//       imports: [
//         PrismaModule,
//         AuthModule,
//         OrdersModule,
//         StoresModule,
//         ReviewsModule,
//       ],
//     }).compile();

//     reviewsModule = module.get<ReviewsModule>(ReviewsModule);
//   });

//   it('should be defined', () => {
//     expect(reviewsModule).toBeDefined();
//   });

//   it('프로바이더로 ReviewsService가 있어야 함.', () => {
//     expect(module.get<ReviewsService>(ReviewsService)).toBeDefined();
//   });

//   it('프로바이더로 ReviewsRepository가 있어야 함.', () => {
//     expect(module.get<ReviewsRepository>(ReviewsRepository)).toBeDefined();
//   });

//   it('Controller에 ReviewsController가 있어야 함.', () => {
//     expect(module.get<ReviewsController>(ReviewsController)).toBeDefined();
//   });
// });
