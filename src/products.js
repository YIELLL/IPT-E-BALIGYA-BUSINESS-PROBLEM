const photos = import.meta.glob('./Photo/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
  query: '?url'
});

const regionalPasalubong = [
  {
    code: 'ncr',
    region: 'NCR',
    island: 'Luzon',
    province: 'Metro Manila',
    photoFolder: 'National Capital Region (NCR)',
    items: [
      ['Eng Bee Tin Hopia', 'Eng Bee Tin Hopia.webp', 240],
      ['Goldilocks Red Ribbon Polvoron', 'Goldilocks Red Ribbon Polvoron.jpg', 180],
      ['Mary Grace Ensaymada', 'Mary Grace Ensaymada.png', 360]
    ]
  },
  {
    code: 'car',
    region: 'CAR',
    island: 'Luzon',
    province: 'Cordillera Administrative Region',
    photoFolder: 'Cordillera Administrative Region (CAR)',
    items: [
      ['Baguio Country Club Raisin Bread', 'Baguio Country Club Raisin Bread.jpg', 320],
      ['Good Shepherd Ube Jam', 'Good Shepherd Ube Jam.webp', 380],
      ['Lengua de Gato', 'Lengua de Gato.jpg', 190]
    ]
  },
  {
    code: 'region-i',
    region: 'Region I',
    island: 'Luzon',
    province: 'Ilocos Region',
    photoFolder: 'Region I (Ilocos Region)',
    items: [
      ['Bagnet', 'Bagnet.jpg', 520],
      ['Royal Bibingka', 'Royal Bibingka.jpg', 210],
      ['Vigan Longganisa', 'Vigan Longganisa.jpg', 280]
    ]
  },
  {
    code: 'region-ii',
    region: 'Region II',
    island: 'Luzon',
    province: 'Cagayan Valley',
    photoFolder: 'Region II (Cagayan Valley)',
    items: [
      ['Alcala Milk Candy', 'Alcala Milk Candy.jpg', 190],
      ['Chicharabao', 'Chicharabao.jpg', 180],
      ['Piat Ybanag Candy', 'Piat Ybanag Candy.jpg', 170]
    ]
  },
  {
    code: 'region-iii',
    region: 'Region III',
    island: 'Luzon',
    province: 'Central Luzon',
    photoFolder: 'Region III (Central Luzon)',
    items: [
      ['Pastillas de Leche', 'Pastillas de Leche.webp', 180],
      ['Sasmuan Polvoron', 'Sasmuan Polvoron.jpg', 220],
      ['Tibok-Tibok', 'Tibok-Tibok.jpg', 200]
    ]
  },
  {
    code: 'region-iv-a',
    region: 'Region IV-A',
    island: 'Luzon',
    province: 'CALABARZON',
    photoFolder: 'Region IV-A (CALABARZON)',
    items: [
      ['Buko Pie', 'Buko Pie.jpg', 340],
      ['Espasol', 'Espasol.jpg', 180],
      ['Masiram Chicharon', 'Masiram Chicharon.jpg', 230]
    ]
  },
  {
    code: 'region-iv-b',
    region: 'Region IV-B',
    island: 'Luzon',
    province: 'MIMAROPA',
    photoFolder: 'Region IV-B (MIMAROPA)',
    items: [
      ['Arrowroot Cookies', 'Arrowroot Cookies.jpg', 190],
      ["Baker's Hill Hopia", "Baker's Hill Hopia.jpg", 310],
      ['Cashew Nuts', 'Cashew Nuts.jpg', 350]
    ]
  },
  {
    code: 'region-v',
    region: 'Region V',
    island: 'Luzon',
    province: 'Bicol Region',
    photoFolder: 'Region V (Bicol Region)',
    items: [
      ['Bicol Express in Jars', 'Bicol Express in Jars.webp', 360],
      ['Pili Nut Candies', 'Pili Nut Candies.jpg', 390],
      ['Toasted Siopao', 'Toasted Siopao.jpg', 180]
    ]
  },
  {
    code: 'region-vi',
    region: 'Region VI',
    island: 'Visayas',
    province: 'Western Visayas',
    photoFolder: 'Region VI (Western Visayas)',
    items: [
      ['Barquillos & Barquiron', 'Barquillos & Barquiron.webp', 210],
      ['Biscocho', 'Biscocho.jpg', 190],
      ['MERZCI Piaya', 'MERZCI Piaya.jpg', 230]
    ]
  },
  {
    code: 'region-vii',
    region: 'Region VII',
    island: 'Visayas',
    province: 'Central Visayas',
    photoFolder: 'Region VII (Central Visayas)',
    items: [
      ['Dried Mangoes', 'Dried Mangoes.jpg', 340],
      ['Otap', 'Otap.jpg', 190],
      ['Peanut Kisses', 'Peanut Kisses.jpg', 220]
    ]
  },
  {
    code: 'region-viii',
    region: 'Region VIII',
    island: 'Visayas',
    province: 'Eastern Visayas',
    photoFolder: 'Region VIII (Eastern Visayas)',
    items: [
      ['Binagol', 'Binagol.jpg', 290],
      ['Chocolate Moron', 'Chocolate Moron.jpg', 220],
      ['Salukara', 'Salukara.jpg', 180]
    ]
  },
  {
    code: 'region-ix',
    region: 'Region IX',
    island: 'Mindanao',
    province: 'Zamboanga Peninsula',
    photoFolder: 'Region IX (Zamboanga Peninsula)',
    items: [
      ['Alavar Sauce', 'Alavar Sauce.jpg', 360],
      ['Dried Seafood', 'Dried Seafood.jpg', 300],
      ['Lokot-Lokot', 'Lokot-Lokot.webp', 210]
    ]
  },
  {
    code: 'region-x',
    region: 'Region X',
    island: 'Mindanao',
    province: 'Northern Mindanao',
    photoFolder: 'Region X (Northern Mindanao)',
    items: [
      ['Cagayan de Oro Ham', 'Cagayan de Oro Ham.jpg', 450],
      ['Cheding’s Toasted Peanuts', 'Cheding’s Toasted Peanuts.jpg', 240],
      ['Vjandep Pastel', 'Vjandep Pastel.webp', 310]
    ]
  },
  {
    code: 'region-xi',
    region: 'Region XI',
    island: 'Mindanao',
    province: 'Davao Region',
    photoFolder: 'Region XI (Davao Region)',
    items: [
      ['Lola Abon’s Durian Candies', 'Lola Abon’s Durian Candies.jpg', 260],
      ['Malagos Dark Chocolate', 'Malagos Dark Chocolate.webp', 380]
    ]
  },
  {
    code: 'region-xii',
    region: 'Region XII',
    island: 'Mindanao',
    province: 'SOCCSKSARGEN',
    photoFolder: 'Region XII (SOCCSKSARGEN)',
    items: [
      ['Durian Chips', 'Durian Chips.jpg', 220],
      ['Frozen Processed Tuna Cuts', 'Frozen Processed Tuna Cuts.webp', 390],
      ['Tuna Chicharon', 'Tuna Chicharon.webp', 290]
    ]
  },
  {
    code: 'region-xiii',
    region: 'Region XIII',
    island: 'Mindanao',
    province: 'Caraga Region',
    photoFolder: 'Region XIII (Caraga Region)',
    items: [
      ['Banana Chips', 'Banana Chips.jpg', 170],
      ['Danggit', 'Danggit.png', 260],
      ['Sayongsong', 'Sayongsong.avif', 200]
    ]
  },
  {
    code: 'barmm',
    region: 'BARMM',
    island: 'Mindanao',
    province: 'Bangsamoro Autonomous Region',
    photoFolder: 'BARMM (Bangsamoro Autonomous Region)',
    items: [
      ['Dodol', 'Dodol.jpg', 220],
      ['Kumukunsi', 'Kumukunsi.jpg', 190],
      ['Palapa (Marawi)', 'Palapa (Marawi).jpg', 250]
    ]
  }
];

const getPhotoUrl = (photoFolder, fileName) => {
  const photoPath = `./Photo/${photoFolder}/${fileName}`;
  const photoUrl = photos[photoPath];
  if (!photoUrl) {
    throw new Error(`Missing pasalubong photo: ${photoPath}`);
  }
  return photoUrl;
};

export const pasalubongItems = regionalPasalubong.flatMap((group) =>
  group.items.map(([name, fileName, price], index) => ({
    id: `${group.code}-${index + 1}`,
    name,
    maker: '',
    region: group.region,
    island: group.island,
    province: group.province,
    price,
    rating: 0,
    reviewCount: 0,
    stock: 20,
    badge: '',
    image: getPhotoUrl(group.photoFolder, fileName),
    description: `${name} from ${group.province}.`
  }))
);

export const delicacies = pasalubongItems;
