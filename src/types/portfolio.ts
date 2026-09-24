export interface Portfolio {
  id: string;
  name: string;
  bio: string;
  stacks: string[];
  techList: string[];
  experience?: string;
  projectTitle?: string;
  projectDescription?: string;
  projectLink?: string;
  projectImage?: string | null;
  github?: string | null;
  linkedin?: string | null;
  website?: string | null;
  user?: {
    name?: string;
    profilePicture?: string | null;
  };
}

export function displayName(p: Portfolio) {
  return p.user?.name || p.name;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}
