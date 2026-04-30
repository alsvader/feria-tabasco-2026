export type Contestant = {
  id: string;
  name: string;
  ciudad: string;
  bio: string;
  image: string;
};

// Placeholder photos via picsum.photos with stable seeds.
// Names and cities reflect Tabasco municipios — replace with real data when available.
export const contestants: Contestant[] = [
  {
    id: "c01",
    name: "Camila Hernández Pellicer",
    ciudad: "Villahermosa",
    bio: "Estudiante de Comunicación, embajadora cultural.",
    image: "https://picsum.photos/seed/feria-tab-01/640/800"
  },
  {
    id: "c02",
    name: "Renata Ovando Magaña",
    ciudad: "Cárdenas",
    bio: "Promotora de la danza folclórica chontal.",
    image: "https://picsum.photos/seed/feria-tab-02/640/800"
  },
  {
    id: "c03",
    name: "Valeria Sastré Beltrán",
    ciudad: "Comalcalco",
    bio: "Defensora del cacao tabasqueño y turismo rural.",
    image: "https://picsum.photos/seed/feria-tab-03/640/800"
  },
  {
    id: "c04",
    name: "Isabela Priego Cámara",
    ciudad: "Huimanguillo",
    bio: "Bióloga marina, protectora de manglares.",
    image: "https://picsum.photos/seed/feria-tab-04/640/800"
  },
  {
    id: "c05",
    name: "Andrea Zentella Brindis",
    ciudad: "Macuspana",
    bio: "Gestora cultural y artista visual.",
    image: "https://picsum.photos/seed/feria-tab-05/640/800"
  },
  {
    id: "c06",
    name: "Mariana Cupido Sansores",
    ciudad: "Paraíso",
    bio: "Embajadora gastronómica del pejelagarto.",
    image: "https://picsum.photos/seed/feria-tab-06/640/800"
  },
  {
    id: "c07",
    name: "Sofía Quevedo Trujillo",
    ciudad: "Centla",
    bio: "Voluntaria en reservas de la biósfera Pantanos.",
    image: "https://picsum.photos/seed/feria-tab-07/640/800"
  },
  {
    id: "c08",
    name: "Regina Falconi Aguilera",
    ciudad: "Centro",
    bio: "Estudiante de derecho, oradora estatal.",
    image: "https://picsum.photos/seed/feria-tab-08/640/800"
  },
  {
    id: "c09",
    name: "Fernanda Pinzón Estrada",
    ciudad: "Jalpa de Méndez",
    bio: "Promotora del bordado de gusanito.",
    image: "https://picsum.photos/seed/feria-tab-09/640/800"
  },
  {
    id: "c10",
    name: "Alejandra Madrigal Narváez",
    ciudad: "Nacajuca",
    bio: "Defensora de la lengua yokot'an.",
    image: "https://picsum.photos/seed/feria-tab-10/640/800"
  },
  {
    id: "c11",
    name: "Daniela Pacheco Lizárraga",
    ciudad: "Teapa",
    bio: "Guía turística de las Grutas de Cocona.",
    image: "https://picsum.photos/seed/feria-tab-11/640/800"
  },
  {
    id: "c12",
    name: "Ximena Cobián Rentería",
    ciudad: "Tacotalpa",
    bio: "Embajadora del turismo serrano.",
    image: "https://picsum.photos/seed/feria-tab-12/640/800"
  },
  {
    id: "c13",
    name: "Paulina Argüelles Vidaña",
    ciudad: "Jalapa",
    bio: "Activista por la educación rural.",
    image: "https://picsum.photos/seed/feria-tab-13/640/800"
  },
  {
    id: "c14",
    name: "Lorena Caballero Esquivel",
    ciudad: "Tenosique",
    bio: "Promotora de la danza del pochó.",
    image: "https://picsum.photos/seed/feria-tab-14/640/800"
  },
  {
    id: "c15",
    name: "Ariadna Pellicer Frías",
    ciudad: "Balancán",
    bio: "Estudiante de medicina y modelo regional.",
    image: "https://picsum.photos/seed/feria-tab-15/640/800"
  },
  {
    id: "c16",
    name: "Constanza Olán Mayo",
    ciudad: "Emiliano Zapata",
    bio: "Embajadora ribereña del Usumacinta.",
    image: "https://picsum.photos/seed/feria-tab-16/640/800"
  },
  {
    id: "c17",
    name: "Ivana Rabelo Echeverría",
    ciudad: "Jonuta",
    bio: "Defensora de la pesca artesanal sostenible.",
    image: "https://picsum.photos/seed/feria-tab-17/640/800"
  }
];

export function findContestant(id: string): Contestant | undefined {
  return contestants.find((c) => c.id === id);
}
