export interface WallPost {
  id: string;
  author_name: string;
  body: string;
  created_at: string;
  likes_count?: number;
}

export interface WallProfile {
  name: string;
  status: string;
  network: string;
  relationship: string;
  birthday: string;
  hometown: string;
  avatarUrl: string;
}
