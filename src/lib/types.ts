export interface FrontMatter {
  title: string;
  author: string;
  date: string;
  category: string;
  tags: string;
  heading: string;
  thumbnail?: string;
}

export interface Post extends FrontMatter {
  slug: string;
  content: string;
}