import bcrypt from 'bcryptjs';
import clientPromise from './mongodb';

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

export async function createUser(email: string, password: string, name: string) {
  const client = await clientPromise;
  const db = client.db('Colloq');
  
  const existingUser = await db.collection('users').findOne({ email });
  
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  const hashedPassword = await hashPassword(password);
  
  const result = await db.collection('users').insertOne({
    email,
    password: hashedPassword,
    name,
    createdAt: new Date(),
  });
  
  return result;
}

export async function getUserByEmail(email: string) {
  const client = await clientPromise;
  const db = client.db('Colloq');
  return await db.collection('users').findOne({ email });
}
