import { Entity, Schema } from 'redis-om';
import { redisClient } from '../db/index.js';

class UserRepository extends Entity {}

const userSchema = new Schema(UserRepository, {
  firstName: { type: 'string' },
  lastName: { type: 'string' },
  email: { type: 'string' },
  userName: { type: 'string' },
  createdAt: { type: 'date', sortable: true },
  updatedAt: { type: 'date', sortable: true },
});

const userRepository = redisClient.fetchRepository(userSchema);

await userRepository.createIndex();

export { userRepository };
