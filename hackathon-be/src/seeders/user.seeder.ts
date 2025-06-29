import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function seedUsers() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    console.log('Starting user seeding...');
    await usersService.seedUsers();
    console.log('Users seeded successfully!');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await app.close();
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedUsers();
}
