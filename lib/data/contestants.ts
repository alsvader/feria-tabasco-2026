export type Contestant = {
  id: string;
  name: string;
  ciudad: string;
  bio: string;
  image: string;
};

// Seed source — do not import `contestants` or `findContestant` in app code.
// The app reads from Supabase via `lib/data/contestants-server.ts`.
// This file feeds `scripts/seed-contestants.ts`.
export const contestants: Contestant[] = [
  {
    id: "c01",
    name: "Ana Paola Jáuregui López",
    ciudad: "Balancán",
    bio: "Embajadora municipal de Balancán en la Feria Tabasco 2026.",
    image: "https://picsum.photos/seed/feria-tab-01/640/800",
  },
  {
    id: "c02",
    name: "Valeria Gallegos Rosique",
    ciudad: "Cárdenas",
    bio: "Embajadora municipal de Cárdenas en la Feria Tabasco 2026.",
    image: "https://picsum.photos/seed/feria-tab-02/640/800",
  },
  {
    id: "c03",
    name: "Carlota Mariel Díaz Mayo",
    ciudad: "Centla",
    bio: "Embajadora municipal de Centla en la Feria Tabasco 2026.",
    image: "https://picsum.photos/seed/feria-tab-03/640/800",
  },
  {
    id: "c04",
    name: "Montserrat Contreras Ponce",
    ciudad: "Centro",
    bio: "Embajadora municipal de Centro en la Feria Tabasco 2026.",
    image: "https://picsum.photos/seed/feria-tab-04/640/800",
  },
  {
    id: "c05",
    name: "Giselle Ovando Alamilla",
    ciudad: "Comalcalco",
    bio: "Embajadora municipal de Comalcalco en la Feria Tabasco 2026.",
    image: "https://picsum.photos/seed/feria-tab-05/640/800",
  },
  {
    id: "c06",
    name: "Ilsa Valeria Sánchez Zardoni",
    ciudad: "Cunduacán",
    bio: "Embajadora municipal de Cunduacán en la Feria Tabasco 2026.",
    image: "https://picsum.photos/seed/feria-tab-06/640/800",
  },
  {
    id: "c07",
    name: "Mariú Mendoza Cabrera",
    ciudad: "Emiliano Zapata",
    bio: "Embajadora municipal de Emiliano Zapata en la Feria Tabasco 2026.",
    image: "https://picsum.photos/seed/feria-tab-07/640/800",
  },
  {
    id: "c08",
    name: "Marijose Rodríguez David",
    ciudad: "Huimanguillo",
    bio: "Embajadora municipal de Huimanguillo en la Feria Tabasco 2026.",
    image: "https://picsum.photos/seed/feria-tab-08/640/800",
  },
  {
    id: "c09",
    name: "Guadalupe Zagal Oropeza",
    ciudad: "Jalapa",
    bio: "Embajadora municipal de Jalapa en la Feria Tabasco 2026.",
    image: "https://picsum.photos/seed/feria-tab-09/640/800",
  },
  {
    id: "c10",
    name: "María Fernanda López Campos",
    ciudad: "Jalpa de Méndez",
    bio: "Embajadora municipal de Jalpa de Méndez en la Feria Tabasco 2026.",
    image: "https://picsum.photos/seed/feria-tab-10/640/800",
  },
  {
    id: "c11",
    name: "Regina Alejandra Filigrana Montes de Oca",
    ciudad: "Jonuta",
    bio: "Embajadora municipal de Jonuta en la Feria Tabasco 2026.",
    image: "https://picsum.photos/seed/feria-tab-11/640/800",
  },
  {
    id: "c12",
    name: "Regina Colín Vivas",
    ciudad: "Macuspana",
    bio: "Embajadora municipal de Macuspana en la Feria Tabasco 2026.",
    image: "https://picsum.photos/seed/feria-tab-12/640/800",
  },
  {
    id: "c13",
    name: "Emily de la Cruz Ramón",
    ciudad: "Nacajuca",
    bio: "Embajadora municipal de Nacajuca en la Feria Tabasco 2026.",
    image: "https://picsum.photos/seed/feria-tab-13/640/800",
  },
  {
    id: "c14",
    name: "Frida Daniela Vázquez Hernández",
    ciudad: "Paraíso",
    bio: "Embajadora municipal de Paraíso en la Feria Tabasco 2026.",
    image: "https://picsum.photos/seed/feria-tab-14/640/800",
  },
  {
    id: "c15",
    name: "María José Hernández Vera",
    ciudad: "Tacotalpa",
    bio: "Embajadora municipal de Tacotalpa en la Feria Tabasco 2026.",
    image: "https://picsum.photos/seed/feria-tab-15/640/800",
  },
  {
    id: "c16",
    name: "Valeria Dagdug Prats",
    ciudad: "Teapa",
    bio: "Embajadora municipal de Teapa en la Feria Tabasco 2026.",
    image: "https://picsum.photos/seed/feria-tab-16/640/800",
  },
  {
    id: "c17",
    name: "Natalia Montilla Tager",
    ciudad: "Tenosique",
    bio: "Embajadora municipal de Tenosique en la Feria Tabasco 2026.",
    image: "https://picsum.photos/seed/feria-tab-17/640/800",
  },
];

export function findContestant(id: string): Contestant | undefined {
  return contestants.find((c) => c.id === id);
}
