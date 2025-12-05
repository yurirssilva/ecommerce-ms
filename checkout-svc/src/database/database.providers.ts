import mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'MONGO_CONNECTION',
    useFactory: async () => {
      const url = process.env.MONGO_URL || 'mongodb://localhost:27018/checkoutdb';

      const connection = await mongoose.connect(url);

      console.log('Mongoose connected');

      return connection;
    },
  },
];