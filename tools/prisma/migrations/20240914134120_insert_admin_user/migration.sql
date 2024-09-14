-- Insert user
INSERT INTO "User" ("id", "name", "picture", "username", "email", "locale", "emailVerified", "twoFactorEnabled", "subscriptionId", "paymentUserId", "createdAt", "updatedAt", "provider", "role")
VALUES (1, 'admin', '', 'admin', 'admin@gmail.com', 'en-US', true, false, '', '', Now(), Now(), 'email', 'admin');

-- Insert user secret
INSERT INTO "Secrets" ("id", "password", "lastSignedIn", "verificationToken", "twoFactorSecret", "twoFactorBackupCodes", "refreshToken", "resetToken", "userId")
VALUES (1, '$2a$10$uG25ka1Vlx3fUTWraDW4a.So.7sCB51mczTdniVBi9uDvXIspZsJO', Now(), '', '', '{}', '', '', '1');