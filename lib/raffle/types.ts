export type Rank = 1 | 2 | 3 | 4 | 5;

export type RankedPick = {
  contestantId: string;
  rank: Rank;
};

export type TicketStatus = "pending" | "confirmed";

export type Ticket = {
  id: string;
  picks: RankedPick[];
  total: number;
  status: TicketStatus;
  createdAt: string;
  confirmedAt?: string | null;
};

export type PublishedResults = {
  picks: RankedPick[];
  publishedAt: string;
};

export type WinnerTicket = {
  ticketId: string;
  score: number;
  prizeShare: number;
};

export type MyTicketScore = {
  ticketId: string;
  score: number;
};

export const MAX_TICKET_SCORE = 5;
