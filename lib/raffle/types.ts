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
