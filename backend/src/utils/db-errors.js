// Shared Prisma/Postgres error detection used by service delete/update paths.
// P2003 is the standard Prisma foreign key violation code, but Postgres 23001
// (RESTRICT violation, seen on Neon) surfaces as an unknown error, so the
// message is checked as well.
function isForeignKeyViolation(error) {
  return (
    error.code === "P2003" ||
    /violates (RESTRICT setting of )?foreign key/i.test(error.message || "")
  );
}

// P2002 is the unique constraint violation code (e.g. duplicate resource name).
function isUniqueConstraintViolation(error) {
  return error.code === "P2002";
}

module.exports = { isForeignKeyViolation, isUniqueConstraintViolation };
