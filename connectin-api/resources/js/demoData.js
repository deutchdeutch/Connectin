export const demoPosts = [
  {
    id: 1,
    content: "Bienvenue sur Connect'in ! ",
    user: { id: 1, name: "Admin", avatar: null },
    likes_count: 12,
    comments_count: 3,
    comments: [
      { id: 1, content: "Super !", user: { name: "User1" } }
    ],
    created_at: "2024-01-01"
  }
];

export const demoUsers = [
  { id: 1, first_name: "Marie", last_name: "Dupont", email: "marie@test.com" },
  { id: 2, first_name: "Pierre", last_name: "Martin", email: "pierre@test.com" }
];