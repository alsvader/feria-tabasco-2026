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
    image: "/images/balancan.jpeg",
  },
  {
    id: "c02",
    name: "Valeria Gallegos Rosique",
    ciudad: "Cárdenas",
    bio: "Embajadora municipal de Cárdenas en la Feria Tabasco 2026.",
    image: "/images/cardenas.jpeg",
  },
  {
    id: "c03",
    name: "Carlota Mariel Díaz Mayo",
    ciudad: "Centla",
    bio: "Embajadora municipal de Centla en la Feria Tabasco 2026.",
    image: "/images/centla.jpeg",
  },
  {
    id: "c04",
    name: "Montserrat Contreras Ponce",
    ciudad: "Centro",
    bio: "Embajadora municipal de Centro en la Feria Tabasco 2026.",
    image: "/images/centro.jpeg",
  },
  {
    id: "c05",
    name: "Giselle Ovando Alamilla",
    ciudad: "Comalcalco",
    bio: "Embajadora municipal de Comalcalco en la Feria Tabasco 2026.",
    image: "/images/comalcalco.jpeg",
  },
  {
    id: "c06",
    name: "Ilsa Valeria Sánchez Zardoni",
    ciudad: "Cunduacán",
    bio: "Embajadora municipal de Cunduacán en la Feria Tabasco 2026.",
    image: "/images/cunduacan.jpeg",
  },
  {
    id: "c07",
    name: "Mariú Mendoza Cabrera",
    ciudad: "Emiliano Zapata",
    bio: "Embajadora municipal de Emiliano Zapata en la Feria Tabasco 2026.",
    image: "/images/emiliano-zapata.jpeg",
  },
  {
    id: "c08",
    name: "Marijose Rodríguez David",
    ciudad: "Huimanguillo",
    bio: "Embajadora municipal de Huimanguillo en la Feria Tabasco 2026.",
    image: "/images/huimanguillo.jpeg",
  },
  {
    id: "c09",
    name: "Guadalupe Zagal Oropeza",
    ciudad: "Jalapa",
    bio: "Embajadora municipal de Jalapa en la Feria Tabasco 2026.",
    image: "/images/jalapa.jpeg",
  },
  {
    id: "c10",
    name: "María Fernanda López Campos",
    ciudad: "Jalpa de Méndez",
    bio: "Embajadora municipal de Jalpa de Méndez en la Feria Tabasco 2026.",
    image: "/images/jalpa-de-mendez.jpeg",
  },
  {
    id: "c11",
    name: "Regina Alejandra Filigrana Montes de Oca",
    ciudad: "Jonuta",
    bio: "Embajadora municipal de Jonuta en la Feria Tabasco 2026.",
    image: "/images/jonuta.jpeg",
  },
  {
    id: "c12",
    name: "Regina Colín Vivas",
    ciudad: "Macuspana",
    bio: "Embajadora municipal de Macuspana en la Feria Tabasco 2026.",
    image: "/images/macuspana.jpeg",
  },
  {
    id: "c13",
    name: "Emily de la Cruz Ramón",
    ciudad: "Nacajuca",
    bio: "Embajadora municipal de Nacajuca en la Feria Tabasco 2026.",
    image: "/images/nacajuca.jpeg",
  },
  {
    id: "c14",
    name: "Frida Daniela Vázquez Hernández",
    ciudad: "Paraíso",
    bio: "Embajadora municipal de Paraíso en la Feria Tabasco 2026.",
    image: "/images/paraiso.jpeg",
  },
  {
    id: "c15",
    name: "María José Hernández Vera",
    ciudad: "Tacotalpa",
    bio: "Embajadora municipal de Tacotalpa en la Feria Tabasco 2026.",
    image: "/images/tacotalpa.jpeg",
  },
  {
    id: "c16",
    name: "Valeria Dagdug Prats",
    ciudad: "Teapa",
    bio: "Embajadora municipal de Teapa en la Feria Tabasco 2026.",
    image: "/images/teapa.jpeg",
  },
  {
    id: "c17",
    name: "Natalia Montilla Tager",
    ciudad: "Tenosique",
    bio: "Embajadora municipal de Tenosique en la Feria Tabasco 2026.",
    image: "/images/tenosique.jpeg",
  },
];

export function findContestant(id: string): Contestant | undefined {
  return contestants.find((c) => c.id === id);
}
