module.exports = {
  ci: {
    collect: {
      startServerCommand: "bun nx run frontend:start",
      numberOfRuns: 3,
      url: ["http://127.0.0.1:3000/"]
    },
    upload: {
      target: "temporary-public-storage"
    }
  }
};
