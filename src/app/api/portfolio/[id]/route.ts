// app/api/portfolio/[id]/route.ts
import { NextResponse } from 'next/server';
import { getPortfolioByIdUseCase } from '@/usecases/getPortfolioByIdUseCase';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const portfolio = await getPortfolioByIdUseCase(id);

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfólio não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}


