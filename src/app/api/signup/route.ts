import { NextResponse } from 'next/server';
import { createUser } from '../../lib/auth';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    console.log('🔵 Signup attempt:', { name, email });

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const result = await createUser(email, password, name);
    
    console.log('✅ User created successfully:', result.insertedId);

    return NextResponse.json(
      { message: 'User created successfully', userId: result.insertedId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Signup error:', error.message);
    return NextResponse.json(
      { message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
