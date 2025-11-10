import { Id } from "../../convex/_generated/dataModel";

export interface User {
  _id: Id<"users">;
  email: string;
  name: string;
  avatar?: string;
}

export interface Post {
  _id: Id<"posts">;
  userId: Id<"users">;
  content: string;
  imageUrl?: string;
  imageStorageId?: Id<"_storage">;
  createdAt: number;
  user?: {
    name: string;
    avatar?: string;
  } | null;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  CreatePost: undefined;
  Profile: undefined;
};
