export interface FrontMatter {
  title: string;
  author: string;
  date: string;
  club: string;
  heading: string;
  thumbnail?: string;
}

export interface Post extends FrontMatter {
  slug: string;
  content: string;
}