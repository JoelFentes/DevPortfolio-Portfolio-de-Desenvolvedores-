import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

async function getUserIdFromRequest() {
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;

  try {
    const payload = verifyToken(token);
    if (!payload || typeof payload === 'string' || typeof payload.email !== 'string') {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { id: true },
    });

    return user?.id ?? null;
  } catch {
    return null;
  }
}

export async function GET() {
  const token = (await cookies()).get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });

  try {
    const payload = verifyToken(token);
    if (!payload || typeof payload === 'string' || typeof payload.email !== 'string') {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true, // aqui o campo do profile picture
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const { id, ...publicUser } = user;
    const portfolio = await prisma.portfolio.findFirst({ where: { userId: id } });

    return NextResponse.json({ user: publicUser, portfolio });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const userId = await getUserIdFromRequest();
  if (!userId) {
    return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
  }

  const data = await request.json();
  const { profilePicture, name } = data;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(profilePicture && { profilePicture }),
        ...(name && { name }),
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
