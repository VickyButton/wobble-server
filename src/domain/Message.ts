// A message belongs to a user and a room
export interface Message {
  parentId?: string; // The ID of the message being replied to, if a reply
  userId: string; // The ID of the user which the message was published by
  roomId: string; // The ID of the room which the message was posted in
  id: string;
  body: string;
  createdAt: number;
  updatedAt: number;
}
