export interface Project {
  name: string
  photo: string
  link: string
}

export interface Post {
  id: string
  project: Project
  caption: string
  imageUrl?: string
  createdAt: string
}
