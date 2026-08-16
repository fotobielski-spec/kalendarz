import crypto from 'node:crypto';
import type { PrismaClient } from '@prisma/client';
import type { SessionStatus } from '@dokumenty-id/shared';

export type SessionRecord = {
  id: string;
  qrToken: string;
  status: SessionStatus;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type UploadRecord = {
  id: string;
  sessionId: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: Date;
};

export type SessionWithUploads = SessionRecord & {
  uploads: UploadRecord[];
};

type PrismaSessionShape = {
  id: string;
  qrToken: string;
  status: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

type PrismaUploadShape = {
  id: string;
  sessionId: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: Date;
};

export type CreateSessionInput = {
  qrToken: string;
  expiresAt: Date;
  status: SessionStatus;
};

export type CreateUploadInput = {
  sessionId: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
};

export interface SessionStore {
  createSession(input: CreateSessionInput): Promise<SessionRecord>;
  findSessionById(sessionId: string): Promise<SessionWithUploads | null>;
  findSessionByToken(qrToken: string): Promise<SessionWithUploads | null>;
  updateSessionStatus(sessionId: string, status: SessionStatus): Promise<void>;
  createUpload(input: CreateUploadInput): Promise<UploadRecord>;
}

export class InMemorySessionStore implements SessionStore {
  private readonly sessions = new Map<string, SessionRecord>();
  private readonly sessionsByToken = new Map<string, string>();
  private readonly uploadsBySession = new Map<string, UploadRecord[]>();

  async createSession(input: CreateSessionInput): Promise<SessionRecord> {
    const now = new Date();
    const session: SessionRecord = {
      id: crypto.randomUUID(),
      qrToken: input.qrToken,
      status: input.status,
      expiresAt: input.expiresAt,
      createdAt: now,
      updatedAt: now,
    };
    this.sessions.set(session.id, session);
    this.sessionsByToken.set(session.qrToken, session.id);
    this.uploadsBySession.set(session.id, []);
    return session;
  }

  async findSessionById(sessionId: string): Promise<SessionWithUploads | null> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }
    return {
      ...session,
      uploads: [...(this.uploadsBySession.get(sessionId) ?? [])],
    };
  }

  async findSessionByToken(qrToken: string): Promise<SessionWithUploads | null> {
    const sessionId = this.sessionsByToken.get(qrToken);
    if (!sessionId) {
      return null;
    }
    return this.findSessionById(sessionId);
  }

  async updateSessionStatus(sessionId: string, status: SessionStatus): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }
    this.sessions.set(sessionId, {
      ...session,
      status,
      updatedAt: new Date(),
    });
  }

  async createUpload(input: CreateUploadInput): Promise<UploadRecord> {
    const upload: UploadRecord = {
      id: crypto.randomUUID(),
      sessionId: input.sessionId,
      storageKey: input.storageKey,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      createdAt: new Date(),
    };
    const uploads = this.uploadsBySession.get(input.sessionId) ?? [];
    uploads.push(upload);
    this.uploadsBySession.set(input.sessionId, uploads);
    return upload;
  }
}

export class PrismaSessionStore implements SessionStore {
  constructor(private readonly prisma: PrismaClient) {}

  private toSessionRecord(session: PrismaSessionShape): SessionRecord {
    return {
      id: session.id,
      qrToken: session.qrToken,
      status: session.status as SessionStatus,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }

  private toUploadRecord(upload: PrismaUploadShape): UploadRecord {
    return {
      id: upload.id,
      sessionId: upload.sessionId,
      storageKey: upload.storageKey,
      mimeType: upload.mimeType,
      sizeBytes: upload.sizeBytes,
      createdAt: upload.createdAt,
    };
  }

  async createSession(input: CreateSessionInput): Promise<SessionRecord> {
    const session = await this.prisma.captureSession.create({
      data: {
        qrToken: input.qrToken,
        status: input.status,
        expiresAt: input.expiresAt,
      },
    });
    return this.toSessionRecord(session);
  }

  async findSessionById(sessionId: string): Promise<SessionWithUploads | null> {
    const session = await this.prisma.captureSession.findUnique({
      where: { id: sessionId },
      include: {
        uploads: true,
      },
    });
    if (!session) {
      return null;
    }
    return {
      ...this.toSessionRecord(session),
      uploads: session.uploads.map((upload: PrismaUploadShape) => this.toUploadRecord(upload)),
    };
  }

  async findSessionByToken(qrToken: string): Promise<SessionWithUploads | null> {
    const session = await this.prisma.captureSession.findUnique({
      where: { qrToken },
      include: {
        uploads: true,
      },
    });
    if (!session) {
      return null;
    }
    return {
      ...this.toSessionRecord(session),
      uploads: session.uploads.map((upload: PrismaUploadShape) => this.toUploadRecord(upload)),
    };
  }

  async updateSessionStatus(sessionId: string, status: SessionStatus): Promise<void> {
    await this.prisma.captureSession.update({
      where: { id: sessionId },
      data: { status },
    });
  }

  async createUpload(input: CreateUploadInput): Promise<UploadRecord> {
    const upload = await this.prisma.captureUpload.create({
      data: {
        sessionId: input.sessionId,
        storageKey: input.storageKey,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes,
      },
    });
    return this.toUploadRecord(upload);
  }
}
