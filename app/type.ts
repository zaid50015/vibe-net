import { Member, Profile, Server } from "@prisma/client";

// {
//   "id": 1,
//   "name": "Example Server",
//   "createdAt": "2025-02-20T12:34:56.789Z",
//   "updatedAt": "2025-02-21T12:34:56.789Z",
//   "members": [
//     {
//       "id": 101,
//       "serverId": 1,
//       "userId": 201,
//       "joinedAt": "2025-02-20T12:34:56.789Z",
//       "profile": {
//         "id": 201,
//         "username": "exampleUser",
//         "avatarUrl": "https://example.com/avatar.jpg",
//         "bio": "This is an example user profile.",
//         "createdAt": "2025-02-19T12:34:56.789Z",
//         "updatedAt": "2025-02-21T12:34:56.789Z"
//       }
//     },
//     {
//       "id": 102,
//       "serverId": 1,
//       "userId": 202,
//       "joinedAt": "2025-02-20T12:34:56.789Z",
//       "profile": {
//         "id": 202,
//         "username": "anotherUser",
//         "avatarUrl": "https://example.com/avatar2.jpg",
//         "bio": "This is another example user profile.",
//         "createdAt": "2025-02-19T12:34:56.789Z",
//         "updatedAt": "2025-02-21T12:34:56.789Z"
//       }
//     }
//   ]
// }
export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};