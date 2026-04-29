import { connectDb, disconnectDb } from '../config/db.js';
import User from '../models/user.model.js';

const adminCredentials = {
  name: 'Admin',
  email: 'admin@admin.com',
  password: 'Admin@123',
  role: 'admin'
};

const seedAdmin = async () => {
  try {
    await connectDb();

    let admin = await User.findOne({ email: adminCredentials.email }).select('+password');

    if (admin) {
      admin.name = adminCredentials.name;
      admin.password = adminCredentials.password;
      admin.role = adminCredentials.role;
      await admin.save();
      console.log('Admin user updated successfully');
    } else {
      admin = await User.create(adminCredentials);
      console.log('Admin user created successfully');
    }

    console.log('Admin login credentials');
    console.log(`Email: ${adminCredentials.email}`);
    console.log(`Password: ${adminCredentials.password}`);
  } catch (error) {
    console.error('Admin seed failed');
    console.error(error.message || error);
    process.exitCode = 1;
  } finally {
    await disconnectDb();
  }
};

seedAdmin();
