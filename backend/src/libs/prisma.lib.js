/**
 * Prisma client instance
 *
 * Provides a singleton instance of PrismaClient for database operations throughout the backend application.
 *
 * Exports:
 *   - prisma: The PrismaClient instance
 */

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();