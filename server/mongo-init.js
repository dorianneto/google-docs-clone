db.createUser({
  user: "bar",
  pwd: "secret2",
  roles: [
    {
      role: "readWrite",
      db: "google-docs-clone",
    },
  ],
});
