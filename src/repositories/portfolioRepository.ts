import { prisma } from '@/lib/db';


export interface PortfolioData {
  name: string;
  bio: string;
  stacks?: string[];
  github?: string;
  linkedin?: string;
  email: string;
  website?: string;
  techList?: string[];
  experience?: string;
  projectTitle?: string;
  projectDescription?: string;
  projectLink?: string;
  projectImage?: string;
}

export class PortfolioRepository {
  private normalizeData(data: PortfolioData) {
    return {
      name: data.name,
      bio: data.bio,
      email: data.email,
      stacks: data.stacks ?? [],
      github: data.github ?? '',
      linkedin: data.linkedin ?? '',
      website: data.website ?? '',
      techList: data.techList ?? [],
      experience: data.experience ?? '',
      projectTitle: data.projectTitle ?? '',
      projectDescription: data.projectDescription ?? '',
      projectLink: data.projectLink ?? '',
      projectImage: data.projectImage ?? '',
    };
  }

  async findByUserId(userId: string) {
    return prisma.portfolio.findFirst({
      where: { userId },
    });
  }

  async create(userId: string, data: PortfolioData) {
    const normalizedData = this.normalizeData(data);
    return prisma.portfolio.create({
      data: {
        userId,
        ...normalizedData,
      },
    });
  }

  async update(id: string, data: PortfolioData) {
    const normalizedData = this.normalizeData(data);
    return prisma.portfolio.update({
      where: { id },
      data: normalizedData,
    });
  }

  async findAll() {
    return prisma.portfolio.findMany({
      include: { user: { select: { name: true, profilePicture: true } } },
      orderBy: { updatedAt: "desc" },
    });
  }

  async getById(id: string) {
  return prisma.portfolio.findUnique({
  where: { id },
  include: { user: { select: { name: true, profilePicture: true } } },
});

}


}

export const portfolioRepository = new PortfolioRepository();
