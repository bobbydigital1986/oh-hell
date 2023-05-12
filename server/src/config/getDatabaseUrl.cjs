const getDatabaseUrl = (nodeEnv) => {
  return (
    {
      development: "postgres://postgres:postgres@localhost:5432/oh-hell_development",
      test: "postgres://postgres:postgres@localhost:5432/oh-hell_test",
      e2e: "postgres://postgres:postgres@localhost:5432/oh-hell_e2e",
    }[nodeEnv] || process.env.DATABASE_URL
  );
};

module.exports = getDatabaseUrl;
