export enum RoomType {
  SINGLE = "SINGLE",
  DOUBLE = "DOUBLE",
  DELUXE = "DELUXE",
  SUITE = "SUITE"
}

export interface JavaFile {
  path: string;
  name: string;
  code: string;
  description: string;
}

export interface MentorMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
