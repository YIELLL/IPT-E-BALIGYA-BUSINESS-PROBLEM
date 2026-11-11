import React, { useEffect, useMemo, useRef, useState } from 'react';
import { delicacies } from './products.js';
import AboutPage from './AboutPage';

const REGION_GROUPS = [
  {
    name: 'Luzon',
    icon: 'fa-mountain',
    regions: [
      ['NCR', 'Metro Manila'],
      ['CAR', 'Cordillera / Benguet'],
      ['Region I', 'Ilocos Region'],
      ['Region II', 'Cagayan Valley / Batanes'],
      ['Region III', 'Central Luzon / Pampanga'],
      ['Region IV-A', 'CALABARZON'],
      ['Region IV-B', 'MIMAROPA'],
      ['Region V', 'Bicol Region']
    ]
  },
  {
    name: 'Visayas',
    icon: 'fa-water',
    regions: [
      ['Region VI', 'Western Visayas / Iloilo'],
      ['Region VII', 'Central Visayas / Cebu'],
      ['Region VIII', 'Eastern Visayas / Leyte']
    ]
  },
  {
    name: 'Mindanao',
    icon: 'fa-leaf',
    regions: [
      ['Region IX', 'Zamboanga Peninsula'],
      ['Region X', 'Northern Mindanao'],
      ['Region XI', 'Davao Region'],
      ['Region XII', 'SOCCSKSARGEN'],
      ['Region XIII', 'Caraga'],
      ['BARMM', 'Bangsamoro']
    ]
  }
];

const ISLANDS = ['ALL', 'Luzon', 'Visayas', 'Mindanao'];
const FALLBACK_IMAGE = 'https://placehold.co/600x400/0b132b/fbbf24?text=E-Baligya+Pasalubong';
const PH_PROVINCES = {
  'Metro Manila': ['Manila', 'Quezon City', 'Makati', 'Pasig', 'Taguig', 'Parañaque', 'Las Piñas', 'Mandaluyong', 'Marikina', 'Caloocan', 'Valenzuela', 'Navotas', 'Malabon', 'San Juan', 'Pateros', 'Muntinlupa'],
  'Abra': ['Bangued', 'Bucloc', 'Dolores', 'La Paz', 'Lagangilang', 'Pidigan', 'San Isidro', 'Tayum', 'Tineg', 'Villaviciosa'],
  'Agusan del Norte': ['Butuan City', 'Cabadbaran', 'Carmen', 'Jabonga', 'Kitcharao', 'Las Nieves', 'Magallanes', 'Nasipit', 'Remedios T. Romualdez', 'Santiago', 'Tubay'],
  'Agusan del Sur': ['Bayugan City', 'Bunawan', 'Esperanza', 'La Paz', 'Loreto', 'Prosperidad', 'Rosario', 'San Francisco', 'Trento', 'Veruela'],
  'Aklan': ['Kalibo', 'Banga', 'Balete', 'Buruanga', 'Ibajay', 'Lezo', 'Madalag', 'Makato', 'Malay', 'Numancia', 'Tangalan'],
  'Albay': ['Legazpi City', 'Ligao City', 'Tabaco City', 'Bacacay', 'Camalig', 'Daraga', 'Guinobatan', 'Jovellar', 'Malilipot', 'Malinao', 'Manito', 'Pio Duran', 'Polangui', 'Rapu-Rapu', 'Santo Domingo', 'Tiwi'],
  'Antique': ['San Jose de Buenavista', 'Anini-y', 'Barbaza', 'Belison', 'Bugasong', 'Caluya', 'Culasi', 'Hamtic', 'Laua-an', 'Patnongon', 'Sebaste', 'Sibalom', 'Tibiao', 'Valderrama'],
  'Apayao': ['Kabugao', 'Calanasan', 'Flora', 'Luna', 'Pudtol', 'Santa Marcela'],
  'Aurora': ['Baler', 'Casiguran', 'Dinalungan', 'Dilasag', 'Dingalan', 'Maria Aurora', 'San Luis'],
  'Basilan': ['Isabela City', 'Lamitan City', 'Akbar', 'Al-Barka', 'Hadji Mohammad Ajul', 'Lantawan', 'Maluso', 'Sumisip', 'Tabuan-Lasa', 'Tipo-Tipo', 'Tuburan', 'Ungkaya Pukan'],
  'Bataan': ['Balanga City', 'Dinalupihan', 'Hermosa', 'Mariveles', 'Orani', 'Samal', 'Abucay', 'Bagac', 'Limay', 'Morong', 'Pilar'],
  'Batanes': ['Basco', 'Itbayat', 'Ivana', 'Mahatao', 'Sabtang', 'Uyugan'],
  'Batangas': ['Batangas City', 'Lipa City', 'Tanauan City', 'Balayan', 'Calaca', 'Cuenca', 'Lemery', 'Nasugbu', 'Rosario', 'San Juan', 'Taal', 'Tuy'],
  'Benguet': ['Baguio City', 'La Trinidad', 'Atok', 'Bakun', 'Buguias', 'Itogon', 'Kabayan', 'Kapangan', 'Kibungan', 'Mankayan', 'Sablan', 'Tuba', 'Tublay'],
  'Biliran': ['Naval', 'Almeria', 'Biliran', 'Cabucgayan', 'Caibiran', 'Culaba', 'Kawayan', 'Maripipi'],
  'Bohol': ['Tagbilaran City', 'Bilar', 'Buenavista', 'Calape', 'Candijay', 'Clarin', 'Corella', 'Dagohoy', 'Danao', 'Duero', 'Garcia Hernandez', 'Getafe', 'Inabanga', 'Loon', 'Maribojoc', 'Panglao', 'Sagbayan', 'Sevilla', 'Sierra Bullones', 'Trinidad', 'Tubigon', 'Ubay', 'Valencia'],
  'Bukidnon': ['Malaybalay City', 'Valencia City', 'Baungon', 'Cabanglasan', 'Damulog', 'Dangcagan', 'Kibawe', 'Kitaotao', 'Lantapan', 'Libona', 'Malitbog', 'Manolo Fortich', 'Maramag', 'Pangantucan', 'Quezon', 'San Fernando', 'Talakag'],
  'Bulacan': ['Malolos City', 'San Jose del Monte City', 'Meycauayan City', 'Baliuag', 'Guiguinto', 'Plaridel', 'Pulilan', 'Hagonoy', 'Calumpit', 'Paombong', 'Bocaue', 'Marilao', 'Obando', 'Santa Maria', 'Doña Remedios Trinidad'],
  'Cagayan': ['Tuguegarao City', 'Aparri', 'Baggao', 'Buguey', 'Calayan', 'Claveria', 'Enrile', 'Gattaran', 'Iguig', 'Lal-lo', 'Lasam', 'Pamplona', 'Peñablanca', 'Piat', 'Rizal', 'Santa Ana', 'Santa Praxedes', 'Solana', 'Sanchez-Mira', 'Santo Niño', 'Tuao'],
  'Camarines Norte': ['Daet', 'Basud', 'Capalonga', 'Jose Panganiban', 'Labo', 'Mercedes', 'Paracale', 'San Lorenzo Ruiz', 'San Vicente', 'Santa Elena', 'Talisay'],
  'Camarines Sur': ['Naga City', 'Iriga City', 'Pili', 'Baao', 'Balatan', 'Bato', 'Bombon', 'Buhi', 'Bula', 'Cabusao', 'Calabanga', 'Camaligan', 'Canaman', 'Caramoan', 'Del Gallego', 'Gainza', 'Garchitorena', 'Goa', 'Lagonoy', 'Libmanan', 'Lupi', 'Magarao', 'Milaor', 'Minalabac', 'Nabua', 'Ocampo', 'Pamplona', 'Pasacao', 'Pili', 'Presentacion', 'Ragay', 'Sagñay', 'San Fernando', 'San Jose', 'Sipocot', 'Siruma', 'Tigaon', 'Tinambac'],
  'Camiguin': ['Mambajao', 'Catarman', 'Guinsiliban', 'Mahinog', 'Sagay'],
  'Capiz': ['Roxas City', 'Dao', 'Dumalag', 'Dumarao', 'Ivisan', 'Jamindan', 'Ma-ayon', 'Mambusao', 'Panay', 'Panitan', 'Pilar', 'Pontevedra', 'President Roxas', 'Sigma', 'Tapaz'],
  'Catanduanes': ['Virac', 'Bato', 'Caramoran', 'Gigmoto', 'Pandan', 'San Andres', 'San Miguel', 'Viga', 'Baras'],
  'Cavite': ['Dasmariñas City', 'Bacoor City', 'Imus City', 'General Trias City', 'Tagaytay City', 'Cavite City', 'Trece Martires City', 'Alfonso', 'Amadeo', 'Carmona', 'Gen. Mariano Alvarez', 'Kawit', 'Magallanes', 'Maragondon', 'Naic', 'Noveleta', 'Rosario', 'Silang', 'Tanza'],
  'Cebu': ['Cebu City', 'Mandaue City', 'Lapu-Lapu City', 'Talisay City', 'Danao City', 'Bogo City', 'Carcar City', 'Toledo City', 'Badian', 'Balamban', 'Argao', 'Dalaguete', 'Samboan', 'Tabogon', 'Sogod', 'Tuburan'],
  'Cotabato': ['Kidapawan City', 'Cotabato City', 'Alamada', 'Aleosan', 'Antipas', 'Arakan', 'Banisilan', 'Carmen', 'Kabacan', 'Libungan', 'Matalam', 'Midsayap', 'Pagalungan', 'Pikit', 'President Roxas', 'Tulunan'],
  'Davao de Oro': ['Nabunturan', 'Compostela', 'Laak', 'Mabini', 'Maco', 'Monkayo', 'Montevista', 'New Bataan', 'Pantukan', 'San Isidro'],
  'Davao del Norte': ['Tagum City', 'Davao del Norte', 'Braulio E. Dujali', 'Carmen', 'Island Garden City of Samal', 'Kapalong', 'New Corella', 'Panabo City', 'San Isidro', 'Santo Tomas', 'Asuncion'],
  'Davao del Sur': ['Digos City', 'Davao City', 'Bansalan', 'Hagonoy', 'Kiblawan', 'Magsaysay', 'Malalag', 'Matanao', 'Padada', 'Santa Cruz', 'Sulop'],
  'Davao Occidental': ['Malita', 'Don Marcelino', 'Jose Abad Santos', 'Santa Maria'],
  'Davao Oriental': ['Mati City', 'Baganga', 'Banaybanay', 'Boston', 'Caraga', 'Cateel', 'Governor Generoso', 'Lupon', 'Manay', 'San Isidro'],
  'Dinagat Islands': ['San Jose', 'Basilisa', 'Cagdianao', 'Dinagat', 'Libjo', 'Loreto', 'Tubajon'],
  'Eastern Samar': ['Borongan City', 'Arteche', 'Balangiga', 'Can-avid', 'Dolores', 'General MacArthur', 'Giporlos', 'Guiuan', 'Hernani', 'Jipapad', 'Lawaan', 'Llorente', 'Maslog', 'Maydolong', 'Mercedes', 'Oras', 'Quinapondan', 'Salcedo', 'San Julian', 'San Policarpo', 'Sulat', 'Taft'],
  'Guimaras': ['Jordan', 'Buenavista', 'Nueva Valencia', 'San Lorenzo', 'Sibunag'],
  'Ifugao': ['Lagawe', 'Alfonso Lista', 'Asipulo', 'Banaue', 'Hingyon', 'Kiangan', 'Mayoyao', 'Hungduan', 'Tinoc'],
  'Ilocos Norte': ['Laoag City', 'Batac City', 'Bacarra', 'Badoc', 'Bangui', 'Banna', 'Carasi', 'Currimao', 'Dumalneg', 'Marcos', 'Nueva Era', 'Pagudpud', 'Paoay', 'Pasuquin', 'Piddig', 'San Nicolas', 'Sarrat', 'Solsona', 'Vintar'],
  'Ilocos Sur': ['Vigan City', 'Candon City', 'Alilem', 'Banayoyo', 'Burgos', 'Cabugao', 'Caoayan', 'Cervantes', 'Galimuyod', 'Gregorio del Pilar', 'Lidlidda', 'Magsingal', 'Nagbukel', 'Narvacan', 'Quirino', 'Salcedo', 'Santa', 'Santa Lucia', 'Santa Maria', 'Santiago', 'Santo Domingo', 'Sigay', 'Sinait', 'Sugpon', 'Tagudin'],
  'Iloilo': ['Iloilo City', 'Passi City', 'Barotac Nuevo', 'Bingawan', 'Calinog', 'Carles', 'Estancia', 'Guimbal', 'Janiuay', 'Lambunao', 'Mina', 'Oton', 'Pototan', 'San Dionisio', 'Sara', 'Tubungan', 'Zarraga'],
  'Isabela': ['Ilagan City', 'Cauayan City', 'Cabagan', 'Echague', 'Gamu', 'Mallig', 'Naguilian', 'Roxas', 'San Mariano', 'Santiago City', 'Tumauini', 'Alicia', 'Angadanan', 'Benito Soliven', 'Dinapigue', 'Divilacan'],
  'Kalinga': ['Tabuk City', 'Balbalan', 'Lubuagan', 'Pasil', 'Pinukpuk', 'Rizal', 'Tanudan', 'Tinglayan'],
  'La Union': ['San Fernando City', 'Agoo', 'Aringay', 'Bacnotan', 'Bagulin', 'Balaoan', 'Bangar', 'Bauang', 'Burgos', 'Caba', 'Luna', 'Naguilian', 'Pugo', 'Rosario', 'San Gabriel', 'Santol', 'Santo Tomas', 'Tubao'],
  'Laguna': ['Santa Rosa City', 'Biñan City', 'Calamba City', 'San Pablo City', 'Cabuyao City', 'San Pedro', 'Binan', 'Lumban', 'Nagcarlan', 'Paete', 'Pagsanjan', 'Pakil', 'Pangil', 'Liliw', 'Majayjay', 'Siniloan', 'Sta. Maria', 'Victoria'],
  'Lanao del Norte': ['Iligan City', 'Tubod', 'Baroy', 'Kapatagan', 'Kauswagan', 'Kolambugan', 'Lala', 'Magsaysay', 'Maigo', 'Matungao', 'Munai', 'Nunungan', 'Pantao Ragat', 'Poona Piagapo', 'Salvador', 'Sapad', 'Tagoloan', 'Tugaya'],
  'Lanao del Sur': ['Marawi City', 'Bacolod-Kalawi', 'Balo-i', 'Buadiposo-Buntong', 'Bubong', 'Butig', 'Ditsaan-Ramain', 'Ganassi', 'Kapai', 'Kapatagan', 'Lumbayanague', 'Madalum', 'Mansaka', 'Masiu', 'Mulondo', 'Poona Bayabao', 'Pualas', 'Saguiaran', 'Tamparan', 'Taraka', 'Tubaran', 'Wao'],
  'Leyte': ['Tacloban City', 'Ormoc City', 'Baybay City', 'Maasin City', 'Abuyog', 'Alangalang', 'Babatngon', 'Barugo', 'Bato', 'Burauen', 'Capoocan', 'Carigara', 'Dagami', 'Dulag', 'Hilongos', 'Hindang', 'Inopacan', 'Jaro', 'Javier', 'Julita', 'Kananga', 'La Paz', 'Leyte', 'MacArthur', 'Mahaplag', 'Matag-ob', 'Matalom', 'Palo', 'Palompon', 'San Isidro', 'Santa Fe', 'Tabango', 'Tunga', 'Villaba'],
  'Maguindanao del Norte': ['Cotabato City', 'Datu Blah T. Sinsuat', 'Datu Odin Sinsuat', 'Kabuntalan', 'Matanog', 'Northern Kabuntalan', 'Parang', 'Sultan Kudarat', 'Sultan Mastura', 'Upi'],
  'Maguindanao del Sur': ['Buldon', 'Datu Anggal Midtimbang', 'Datu Hoffer Ampatuan', 'Datu Montawal', 'General Santos City', 'Mamasapano', 'Pandag', 'Shariff Aguak', 'Talayan', 'Upi'],
  'Marinduque': ['Boac', 'Buenavista', 'Gasan', 'Mogpog', 'Santa Cruz', 'Torrijos'],
  'Masbate': ['Masbate City', 'Aroroy', 'Baleno', 'Balud', 'Batuan', 'Cataingan', 'Dimasalang', 'Esperanza', 'Mandaon', 'Milagros', 'Monreal', 'Palanas', 'Pio V. Corpuz', 'Placer', 'San Fernando', 'San Jacinto', 'San Pascual', 'Uson'],
  'Misamis Occidental': ['Ozamiz City', 'Tangub City', 'Aloran', 'Baliangao', 'Bonifacio', 'Calamba', 'Clarin', 'Concepcion', 'Don Victoriano', 'Jimenez', 'Lopez Jaena', 'Misamis Occidental', 'Panaon', 'Plaridel', 'Sapang Dalaga', 'Sinacaban', 'Tudela'],
  'Misamis Oriental': ['Cagayan de Oro City', 'Gingoog City', 'El Salvador City', 'Balingasag', 'Balingoan', 'Claveria', 'Gitagum', 'Initao', 'Jasaan', 'Kinoguitan', 'Lagonglong', 'Lagonlong', 'Magsaysay', 'Manticao', 'Medina', 'Naawan', 'Opol', 'Salay', 'Sugbongcogon', 'Tagoloan', 'Talisayan', 'Villanueva'],
  'Mountain Province': ['Bontoc', 'Sadanga', 'Barlig', 'Bauko', 'Besao', 'Natonin', 'Paracelis', 'Sabangan', 'Sagada', 'Tadian'],
  'Negros Occidental': ['Bacolod City', 'Silay City', 'Talisay City', 'Bago City', 'Cadiz City', 'Escalante City', 'Himamaylan City', 'Kabankalan City', 'La Carlota City', 'Sagay City', 'San Carlos City', 'Victorias City', 'Binalbagan', 'Calatrava', 'Candoni', 'Enrique B. Magalona', 'Hinigaran', 'Hinoba-an', 'Isabela', 'Murcia', 'Pontevedra', 'Pulupandan', 'Salvador Benedicto', 'San Enrique', 'Toboso', 'Valladolid'],
  'Negros Oriental': ['Dumaguete City', 'Bayawan City', 'Bais City', 'Canlaon City', 'Guihulngan City', 'Tanjay City', 'Amlan', 'Ayungon', 'Bacong', 'Basay', 'Bindoy', 'Dauin', 'Jimalalud', 'La Libertad', 'Mabinay', 'Pamplona', 'San Jose', 'Santa Catalina', 'Siaton', 'Sibulan', 'Valencia', 'Zamboanguita'],
  'Northern Samar': ['Catarman', 'Allen', 'Biri', 'Bobon', 'Capul', 'Catubig', 'Gamay', 'Laoang', 'Lapinig', 'Las Navas', 'Lavezares', 'Lope de Vega', 'Mapanas', 'Mondragon', 'Palapag', 'Pambujan', 'Rosario', 'San Antonio', 'San Isidro', 'San Jose', 'San Roque', 'Santo Niño', 'Victoria'],
  'Nueva Ecija': ['Palayan City', 'Cabanatuan City', 'San Jose City', 'Aliaga', 'Bongabon', 'Cabiao', 'Carranglan', 'Cuyapo', 'Gabaldon', 'Gapan', 'Gen. Tinio', 'Guimba', 'Jaen', 'Laur', 'Licab', 'Llanera', 'Lupao', 'Nampicuan', 'Pantabangan', 'Peñaranda', 'Quezon', 'Rizal', 'San Antonio', 'San Isidro', 'San Leonardo', 'Santa Rosa', 'Santo Domingo', 'Talavera', 'Talugtug', 'Zaragoza'],
  'Nueva Vizcaya': ['Bayombong', 'Alfonso Castaneda', 'Ambaguio', 'Aritao', 'Bagabag', 'Bambang', 'Dupax del Norte', 'Dupax del Sur', 'Kasibu', 'Kayapa', 'Magdiwang', 'Santa Fe', 'Solano', 'Villaverde'],
  'Occidental Mindoro': ['Mamburao', 'Abra de Ilog', 'Calintaan', 'Looc', 'Lubang', 'Paluan', 'Rizal', 'Sablayan', 'San Jose', 'Santa Cruz'],
  'Oriental Mindoro': ['Calapan City', 'Puerto Galera', 'Baco', 'Bansud', 'Bongabong', 'Bulalacao', 'Gloria', 'Mansalay', 'Naujan', 'Pinamalayan', 'Pola', 'Socorro', 'Victoria'],
  'Palawan': ['Puerto Princesa City', 'Coron', 'El Nido', 'Aborlan', 'Busuanga', 'Cagayancillo', 'Culion', 'Dumaran', 'Roxas', 'San Vicente', 'Taytay', 'Tropical'],
  'Pampanga': ['San Fernando City', 'Angeles City', 'Mabalacat City', 'Bacolor', 'Candaba', 'Floridablanca', 'Guagua', 'Lubao', 'Macabebe', 'Magalang', 'Mexico', 'Minantok', 'Porac', 'San Luis', 'San Simon', 'Santa Ana', 'Santa Rita', 'Santo Tomas', 'Arayat'],
  'Pangasinan': ['Lingayen', 'Dagupan City', 'Urdaneta City', 'Alaminos City', 'San Carlos City', 'Binmaley', 'Bolinao', 'Bugallon', 'Calasiao', 'Dasol', 'Infanta', 'Mabini', 'Malasiqui', 'Mangaldan', 'Mapandan', 'Natividad', 'Pozorrubio', 'Rosales', 'Santa Barbara', 'Sual', 'Tayug', 'Villasis'],
  'Quezon': ['Lucena City', 'Tayabas City', 'Agdangan', 'Atimonan', 'Buenavista', 'Burdeos', 'Calauag', 'Candelaria', 'Catanauan', 'Dolores', 'General Luna', 'Gumaca', 'Infanta', 'Jomalig', 'Lopez', 'Lucban', 'Macalelon', 'Mauban', 'Padre Burgos', 'Pagbilao', 'Panukulan', 'Patnanungan', 'Perez', 'Pitogo', 'Plaridel', 'Polillo', 'Quezon', 'Real', 'Sampaloc', 'San Andres', 'San Antonio', 'San Francisco', 'San Narciso', 'Sariaya', 'Tagkawayan', 'Tiaong', 'Unisan'],
  'Quirino': ['Cabarroguis', 'Diffun', 'Madela', 'Saguday', 'Aglipay'],
  'Rizal': ['Antipolo City', 'Rodriguez', 'Cainta', 'Taytay', 'San Mateo', 'Pasig', 'Teresa', 'Binangonan', 'Cardona', 'Baras', 'Morong', 'Pililla', 'Tanay', 'Jala-Jala', 'Montalban', 'Angono'],
  'Romblon': ['Romblon', 'Alcantara', 'Banton', 'Cajidiocan', 'Calatrava', 'Concepcion', 'Corcuera', 'Ferrol', 'Looc', 'Odiongan', 'San Agustin', 'San Andres', 'San Fernando', 'Santa Fe', 'Santa Maria'],
  'Samar': ['Catbalogan City', 'Calbayog City', 'Allen', 'Basey', 'Borongan', 'Calbiga', 'Daram', 'Gandara', 'Hinabangan', 'Jiabong', 'Marabut', 'Matuguinao', 'Motiong', 'Pagsanghan', 'Paranas', 'Pinabacdao', 'San Jorge', 'San Sebastian', 'Santa Margarita', 'Talalora', 'Tarangnan', 'Villareal', 'Zumarraga'],
  'Sarangani': ['Alabel', 'Glan', 'Kiamba', 'Maasim', 'Maitum', 'Malapatan', 'Malungon'],
  'Siquijor': ['Siquijor', 'Enrique Villanueva', 'Larena', 'Lazi', 'Maria', 'San Juan'],
  'Sorsogon': ['Sorsogon City', 'Bulan', 'Castilla', 'Donsol', 'Gubat', 'Irosin', 'Juban', 'Magallanes', 'Matnog', 'Pilar', 'Prieto Diaz', 'Santa Magdalena'],
  'South Cotabato': ['Koronadal City', 'General Santos City', 'Lake Sebu', 'Polomolok', 'Santo Niño', 'Surallah', 'Tampakan', 'Tantangan', 'Tupi'],
  'Southern Leyte': ['Maasin City', 'Bontoc', 'Hinunangan', 'Libagon', 'Liloan', 'Macrohon', 'Malitbog', 'Padre Burgos', 'Pintuyan', 'Saint Bernard', 'San Francisco', 'San Juan', 'Sogod', 'Tomas Oppus'],
  'Sultan Kudarat': ['Isulan', 'Tacurong City', 'Bagumbayan', 'Columbio', 'Esperanza', 'Gulani', 'Lutayan', 'Palimbang', 'President Quirino', 'Sen. Ninoy Aquino'],
  'Sulu': ['Jolo', 'Luuk', 'Maimbung', 'Old Panamao', 'Pangutaran', 'Parang', 'Siasi', 'Talipao', 'Tapul', 'Tongkil'],
  'Surigao del Norte': ['Surigao City', 'Alegria', 'Bacuag', 'Claver', 'Dapa', 'Del Carmen', 'General Luna', 'Gigaquit', 'Mainit', 'Malimono', 'Pilar', 'Placer', 'San Benito', 'San Francisco', 'Santa Monica', 'Sison', 'Tagana-an', 'Tubod'],
  'Surigao del Sur': ['Tandag City', 'Bislig City', 'Barobo', 'Bayabas', 'Cagwait', 'Cantilan', 'Carmen', 'Carrascal', 'Hinatuan', 'Lanuza', 'Lianga', 'Lingig', 'Madrid', 'Marihatag', 'San Agustin', 'Tagbina', 'Tago'],
  'Tarlac': ['Tarlac City', 'Concepcion', 'Paniqui', 'Capas', 'Gerona', 'La Paz', 'Moncada', 'Pura', 'Ramos', 'San Clemente', 'San Jose', 'San Manuel', 'Santa Ignacia', 'Victoria'],
  'Tawi-Tawi': ['Bongao', 'Bato-bato', 'Mapun', 'Panglima Sugala', 'Sapa-Sapa', 'Simunul', 'South Ubian', 'Tandubas', 'Turtle Islands'],
  'Zambales': ['Iba', 'Olongapo City', 'Subic', 'Botolan', 'Cabangan', 'Candelaria', 'Castillejos', 'Masinloc', 'Palauig', 'San Antonio', 'San Felipe', 'San Marcelino', 'Santa Cruz'],
  'Zamboanga del Norte': ['Dipolog City', 'Dapitan City', 'Sindangan', 'Katipunan', 'La Libertad', 'Liloy', 'Manukan', 'Mutia', 'Polanco', 'President Manuel A. Roxas', 'Rizal', 'Salug', 'Siayan', 'Sibuco', 'Sibutad', 'Tampilisan'],
  'Zamboanga del Sur': ['Pagadian City', 'Zamboanga City', 'Aurora', 'Bayog', 'Dimataling', 'Dinas', 'Dumalinao', 'Guipos', 'Kumalarang', 'Lakewood', 'Labangan', 'Mahayag', 'Margosatubig', 'Midsalip', 'Molave', 'Ramon Magsaysay', 'San Pablo', 'Sominot', 'Tabina', 'Tambulig', 'Tigbao', 'Tukuran', 'Vincenzo A. Sagun'],
  'Zamboanga Sibugay': ['Ipil', 'Kabasalan', 'Mabuhay', 'Malangas', 'Naga', 'Olutanga', 'Payao', 'Roseller Lim', 'Siay', 'Titay', 'Tungawan']
};
const PROVINCE_OPTIONS = Object.keys(PH_PROVINCES);
const ISLAND_GROUP_BY_PROVINCE = {
  Luzon: [
    'Metro Manila', 'Abra', 'Apayao', 'Aurora', 'Bataan', 'Batanes', 'Batangas', 'Benguet', 'Bulacan',
    'Cagayan', 'Camarines Norte', 'Camarines Sur', 'Catanduanes', 'Cavite', 'Ifugao', 'Ilocos Norte',
    'Ilocos Sur', 'Isabela', 'Kalinga', 'La Union', 'Laguna', 'Marinduque', 'Masbate', 'Mountain Province',
    'Nueva Ecija', 'Nueva Vizcaya', 'Occidental Mindoro', 'Oriental Mindoro', 'Palawan', 'Pampanga',
    'Pangasinan', 'Quezon', 'Quirino', 'Rizal', 'Romblon', 'Sorsogon', 'Tarlac', 'Zambales'
  ],
  Visayas: [
    'Aklan', 'Antique', 'Biliran', 'Bohol', 'Capiz', 'Cebu', 'Eastern Samar', 'Guimaras', 'Iloilo',
    'Leyte', 'Negros Occidental', 'Negros Oriental', 'Northern Samar', 'Samar', 'Siquijor', 'Southern Leyte'
  ],
  Mindanao: [
    'Agusan del Norte', 'Agusan del Sur', 'Basilan', 'Bukidnon', 'Camiguin', 'Cotabato', 'Davao de Oro',
    'Davao del Norte', 'Davao del Sur', 'Davao Occidental', 'Davao Oriental', 'Dinagat Islands',
    'Lanao del Norte', 'Lanao del Sur', 'Maguindanao del Norte', 'Maguindanao del Sur', 'Misamis Occidental',
    'Misamis Oriental', 'Sarangani', 'South Cotabato', 'Sultan Kudarat', 'Sulu', 'Surigao del Norte',
    'Surigao del Sur', 'Tawi-Tawi', 'Zamboanga del Norte', 'Zamboanga del Sur', 'Zamboanga Sibugay'
  ]
};
const getIslandGroupForProvince = (province) => Object.entries(ISLAND_GROUP_BY_PROVINCE)
  .find(([, provinces]) => provinces.includes(province))?.[0] || '';
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
const isValidPhilippinePhone = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  return /^09\d{9}$/.test(digits) || /^639\d{9}$/.test(digits);
};
const normalizeLocation = (value) => String(value || '')
  .toLowerCase()
  .replace(/\b(city|municipality|town)\b/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ');
const addressContainsLocation = (address, location) => {
  const normalizedAddress = ` ${normalizeLocation(address)} `;
  const normalizedLocation = normalizeLocation(location);
  return Boolean(normalizedLocation) && normalizedAddress.includes(` ${normalizedLocation} `);
};
const findAddressLocationMismatch = ({ address, city, province }) => {
  const mentionedProvince = PROVINCE_OPTIONS.find((candidate) =>
    normalizeLocation(candidate) !== normalizeLocation(province)
    && addressContainsLocation(address, candidate)
  );
  if (mentionedProvince) {
    return `The delivery address mentions ${mentionedProvince}, but the selected province is ${province}. Please correct the address or province.`;
  }

  const selectedCity = normalizeLocation(city);
  const mentionedCities = Object.entries(PH_PROVINCES)
    .flatMap(([, cities]) => cities)
    .filter((cityName) => addressContainsLocation(address, cityName))
    .sort((a, b) => normalizeLocation(b).length - normalizeLocation(a).length);
  const mentionedCity = mentionedCities.find((cityName) => {
    const normalizedCity = normalizeLocation(cityName);
    const cityBelongsToSelectedProvince = (PH_PROVINCES[province] || []).some(
      (selectedProvinceCity) => normalizeLocation(selectedProvinceCity) === normalizedCity
    );
    return normalizedCity !== selectedCity && !cityBelongsToSelectedProvince;
  });

  if (mentionedCity) {
    return `The delivery address mentions ${mentionedCity}, but the selected city is ${city}. Please correct the address or city.`;
  }
  return '';
};
const validateDeliveryAddress = (deliveryAddress) => {
  const { name, phone, email, address, city, province } = deliveryAddress;
  if (![name, phone, email, address, city, province].every((value) => String(value || '').trim())) {
    return 'Complete the recipient name, phone, email, street address, city, and province.';
  }
  if (!isValidPhilippinePhone(phone)) {
    return 'Enter a valid Philippine mobile number, such as 0917 123 4567.';
  }
  if (!isValidEmail(email)) {
    return 'Enter a valid email address for this delivery contact.';
  }
  return findAddressLocationMismatch(deliveryAddress);
};
const formatPeso = (amount, decimals = 0) =>
  `₱${Number(amount).toLocaleString('en-PH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`;

function Modal({ title, icon, onClose, children, size = 'max-w-xl' }) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/40 p-3 sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`my-auto flex max-h-[92vh] w-full ${size} flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg`}
      >
        <header className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <i className={`fa-solid ${icon} text-gray-400`} aria-hidden="true"></i>
            <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
            <i className="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </header>
        <div className="overflow-y-auto p-5">{children}</div>
      </section>
    </div>
  );
}

function App() {
  const [view, setView] = useState('shop');
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('ALL');
  const [island, setIsland] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured');
  const [regionMenuOpen, setRegionMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedCartIds, setSelectedCartIds] = useState([]);
  const [modal, setModal] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sellerContactProduct, setSellerContactProduct] = useState(null);
  const [toasts, setToasts] = useState([]);
  const defaultDeliveryAddress = {
    id: 'maria-home',
    label: 'Home',
    name: 'Maria Clara Santos',
    phone: '+63 917 889 2341',
    email: 'maria.clara@example.com',
    address: 'Unit 402 Solinea Tower, Cebu Business Park, Mabolo',
    city: 'Cebu City',
    province: 'Cebu',
    isDefault: true
  };
  const defaultUser = {
    isLoggedIn: true,
    name: 'Maria Clara Santos',
    email: 'maria.clara@example.com',
    phone: '+63 917 889 2341',
    address: 'Unit 402 Solinea Tower, Cebu Business Park, Mabolo',
    city: 'Cebu City',
    province: 'Cebu',
    addresses: [defaultDeliveryAddress],
    paymentMethod: 'GCash',
    deliveryNotes: 'Please call before delivery if the recipient is unavailable.'
  };
  const guestUser = {
    isLoggedIn: false,
    name: 'Account',
    email: '',
    phone: '',
    address: '',
    city: 'Cebu City',
    province: 'Cebu',
    addresses: [],
    paymentMethod: 'GCash',
    deliveryNotes: ''
  };
  const [currentUser, setCurrentUser] = useState(defaultUser);
  const [profileDraft, setProfileDraft] = useState(defaultUser);
  const [profileEdit, setProfileEdit] = useState(false);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressDraft, setAddressDraft] = useState({ label: '', name: '', phone: '', email: '', address: '', city: '', province: '', isDefault: false });
  const [addressBookError, setAddressBookError] = useState('');
  const [authTab, setAuthTab] = useState('login');
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [activeOrder, setActiveOrder] = useState({
    orderId: 'EB-2026-7842',
    escrowAmount: 1250,
    products: [],
    deliveryAddress: null,
    paymentMethod: 'GCash'
  });
  const [trackInputId, setTrackInputId] = useState('EB-2026-7842');
  const [sellerContactReturn, setSellerContactReturn] = useState('');
  const [supportReturnModal, setSupportReturnModal] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('GCash');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [checkoutAddressError, setCheckoutAddressError] = useState('');
  const [ratings, setRatings] = useState({ taste: 5, packaging: 5, freshness: 5 });
  const [checkoutAddress, setCheckoutAddress] = useState({
    name: 'Maria Clara Santos',
    phone: '+63 917 889 2341',
    email: 'maria.clara@example.com',
    address: 'Unit 402 Solinea Tower, Cebu Business Park, Mabolo',
    city: 'Cebu City',
    province: 'Cebu'
  });
  const [checkoutDeliveryNotes, setCheckoutDeliveryNotes] = useState(defaultUser.deliveryNotes);
  const [selectedCheckoutAddressId, setSelectedCheckoutAddressId] = useState(defaultDeliveryAddress.id);
  const [editingCheckoutAddressId, setEditingCheckoutAddressId] = useState(null);
  const [saveCheckoutAddress, setSaveCheckoutAddress] = useState(false);
  const [makeCheckoutAddressDefault, setMakeCheckoutAddressDefault] = useState(false);
  const regionMenuRef = useRef(null);
  const productsSectionRef = useRef(null);
  const toastTimers = useRef(new Set());
  const paymentTimer = useRef(null);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = delicacies.filter((product) => {
      const matchesRegion = region === 'ALL' || product.region.toLowerCase() === region.toLowerCase();
      const matchesIsland = island === 'ALL' || product.island.toLowerCase() === island.toLowerCase();
      const searchableText = [product.name, product.maker, product.province, product.region, product.badge]
        .join(' ')
        .toLowerCase();
      return matchesRegion && matchesIsland && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });

    if (sortBy === 'price-low') return filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') return filtered.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') return filtered.sort((a, b) => b.rating - a.rating);
    return filtered;
  }, [query, region, island, sortBy]);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const selectedCartItems = cart.filter((item) => selectedCartIds.includes(item.id));
  const selectedItemCount = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const defaultSavedAddress = (currentUser.addresses || []).find((address) => address.isDefault) || currentUser.addresses?.[0];
  const shippingProvince = modal === 'checkout'
    ? checkoutAddress.province
    : defaultSavedAddress?.province || currentUser.province;
  const shippingIslandGroup = getIslandGroupForProvince(shippingProvince);
  const shipping = selectedCartItems.length === 0
    ? 0
    : selectedCartItems.some((item) => item.island !== shippingIslandGroup) ? 260 : 120;
  const total = subtotal + shipping;
  const shelfTitle = region !== 'ALL'
    ? `${region} Delicacy Shelf`
    : island !== 'ALL'
      ? `${island} Delicacy Collection`
      : 'All Regional Delicacies';
  const shelfSubtitle = region !== 'ALL'
    ? `Authorized local specialty pasalubong sourced directly from registered ${region} MSMEs.`
    : island !== 'ALL'
      ? `Explore all regional hubs situated in the ${island} island archipelago.`
      : 'Showing authorized authentic pasalubong packaged fresh at origin hubs across the archipelago.';

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (regionMenuRef.current && !regionMenuRef.current.contains(event.target)) setRegionMenuOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setModal('');
        setCartOpen(false);
        setRegionMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
      toastTimers.current.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(paymentTimer.current);
    };
  }, []);

  useEffect(() => {
    setProfileDraft(currentUser);
  }, [currentUser]);

  const notify = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((items) => [...items, { id, message, type }]);
    const timer = window.setTimeout(() => {
      setToasts((items) => items.filter((toast) => toast.id !== id));
      toastTimers.current.delete(timer);
    }, 3500);
    toastTimers.current.add(timer);
  };

  const resetFilters = () => {
    setQuery('');
    setRegion('ALL');
    setIsland('ALL');
    setSortBy('featured');
    setRegionMenuOpen(false);
    setView('shop');
  };

  const chooseRegion = (nextRegion) => {
    setRegion(nextRegion);
    setIsland('ALL');
    setRegionMenuOpen(false);
    setView('shop');
  };

  const chooseIsland = (nextIsland) => {
    setIsland(nextIsland);
    setRegion('ALL');
    setView('shop');
  };

  const addToCart = (product) => {
    if (product.stock <= 0) {
      setSelectedProduct(product);
      setModal('out-of-stock');
      return;
    }
    const existing = cart.find((item) => item.id === product.id);
    if (existing && existing.quantity >= product.stock) {
      notify(`Only ${product.stock} ${product.name} available in stock.`, 'warning');
      return;
    }
    setCart((items) => {
      return existing
        ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...items, { ...product, quantity: 1 }];
    });
    setSelectedCartIds((ids) => ids.includes(product.id) ? ids : [...ids, product.id]);
    notify(`Added ${product.name} to basket!`);
  };

  const changeQuantity = (productId, delta) => {
    const item = cart.find((cartItem) => cartItem.id === productId);
    if (delta > 0 && item && item.quantity >= item.stock) {
      notify(`Only ${item.stock} ${item.name} available in stock.`, 'warning');
      return;
    }
    setCart((items) => items
      .map((item) => item.id === productId ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0));
    if (cart.find((item) => item.id === productId)?.quantity === 1 && delta < 0) {
      setSelectedCartIds((ids) => ids.filter((id) => id !== productId));
    }
  };

  const removeFromCart = (productId) => {
    setCart((items) => items.filter((item) => item.id !== productId));
    setSelectedCartIds((ids) => ids.filter((id) => id !== productId));
  };

  const toggleCartItem = (productId) => {
    setSelectedCartIds((ids) => ids.includes(productId)
      ? ids.filter((id) => id !== productId)
      : [...ids, productId]);
  };

  const continueBrowsing = () => {
    setCartOpen(false);
    window.requestAnimationFrame(() => {
      productsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const savedAddresses = currentUser.addresses || [];
  const primaryAddress = savedAddresses.find((address) => address.isDefault) || savedAddresses[0] || {
    name: currentUser.name,
    phone: currentUser.phone,
    address: currentUser.address,
    city: currentUser.city,
    province: currentUser.province
  };

  const updateAddressBook = (addresses) => {
    const defaultAddress = addresses.find((address) => address.isDefault) || addresses[0];
    setCurrentUser((user) => ({
      ...user,
      addresses,
      address: defaultAddress?.address || '',
      city: defaultAddress?.city || '',
      province: defaultAddress?.province || ''
    }));
  };

  const saveAddressToBook = (event) => {
    event.preventDefault();
    const validationMessage = validateDeliveryAddress(addressDraft);
    if (validationMessage) {
      setAddressBookError(validationMessage);
      return;
    }

    const isNewAddress = !editingAddressId;
    const nextAddress = {
      ...addressDraft,
      id: editingAddressId || `address-${Date.now()}`,
      isDefault: addressDraft.isDefault || savedAddresses.length === 0
    };
    const nextAddresses = isNewAddress
      ? [...savedAddresses, nextAddress]
      : savedAddresses.map((address) => address.id === editingAddressId ? nextAddress : address);
    const defaultAddressId = nextAddress.isDefault
      ? nextAddress.id
      : nextAddresses.find((address) => address.isDefault)?.id || nextAddresses[0]?.id;
    updateAddressBook(nextAddresses.map((address) => ({ ...address, isDefault: address.id === defaultAddressId })));
    setAddressFormOpen(false);
    setEditingAddressId(null);
    setAddressBookError('');
    notify(isNewAddress ? 'Address added to your address book.' : 'Address updated.', 'success');
  };

  const startAddressEdit = (address) => {
    setAddressDraft({ ...address, email: address.email || currentUser.email || '' });
    setEditingAddressId(address.id);
    setAddressBookError('');
    setAddressFormOpen(true);
  };

  const setDefaultDeliveryAddress = (addressId) => {
    updateAddressBook(savedAddresses.map((address) => ({ ...address, isDefault: address.id === addressId })));
    notify('Default delivery address updated.', 'success');
  };

  const removeDeliveryAddress = (addressId) => {
    const remainingAddresses = savedAddresses.filter((address) => address.id !== addressId);
    if (remainingAddresses.length && !remainingAddresses.some((address) => address.isDefault)) {
      remainingAddresses[0] = { ...remainingAddresses[0], isDefault: true };
    }
    updateAddressBook(remainingAddresses);
    notify('Address removed from your address book.', 'info');
  };

  const chooseCheckoutAddress = (addressId) => {
    setCheckoutAddressError('');
    setSelectedCheckoutAddressId(addressId);
    setEditingCheckoutAddressId(null);
    setCheckoutDeliveryNotes(currentUser.deliveryNotes || '');
    if (addressId === 'new') {
      setCheckoutAddress({
        name: currentUser.isLoggedIn ? currentUser.name : '',
        phone: currentUser.isLoggedIn ? currentUser.phone : '',
        email: currentUser.isLoggedIn ? currentUser.email : '',
        address: '',
        city: '',
        province: ''
      });
      setSaveCheckoutAddress(false);
      setMakeCheckoutAddressDefault(false);
      return;
    }
    const selectedAddress = savedAddresses.find((address) => address.id === addressId);
    if (selectedAddress) setCheckoutAddress({ ...selectedAddress, email: selectedAddress.email || currentUser.email || '' });
  };

  const editCheckoutAddress = (address) => {
    setSelectedCheckoutAddressId(address.id);
    setEditingCheckoutAddressId(address.id);
    setCheckoutAddressError('');
    setCheckoutAddress({ ...address, email: address.email || currentUser.email || '' });
  };

  const saveCheckoutAddressChanges = () => {
    const validationMessage = validateDeliveryAddress(checkoutAddress);
    if (validationMessage) {
      setCheckoutAddressError(validationMessage);
      return;
    }
    const updatedAddresses = savedAddresses.map((address) =>
      address.id === editingCheckoutAddressId ? { ...address, ...checkoutAddress } : address
    );
    updateAddressBook(updatedAddresses);
    setEditingCheckoutAddressId(null);
    setCheckoutAddressError('');
    notify('Delivery contact updated.', 'success');
  };

  const openCheckout = () => {
    if (cart.length === 0) {
      notify('Your basket is empty!', 'warning');
      return;
    }
    if (selectedCartItems.length === 0) {
      notify('Select at least one product to continue to checkout.', 'warning');
      return;
    }
    const checkoutAddressId = primaryAddress?.id || 'new';
    setSelectedCheckoutAddressId(checkoutAddressId);
    setEditingCheckoutAddressId(null);
    setCheckoutAddress({
      name: primaryAddress?.name || '',
      phone: primaryAddress?.phone || '',
      email: primaryAddress?.email || currentUser.email || '',
      address: primaryAddress?.address || '',
      city: primaryAddress?.city || '',
      province: primaryAddress?.province || ''
    });
    setCheckoutDeliveryNotes(currentUser.deliveryNotes || '');
    setCheckoutAddressError('');
    setSaveCheckoutAddress(false);
    setMakeCheckoutAddressDefault(false);
    setCartOpen(false);
    setModal('checkout');
  };

  const executePayment = (event) => {
    event.preventDefault();
    if (paymentLoading) return;
    const validationMessage = validateDeliveryAddress(checkoutAddress);
    if (validationMessage) {
      setCheckoutAddressError(validationMessage);
      notify(validationMessage, 'error');
      return;
    }
    setCheckoutAddressError('');
    setPaymentLoading(true);
    paymentTimer.current = window.setTimeout(() => {
      setPaymentLoading(false);
      if (selectedCheckoutAddressId === 'new' && saveCheckoutAddress && currentUser.isLoggedIn) {
        const newAddress = {
          ...checkoutAddress,
          id: `address-${Date.now()}`,
          label: 'Other',
          isDefault: makeCheckoutAddressDefault || !savedAddresses.length
        };
        const addresses = [...savedAddresses, newAddress];
        updateAddressBook(addresses.map((address) => ({
          ...address,
          isDefault: newAddress.isDefault ? address.id === newAddress.id : address.isDefault
        })));
      }
      const orderId = `EB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setActiveOrder({
        orderId,
        escrowAmount: subtotal + shipping,
        products: selectedCartItems.map(({ id, name, maker, province, price, quantity }) => ({ id, name, maker, province, price, quantity })),
        deliveryAddress: { ...checkoutAddress, deliveryNotes: checkoutDeliveryNotes },
        paymentMethod
      });
      setTrackInputId(orderId);
      setCart((items) => items.filter((item) => !selectedCartIds.includes(item.id)));
      setSelectedCartIds((ids) => ids.filter((id) => !selectedCartIds.includes(id)));
      setModal('tracking');
      notify(`Order confirmed! Maker alerted & assigned: ${orderId}`, 'success');
    }, 900);
  };

  const performTrackingLookup = (event) => {
    event.preventDefault();
    const id = trackInputId.trim();
    if (!id) {
      notify('Please enter an Order ID', 'warning');
      return;
    }
    setActiveOrder((order) => ({ ...order, orderId: id }));
    notify(`Loaded consignment details for ${id}`);
  };

  const submitAuth = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get('password') || '');
    const name = authTab === 'register'
      ? String(formData.get('name') || '').trim()
      : currentUser.name;
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();

    if (authTab === 'register' && password !== formData.get('confirmPassword')) {
      notify('Passwords do not match.', 'error');
      return;
    }

    const userData = {
      isLoggedIn: true,
      name: name || 'Maria Clara Santos',
      email: email || currentUser.email,
      phone: phone || currentUser.phone,
      address: currentUser.address,
      city: currentUser.city,
      province: currentUser.province,
      addresses: currentUser.addresses || [],
      paymentMethod: currentUser.paymentMethod,
      deliveryNotes: currentUser.deliveryNotes
    };

    setCurrentUser(userData);
    setProfileDraft(userData);
    setProfileEdit(false);
    setModal('');
    notify(authTab === 'login' ? `Logged in as ${userData.name}` : `Welcome to E-Baligya, ${userData.name}!`, 'success');
  };

  const saveProfile = (event) => {
    event.preventDefault();
    const nextUser = { ...currentUser, ...profileDraft, isLoggedIn: true };
    setCurrentUser(nextUser);
    setProfileDraft(nextUser);
    setProfileEdit(false);
    setModal('');
    notify('Profile updated successfully.', 'success');
  };

  const logoutUser = () => {
    const signedOutUser = { ...guestUser, name: 'Account' };
    setCurrentUser(signedOutUser);
    setProfileDraft(signedOutUser);
    setProfileEdit(false);
    setAuthTab('login');
    setModal('auth');
    notify('You have been logged out. Please sign in to continue.', 'info');
  };

  const submitPasswordReset = (event) => {
    event.preventDefault();
    setResetMessage("Password reset isn't connected to a backend yet. No reset email has been sent.");
  };

  const submitReview = (event) => {
    event.preventDefault();
    setModal('');
    notify('Thank you! Delicacy quality review sent to the MSME producer.', 'success');
  };

  const submitSellerInquiry = (event) => {
    event.preventDefault();
    notify('Seller inquiries are a demo feature and are not sent from this app yet.', 'warning');
  };

  const submitCustomerSupportRequest = (event) => {
    event.preventDefault();
    notify('Customer support requests are a demo feature and are not sent to a support team yet.', 'warning');
  };

  const contactOrderSeller = (product) => {
    setSellerContactProduct(product);
    setSellerContactReturn('tracking');
    setModal('seller-contact');
  };

  const addAlternate = () => {
    if (!selectedProduct) return;
    const alternate = delicacies.find((item) => item.id === selectedProduct.alternateId)
      || delicacies.find((item) => item.island === selectedProduct.island && item.stock > 0);
    if (alternate) {
      setModal('');
      addToCart(alternate);
      notify(`Added recommended delicacy: ${alternate.name}`, 'success');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900 antialiased">

      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <button type="button" onClick={resetFilters} className="flex shrink-0 items-center gap-2 text-left">
            {/* Minimal Philippine sun — 8 rays, monochromatic */}
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true" className="shrink-0 text-gray-900">
              <circle cx="13" cy="13" r="4.5" fill="currentColor" opacity="0.85"/>
              {[0,45,90,135,180,225,270,315].map((deg, i) => {
                const r = deg * Math.PI / 180;
                const x1 = 13 + 6.2 * Math.cos(r);
                const y1 = 13 + 6.2 * Math.sin(r);
                const x2 = 13 + 10.5 * Math.cos(r);
                const y2 = 13 + 10.5 * Math.sin(r);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={i % 2 === 0 ? "2" : "1.3"} strokeLinecap="round" opacity={i % 2 === 0 ? "0.9" : "0.6"}/>;
              })}
            </svg>
            <span>
              <span className="block font-serif text-xl font-bold tracking-tight text-gray-900">E-Baligya</span>
              <span className="hidden text-2xs font-medium text-gray-400 sm:block">Philippine Pasalubong Marketplace</span>
            </span>
          </button>

          <div className="relative hidden max-w-md flex-1 md:block">
            <i className="fa-solid fa-magnifying-glass pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 text-sm" aria-hidden="true"></i>
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (view !== 'shop') setView('shop');
              }}
              placeholder="Search delicacies, makers, regions..."
              aria-label="Search delicacies"
              className="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-9 pr-9 text-sm text-gray-900 placeholder:text-gray-400 transition focus:bg-white focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                <i className="fa-solid fa-xmark text-sm" aria-hidden="true"></i>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative" ref={regionMenuRef}>
              <button type="button" onClick={() => setRegionMenuOpen((open) => !open)} className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50">
                <i className="fa-solid fa-map-location-dot text-gray-400" aria-hidden="true"></i>
                <span className="hidden sm:inline">{region === 'ALL' ? '17 Regions' : region}</span>
                <i className="fa-solid fa-chevron-down text-xs text-gray-400" aria-hidden="true"></i>
              </button>
              {regionMenuOpen && (
                <div className="absolute right-0 z-50 mt-1.5 max-h-[80vh] w-[min(90vw,680px)] overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 shadow-lg sm:p-5">
                  <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Philippine Administrative Regions</h3>
                      <p className="mt-0.5 text-xs text-gray-500">Select a region to filter the shelf.</p>
                    </div>
                    <button type="button" onClick={() => chooseRegion('ALL')} className="text-xs font-medium text-blue-700 hover:text-blue-800">Show all</button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {REGION_GROUPS.map((group) => (
                      <section key={group.name}>
                        <h4 className="mb-2 border-b border-gray-100 pb-2 text-2xs font-bold uppercase tracking-wider text-gray-500">
                          {group.name} <span className="font-normal">({group.regions.length})</span>
                        </h4>
                        <div className="space-y-0.5">
                          {group.regions.map(([code, description]) => (
                            <button key={code} type="button" onClick={() => chooseRegion(code)} className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left transition ${region === code ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                              <span className="text-xs font-medium">{code}<span className="block text-2xs font-normal text-gray-400">{description}</span></span>
                              <i className="fa-solid fa-chevron-right text-[9px] text-gray-300" aria-hidden="true"></i>
                            </button>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button type="button" onClick={() => setModal('tracking')} className="hidden items-center gap-1.5 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 md:flex">
              <i className="fa-solid fa-box-open text-gray-400" aria-hidden="true"></i><span>Track</span>
            </button>
            <button type="button" onClick={() => { setAuthTab(currentUser.isLoggedIn ? 'profile' : 'login'); setModal('auth'); }} className="hidden items-center gap-1.5 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 sm:flex">
              <i className="fa-solid fa-user text-gray-400" aria-hidden="true"></i><span>{currentUser.isLoggedIn ? currentUser.name.split(' ')[0] : 'Account'}</span>
            </button>
            <button type="button" onClick={() => setCartOpen(true)} aria-label={`Open basket, ${itemCount} items`} className="relative flex items-center gap-1.5 rounded-md border border-blue-700 bg-blue-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-800">
              <i className="fa-solid fa-basket-shopping" aria-hidden="true"></i>
              <span className="hidden sm:inline">Basket</span>
              <span className="tabular flex h-4.5 min-w-[1.125rem] items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-blue-700">{itemCount}</span>
            </button>
          </div>
        </div>
        <div className="border-t border-gray-100 px-4 pb-2.5 pt-2 md:hidden">
          <input type="search" value={query} onChange={(event) => { setQuery(event.target.value); if (view !== 'shop') setView('shop'); }} placeholder="Search delicacies, makers, regions..." aria-label="Search delicacies" className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100" />
        </div>
      </header>

      {view === 'shop' ? (
        <>
          <section className="relative overflow-hidden border-b border-gray-200 bg-white py-10 sm:py-14">
            {/* Banig (woven mat) geometric background — very subtle */}
            <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="banig" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                  <path d="M0 8 L8 0 L16 8 L8 16 Z" fill="none" stroke="#374151" strokeWidth="0.75"/>
                  <path d="M4 4 L12 4 L12 12 L4 12 Z" fill="none" stroke="#374151" strokeWidth="0.4"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#banig)"/>
            </svg>
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <h1 className="font-serif text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">Philippine regional delicacies, delivered.</h1>
                <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:text-base">Authentic pasalubong from 17 regions, sourced directly from local MSMEs across the archipelago.</p>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Island group</span>
                  {ISLANDS.map((name) => {
                    const active = island === name;
                    const label = name === 'ALL' ? 'All 17 Regions' : `${name}${name === 'Luzon' ? ' (8)' : name === 'Visayas' ? ' (3)' : ' (6)'}`;
                    return (
                      <button key={name} type="button" onClick={() => chooseIsland(name)} className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${active ? 'bg-gray-900 text-white' : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900'}`}>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <main ref={productsSectionRef} className="scroll-mt-20 mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col justify-between gap-3 border-b border-gray-200 pb-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">{shelfTitle}</h2>
              <span className="tabular rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-500">{filteredProducts.length}</span>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">{shelfSubtitle}</p>
          </div>
          <div className="flex items-center gap-2.5">
            <label htmlFor="sortSelect" className="text-xs text-gray-500">Sort</label>
            <select id="sortSelect" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100">
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            {(region !== 'ALL' || island !== 'ALL' || query) && <button type="button" onClick={resetFilters} className="rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">Clear filters</button>}
          </div>
        </div>

        {filteredProducts.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <article key={product.id} className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-colors duration-200 hover:border-gray-300">
                <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                  <img src={product.image} alt={product.name} loading="lazy" onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE; }} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute left-2 top-2 rounded bg-gray-900/75 px-2 py-0.5 text-2xs font-semibold uppercase tracking-wide text-white">{product.region} · {product.island}</span>
                </div>
                {/* Thin amber weave accent — a nod to banig / rattan crafts */}
                <div className="h-[2px] bg-amber-100" />
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <p className="mb-1 flex items-center gap-1 text-2xs text-gray-400">
                      <i className="fa-solid fa-location-dot" aria-hidden="true"></i>{product.province}
                      {product.stock <= 0
                        ? <span className="ml-auto font-medium text-red-600">Out of stock</span>
                        : <span className="ml-auto font-medium text-green-600">In stock</span>
                      }
                    </p>
                    {product.reviewCount > 0 && (
                      <p className="mb-1 flex items-center gap-1 text-xs text-amber-500">
                        <i className="fa-solid fa-star text-[10px]" aria-hidden="true"></i>
                        <span className="tabular font-semibold">{product.rating.toFixed(1)}</span>
                        <span className="text-gray-400">({product.reviewCount})</span>
                      </p>
                    )}
                    <h3 className="text-sm font-semibold leading-snug text-gray-900">{product.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">{product.description}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                    <strong className="tabular text-base font-bold text-gray-900">{formatPeso(product.price)}</strong>
                    <div className="flex items-center gap-1.5">
                      <button type="button" onClick={() => { setSellerContactProduct(product); setSellerContactReturn(''); setModal('seller-contact'); }} className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50">
                        <i className="fa-solid fa-message text-gray-400" aria-hidden="true"></i>Seller
                      </button>
                      <button type="button" onClick={() => addToCart(product)} className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${product.stock <= 0 ? 'border border-red-200 bg-red-50 text-red-600 hover:bg-red-100' : 'bg-blue-700 text-white hover:bg-blue-800'}`}>
                        <i className={`fa-solid ${product.stock <= 0 ? 'fa-circle-exclamation' : 'fa-plus'}`} aria-hidden="true"></i>
                        {product.stock <= 0 ? 'Alternate' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="my-8 rounded-lg border border-gray-200 bg-white px-6 py-16 text-center">
            <i className="fa-solid fa-magnifying-glass-location mb-4 text-3xl text-gray-300" aria-hidden="true"></i>
            <h3 className="text-base font-semibold text-gray-800">No delicacies found</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">No products match your current filters or search terms.</p>
            <button type="button" onClick={resetFilters} className="mt-4 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Reset filters</button>
          </div>
        )}
      </main>
    </>
  ) : (
        <AboutPage
          onBackToShop={() => {
            setView('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenFlowchart={() => setModal('flowchart')}
        />
      )}

      <footer className="mt-8 border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex flex-col gap-0.5">
            <span>© 2026 E-Baligya</span>
            <span className="text-gray-300">Handcrafted for the archipelago</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <button type="button" onClick={() => { setView('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`hover:text-gray-700 transition ${view === 'about' ? 'font-semibold text-gray-900' : ''}`}>About</button>
            <button type="button" onClick={() => { setSupportReturnModal(''); setModal('customer-support'); }} className="hover:text-gray-700">Contact support</button>
            <button type="button" onClick={() => setModal('tracking')} className="hover:text-gray-700">Track an order</button>
            <button type="button" onClick={() => setModal('auth')} className="hover:text-gray-700">Account</button>
          </div>
        </div>
      </footer>

      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/40" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
          <aside role="dialog" aria-modal="true" aria-label="Shopping basket" className="ml-auto flex h-full w-full max-w-[440px] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Basket</h2>
                <p className="mt-0.5 text-xs text-gray-500"><span className="tabular">{itemCount}</span> items · <span className="tabular">{selectedItemCount}</span> selected</p>
              </div>
              <button type="button" onClick={() => setCartOpen(false)} aria-label="Close basket" className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"><i className="fa-solid fa-xmark" aria-hidden="true"></i></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cart.length > 0 && (
                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                  <p className="text-xs text-gray-500">Select items to include in this order.</p>
                  <button type="button" onClick={() => setSelectedCartIds(
                    selectedCartIds.length === cart.length ? [] : cart.map((item) => item.id)
                  )} className="shrink-0 text-xs font-medium text-blue-700 hover:text-blue-800">
                    {selectedCartIds.length === cart.length ? 'Clear all' : 'Select all'}
                  </button>
                </div>
              )}
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <i className="fa-solid fa-basket-shopping mb-4 text-3xl text-gray-200" aria-hidden="true"></i>
                  <h3 className="text-sm font-semibold text-gray-800">Basket is empty</h3>
                  <p className="mt-1 text-xs text-gray-500">Add a regional favorite to get started.</p>
                  <button type="button" onClick={continueBrowsing} className="mt-4 rounded-md bg-blue-700 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-800">Browse products</button>
                </div>
              ) : cart.map((item) => (
                <div key={item.id} className="flex items-start gap-3 border-b border-gray-100 pb-4">
                  <input
                    type="checkbox"
                    checked={selectedCartIds.includes(item.id)}
                    onChange={() => toggleCartItem(item.id)}
                    aria-label={`Select ${item.name} for checkout`}
                    className="mt-5 h-4 w-4 shrink-0 accent-blue-700"
                  />
                  <img src={item.image} alt="" className="h-14 w-14 rounded-md border border-gray-200 object-cover" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-xs font-semibold text-gray-900">{item.name}</h3>
                    <p className="mt-0.5 text-2xs text-gray-400">{item.region} · {item.island}</p>
                    <p className="tabular mt-1 text-sm font-bold text-gray-900">{formatPeso(item.price)}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-center gap-2">
                    <div className="flex items-center gap-0.5 rounded-md border border-gray-200 bg-gray-50">
                      <button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`} className="flex h-7 w-7 items-center justify-center rounded-l-md text-gray-500 hover:bg-gray-100">−</button>
                      <span className="tabular min-w-[1.5rem] text-center text-xs font-semibold text-gray-800">{item.quantity}</span>
                      <button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label={`Add one ${item.name}`} className="flex h-7 w-7 items-center justify-center rounded-r-md text-gray-500 hover:bg-gray-100">+</button>
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.id)} aria-label={`Delete ${item.name} from cart`} title="Remove from cart" className="rounded p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-600">
                      <i className="fa-solid fa-trash-can text-xs" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="space-y-3 border-t border-gray-200 p-5">
                <p className="text-xs text-gray-500">Shipping calculated at checkout based on delivery address.</p>
                <button type="button" onClick={openCheckout} className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800">
                  Checkout (<span className="tabular">{selectedItemCount}</span> selected) <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true"></i>
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {modal === 'out-of-stock' && selectedProduct && (
        <Modal title="Out of stock" icon="fa-boxes-stacked" onClose={() => setModal('')} size="max-w-md">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-800">{selectedProduct.name} is currently out of stock.</p>
            <p className="mt-1 text-xs text-gray-500">The regional MSME maker is preparing the next fresh batch.</p>
          </div>
          {(() => {
            const alternate = delicacies.find((item) => item.id === selectedProduct.alternateId)
              || delicacies.find((item) => item.island === selectedProduct.island && item.stock > 0);
            return alternate ? (
              <div className="mt-5 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <img src={alternate.image} alt="" className="h-14 w-14 rounded-md object-cover" />
                <div className="min-w-0 flex-1"><strong className="block truncate text-xs text-gray-900">{alternate.name}</strong><span className="text-2xs text-gray-500">{alternate.region} · {alternate.maker}</span><strong className="tabular block text-sm text-gray-900">{formatPeso(alternate.price)}</strong></div>
                <button type="button" onClick={addAlternate} className="rounded-md bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800">Add</button>
              </div>
            ) : <p className="mt-4 text-center text-xs text-gray-500">No in-stock alternative is available right now.</p>;
          })()}
        </Modal>
      )}

      {modal === 'seller-contact' && sellerContactProduct && (
        <Modal title="Contact seller" icon="fa-store" onClose={() => { setModal(sellerContactReturn); setSellerContactReturn(''); }} size="max-w-md">
          <div className="space-y-4">
            <section className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-2xs font-semibold uppercase tracking-wide text-gray-400">Seller</p>
              <h3 className="mt-1 text-sm font-semibold text-gray-900">{sellerContactProduct.maker}</h3>
              <p className="mt-2 flex items-start gap-2 text-xs text-gray-600">
                <i className="fa-solid fa-location-dot mt-0.5 text-gray-400" aria-hidden="true"></i>
                <span>{sellerContactProduct.province}</span>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                No direct contact listed. Send an inquiry through this form.
              </p>
            </section>
            <form onSubmit={submitSellerInquiry} className="space-y-3">
              <label className="block text-xs font-medium text-gray-700">Your email
                <input required type="email" defaultValue={currentUser.isLoggedIn ? currentUser.email : ''} placeholder="you@example.com" className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </label>
              <label className="block text-xs font-medium text-gray-700">Message about {sellerContactProduct.name}
                <textarea required rows="4" placeholder="Write your question for the seller..." className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100"></textarea>
              </label>
              <p className="text-xs text-gray-400">Demo only — inquiries are not sent to the maker.</p>
              <button type="submit" className="w-full rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">
                <i className="fa-solid fa-paper-plane mr-1.5" aria-hidden="true"></i>Send inquiry
              </button>
            </form>
          </div>
        </Modal>
      )}

      {modal === 'customer-support' && (
        <Modal title="Customer support" icon="fa-headset" onClose={() => setModal(supportReturnModal)} size="max-w-md">
          <form onSubmit={submitCustomerSupportRequest} className="space-y-3">
            {supportReturnModal === 'tracking' && (
              <p className="rounded-md border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
                Order <strong className="text-gray-800">{activeOrder.orderId}</strong>
              </p>
            )}
            <label className="block text-xs font-medium text-gray-700">Your email
              <input required type="email" autoComplete="email" defaultValue={currentUser.isLoggedIn ? currentUser.email : ''} placeholder="you@example.com" className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </label>
            <label className="block text-xs font-medium text-gray-700">How can we help?
              <textarea required rows="4" placeholder="Describe your question or concern..." className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100"></textarea>
            </label>
            <p className="text-xs text-gray-400">Demo only — messages are not delivered to a support team.</p>
            <button type="submit" className="w-full rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">
              <i className="fa-solid fa-paper-plane mr-1.5" aria-hidden="true"></i>Send support request
            </button>
          </form>
        </Modal>
      )}

      {modal === 'checkout' && (
        <Modal title="Checkout" icon="fa-cash-register" onClose={() => setModal('')}>
          <form onSubmit={executePayment} className="space-y-5">
            <p className="rounded-md border border-blue-100 bg-blue-50 p-3 text-xs leading-relaxed text-blue-800">
              <i className="fa-solid fa-circle-info mr-1.5" aria-hidden="true"></i>
              Demo checkout — no real payment is processed. Review items and address before placing the order.
            </p>
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Order items (<span className="tabular">{selectedItemCount}</span>)
              </h3>
              <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                {selectedCartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-md bg-white p-2.5">
                    <img src={item.image} alt="" className="h-10 w-10 rounded-md border border-gray-200 object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-gray-800">{item.name}</p>
                      <p className="tabular text-2xs text-gray-400">Qty {item.quantity} · {formatPeso(item.price)} each</p>
                    </div>
                    <strong className="tabular text-xs text-gray-800">{formatPeso(item.price * item.quantity, 2)}</strong>
                  </div>
                ))}
                <div className="tabular mt-1 flex justify-between border-t border-gray-100 pt-2 text-xs text-gray-500">
                  <span>Items subtotal</span><span>{formatPeso(subtotal, 2)}</span>
                </div>
              </div>
            </section>
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Delivery address</h3>
              <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                {savedAddresses.map((address) => (
                  <div key={address.id} className={`flex items-start gap-3 rounded-md border bg-white p-3 ${selectedCheckoutAddressId === address.id ? 'border-blue-400 ring-1 ring-blue-100' : 'border-gray-200'}`}>
                    <label className="flex min-w-0 flex-1 cursor-pointer gap-3">
                      <input type="radio" name="checkoutAddress" checked={selectedCheckoutAddressId === address.id} onChange={() => chooseCheckoutAddress(address.id)} className="mt-0.5 accent-blue-700" />
                      <span className="min-w-0 text-xs text-gray-700">
                        <span className="flex flex-wrap items-center gap-2 font-semibold text-gray-900">
                          {address.label || 'Address'} · {address.name}
                          {address.isDefault && <span className="rounded border border-gray-200 px-1.5 py-0.5 text-2xs font-medium text-gray-500">Default</span>}
                        </span>
                        <span className="mt-1 block text-gray-500">{address.phone} · {address.email || currentUser.email}</span>
                        <span className="mt-0.5 block text-gray-500">{address.address}, {address.city}, {address.province}</span>
                      </span>
                    </label>
                    <button type="button" onClick={() => editCheckoutAddress(address)} aria-label={`Edit ${address.label || 'saved'} delivery address`} title="Edit delivery contact and address" className="shrink-0 rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                      <i className="fa-solid fa-pen-to-square" aria-hidden="true"></i>
                    </button>
                  </div>
                ))}
                <label className={`flex cursor-pointer items-center gap-3 rounded-md border bg-white p-3 text-sm font-medium ${selectedCheckoutAddressId === 'new' ? 'border-blue-400 ring-1 ring-blue-100' : 'border-gray-200'}`}>
                  <input type="radio" name="checkoutAddress" checked={selectedCheckoutAddressId === 'new'} onChange={() => chooseCheckoutAddress('new')} className="accent-blue-700" />
                  <span><i className="fa-solid fa-plus mr-2 text-gray-400" aria-hidden="true"></i>Deliver to a new address</span>
                </label>
              </div>

              {(selectedCheckoutAddressId === 'new' || editingCheckoutAddressId === selectedCheckoutAddressId) && (
                <div className="mt-3 grid gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:grid-cols-2">
                  <label className="text-xs font-medium text-gray-700">Recipient name
                    <input required autoComplete="name" value={checkoutAddress.name} onChange={(event) => { setCheckoutAddressError(''); setCheckoutAddress((address) => ({ ...address, name: event.target.value })); }} className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-300 focus:outline-none" />
                  </label>
                  <label className="text-xs font-medium text-gray-700">Phone number
                    <input required type="tel" autoComplete="tel" placeholder="0917 123 4567" aria-invalid={Boolean(checkoutAddressError && !isValidPhilippinePhone(checkoutAddress.phone))} value={checkoutAddress.phone} onChange={(event) => { setCheckoutAddressError(''); setCheckoutAddress((address) => ({ ...address, phone: event.target.value })); }} className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-300 focus:outline-none" />
                  </label>
                  <label className="text-xs font-medium text-gray-700 sm:col-span-2">Email address
                    <input required type="email" autoComplete="email" aria-invalid={Boolean(checkoutAddressError && !isValidEmail(checkoutAddress.email))} value={checkoutAddress.email} onChange={(event) => {
                      const email = event.target.value;
                      setCheckoutAddressError(email && !isValidEmail(email) ? 'Enter a valid email address for this delivery contact.' : '');
                      setCheckoutAddress((address) => ({ ...address, email }));
                    }} className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-300 focus:outline-none" />
                  </label>
                  <label className="text-xs font-medium text-gray-700 sm:col-span-2">Street / Barangay / Landmark
                    <input required autoComplete="street-address" aria-invalid={Boolean(checkoutAddressError && !checkoutAddress.address.trim())} value={checkoutAddress.address} onChange={(event) => { setCheckoutAddressError(''); setCheckoutAddress((address) => ({ ...address, address: event.target.value })); }} className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-300 focus:outline-none" />
                  </label>
                  <label className="text-xs font-medium text-gray-700">Province
                    <select required value={checkoutAddress.province} onChange={(event) => {
                      setCheckoutAddressError('');
                      const province = event.target.value;
                      setCheckoutAddress((address) => ({ ...address, province, city: '' }));
                    }} className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-300 focus:outline-none">
                      <option value="">Select province</option>
                      {PROVINCE_OPTIONS.map((province) => <option key={province} value={province}>{province}</option>)}
                    </select>
                  </label>
                  <label className="text-xs font-medium text-gray-700">City / Municipality
                    <select required value={checkoutAddress.city} onChange={(event) => { setCheckoutAddressError(''); setCheckoutAddress((address) => ({ ...address, city: event.target.value })); }} className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-300 focus:outline-none">
                      <option value="">Select city / municipality</option>
                      {(PH_PROVINCES[checkoutAddress.province] || []).map((city) => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </label>
                  {currentUser.isLoggedIn && (
                    selectedCheckoutAddressId === 'new' && <div className="space-y-2 sm:col-span-2">
                      <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                        <input type="checkbox" checked={saveCheckoutAddress} onChange={(event) => {
                          setSaveCheckoutAddress(event.target.checked);
                          if (!event.target.checked) setMakeCheckoutAddressDefault(false);
                        }} className="accent-blue-700" />
                        Save this address to my address book
                      </label>
                      {saveCheckoutAddress && (
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                          <input type="checkbox" checked={makeCheckoutAddressDefault} onChange={(event) => setMakeCheckoutAddressDefault(event.target.checked)} className="accent-blue-700" />
                          Set as my default address
                        </label>
                      )}
                    </div>
                  )}
                  {editingCheckoutAddressId && (
                    <div className="flex gap-2 sm:col-span-2">
                      <button type="button" onClick={() => { setEditingCheckoutAddressId(null); chooseCheckoutAddress(editingCheckoutAddressId); }} className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                      <button type="button" onClick={saveCheckoutAddressChanges} className="flex-1 rounded-md bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800">Save changes</button>
                    </div>
                  )}
                </div>
              )}
              {checkoutAddressError && <p role="alert" className="mt-2 text-xs font-medium text-red-600">{checkoutAddressError}</p>}
              <label className="mt-3 block text-xs font-medium text-gray-700">Delivery instructions <span className="font-normal text-gray-400">(optional)</span>
                <textarea rows="2" value={checkoutDeliveryNotes} onChange={(event) => setCheckoutDeliveryNotes(event.target.value)} placeholder="Gate code, landmark, or when to call" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-300 focus:outline-none" />
              </label>
            </section>
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Payment method</h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  ['GCash', 'G', 'E-Wallet', 'bg-blue-600'],
                  ['Maya', 'M', 'Scan QR', 'bg-emerald-600'],
                  ['Card', 'C', 'Debit/Credit', 'bg-gray-800'],
                  ['COD', '₱', 'Doorstep', 'bg-amber-600']
                ].map(([method, symbol, hint, color]) => (
                  <label key={method} className={`flex cursor-pointer flex-col items-center rounded-lg border p-3 text-center transition ${paymentMethod === method ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                    <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="sr-only" />
                    <span className={`mb-1.5 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${color}`}>{symbol}</span>
                    <strong className="text-xs text-gray-800">{method}</strong><span className="text-2xs text-gray-400">{hint}</span>
                  </label>
                ))}
              </div>
            </section>
            <div className="rounded-lg border border-gray-200 p-3 text-sm">
              <div className="mb-2 flex justify-between gap-3 text-xs text-gray-400">
                <span>Destination</span>
                <span className="text-right font-medium text-gray-600">{checkoutAddress.city}, {checkoutAddress.province}</span>
              </div>
              <div className="tabular flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPeso(subtotal, 2)}</span></div>
              <div className="tabular mt-1 flex justify-between text-gray-600"><span>Estimated shipping</span><span>{formatPeso(shipping, 2)}</span></div>
              <div className="tabular mt-2 flex justify-between border-t border-gray-100 pt-2 font-semibold text-gray-900"><span>Total</span><span>{formatPeso(total, 2)}</span></div>
            </div>
            <div className="flex gap-3 border-t border-gray-100 pt-4">
              <button type="button" onClick={() => setModal('')} className="flex-1 rounded-md border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={paymentLoading} className="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60">
                {paymentLoading ? <><i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Authorizing...</> : <><i className="fa-solid fa-lock" aria-hidden="true"></i> Place order</>}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'tracking' && (
        <Modal title="Track order" icon="fa-box-open" onClose={() => setModal('')} size="max-w-2xl">
          <p className="mb-4 rounded-md border border-blue-100 bg-blue-50 p-3 text-xs leading-relaxed text-blue-800">
            Demo tracking — live courier updates are not connected. The timeline below is illustrative.
          </p>
          <form onSubmit={performTrackingLookup} className="mb-5 grid gap-2 sm:grid-cols-[1fr_auto]">
            <label className="text-xs font-medium text-gray-500">Order ID
              <input value={trackInputId} onChange={(event) => setTrackInputId(event.target.value)} placeholder="e.g. EB-2026-7842" className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm normal-case text-gray-800 focus:border-gray-300 focus:outline-none" />
            </label>
            <button type="submit" className="self-end rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">Track</button>
          </form>
          <div className="flex flex-col justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center">
            <div><span className="text-2xs font-semibold uppercase tracking-wider text-gray-400">Active package</span><h3 className="tabular font-mono text-xl font-bold text-gray-900">{activeOrder.orderId}</h3><span className="text-xs text-gray-500">Routed via Philippine domestic delivery</span></div>
            <div className="rounded-md border border-gray-200 bg-white px-3.5 py-2 text-right"><span className="block text-2xs font-semibold uppercase text-gray-400">Demo payment</span><strong className="text-sm text-gray-800">{activeOrder.paymentMethod || 'GCash'} selected</strong><span className="block text-2xs text-gray-400">Not charged — no escrow connected</span></div>
          </div>
          {activeOrder.deliveryAddress && (
            <section className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-xs font-semibold text-gray-700"><i className="fa-solid fa-location-dot mr-1.5 text-gray-400" aria-hidden="true"></i>Delivery details</h3>
              <p className="mt-2 text-xs font-semibold text-gray-800">{activeOrder.deliveryAddress.name}</p>
              <p className="text-xs text-gray-500">{activeOrder.deliveryAddress.address}, {activeOrder.deliveryAddress.city}, {activeOrder.deliveryAddress.province}</p>
              <p className="mt-1 text-xs text-gray-500">{activeOrder.deliveryAddress.phone} · {activeOrder.deliveryAddress.email}</p>
              {activeOrder.deliveryAddress.deliveryNotes && <p className="mt-1 text-xs text-gray-400">Instructions: {activeOrder.deliveryAddress.deliveryNotes}</p>}
              <p className="mt-2 text-xs text-gray-400">Payment: {activeOrder.paymentMethod}</p>
            </section>
          )}
          <section className="mt-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Shipment timeline</h3>
            <ol className="ml-3 space-y-5 border-l-2 border-gray-200 pl-6 text-xs">
              {[
                ['Origin hub: regional MSME dispatched', 'Producer packed authentic pasalubong at the regional hub.', 'fa-box'],
                ['Inter-island package transit', 'Package departed the regional sorting hub.', 'fa-plane'],
                ['Last-mile courier at buyer address', 'Assigned to a local courier for final delivery.', 'fa-motorcycle'],
                ['Delivery and customer receipt', 'Awaiting doorstep handover and recipient confirmation.', 'fa-box-open']
              ].map(([title, description, icon], index) => {
                const complete = index < 2;
                return <li key={title} className="relative">
                  <span className={`absolute -left-[34px] top-0 flex h-6 w-6 items-center justify-center rounded-full text-[10px] ring-4 ring-white ${complete ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}><i className={`fa-solid ${complete ? 'fa-check' : icon}`} aria-hidden="true"></i></span>
                  <strong className="text-gray-900">{title}</strong><p className="mt-0.5 text-[11px] text-gray-500">{description}</p>
                </li>;
              })}
            </ol>
          </section>
          <section className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-xs font-semibold text-gray-800"><i className="fa-solid fa-store mr-1.5 text-gray-400" aria-hidden="true"></i>Contact a seller</h3>
              {activeOrder.products?.length ? (
                <div className="mt-3 space-y-2">
                  {activeOrder.products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between gap-2 rounded-md bg-white p-2.5 border border-gray-200">
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-semibold text-gray-800">{product.maker}</p>
                        <p className="truncate text-[10px] text-gray-500">{product.name} · {product.province}</p>
                      </div>
                      <button type="button" onClick={() => contactOrderSeller(product)} className="shrink-0 rounded-md border border-gray-200 px-2.5 py-1.5 text-[10px] font-semibold text-gray-700 hover:border-gray-300 hover:text-gray-900">Contact</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-[10px] leading-relaxed text-gray-500">Seller contacts are available for orders placed in this demo. Look up an order to view its sellers.</p>
              )}
            </div>
            <div className="flex flex-col items-start rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-xs font-semibold text-gray-800"><i className="fa-solid fa-headset mr-1.5 text-gray-400" aria-hidden="true"></i>Customer support</h3>
              <p className="mt-2 flex-1 text-[10px] leading-relaxed text-gray-500">Need help with this order? Send a message to the E-Baligya support team.</p>
              <button type="button" onClick={() => { setSupportReturnModal('tracking'); setModal('customer-support'); }} className="mt-3 rounded-md bg-blue-700 px-3 py-2 text-[10px] font-semibold text-white hover:bg-blue-800">
                Contact support
              </button>
            </div>
          </section>
        </Modal>
      )}

      {modal === 'review' && (
        <Modal title="Rate & review pasalubong" icon="fa-star" onClose={() => setModal('')} size="max-w-md">
          <form onSubmit={submitReview} className="space-y-5">
            <p className="text-xs text-gray-500">Your feedback helps the local maker improve quality and freshness.</p>
            {Object.entries({ taste: 'Taste', packaging: 'Packaging', freshness: 'Freshness' }).map(([metric, label]) => (
              <fieldset key={metric}>
                <legend className="text-xs font-semibold text-gray-700">{label} <span className="font-normal text-gray-400">· {ratings[metric]} / 5</span></legend>
                <div className="mt-1 flex gap-1">
                  {[1, 2, 3, 4, 5].map((score) => <button key={score} type="button" onClick={() => setRatings((current) => ({ ...current, [metric]: score }))} aria-label={`${score} stars for ${label}`} className={`text-xl ${score <= ratings[metric] ? 'text-amber-400' : 'text-gray-300'}`}><i className={`fa-${score <= ratings[metric] ? 'solid' : 'regular'} fa-star`} aria-hidden="true"></i></button>)}
                </div>
              </fieldset>
            ))}
            <label className="block text-xs font-semibold text-gray-700">Review (optional)<textarea rows="3" placeholder="Share your experience..." className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-xs font-normal focus:outline-none focus:ring-1 focus:ring-blue-100"></textarea></label>
            <button type="submit" className="w-full rounded-md bg-blue-700 px-4 py-3 text-xs font-semibold text-white hover:bg-blue-800">Submit review</button>
          </form>
        </Modal>
      )}

      {modal === 'auth' && (
        <Modal title={authTab === 'forgot' ? 'Reset your password' : currentUser.isLoggedIn ? 'Customer profile' : 'Your account'} icon="fa-user" onClose={() => setModal('')} size="max-w-lg">
          {currentUser.isLoggedIn && authTab !== 'forgot' ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center gap-3 rounded-md bg-white border border-gray-200 p-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                    {currentUser.name.split(' ').slice(0, 2).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                    <p className="text-[11px] text-gray-500">{currentUser.email}</p>
                  </div>
                </div>
              </div>

              {!profileEdit ? (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Full name</p>
                      <p className="mt-1 text-sm font-semibold text-gray-800">{currentUser.name}</p>
                    </div>
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Phone</p>
                      <p className="mt-1 text-sm font-semibold text-gray-800">{currentUser.phone}</p>
                    </div>
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-3 sm:col-span-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Email</p>
                      <p className="mt-1 text-sm font-semibold text-gray-800">{currentUser.email}</p>
                    </div>
                    <section className="space-y-3 rounded-md border border-gray-200 bg-gray-50 p-3 sm:col-span-2">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-xs font-semibold text-gray-800">Delivery addresses</h3>
                          <p className="mt-0.5 text-[10px] text-gray-500">Manage saved destinations and choose a default for checkout.</p>
                        </div>
                        <button type="button" onClick={() => {
                          setAddressDraft({ label: '', name: currentUser.name, phone: currentUser.phone, email: currentUser.email, address: '', city: '', province: '', isDefault: savedAddresses.length === 0 });
                          setEditingAddressId(null);
                          setAddressBookError('');
                          setAddressFormOpen(true);
                        }} className="shrink-0 rounded-md bg-blue-700 px-3 py-2 text-[10px] font-semibold text-white hover:bg-blue-800">
                          <i className="fa-solid fa-plus mr-1" aria-hidden="true"></i>Add address
                        </button>
                      </div>
                      {savedAddresses.length ? savedAddresses.map((address) => (
                        <article key={address.id} className="rounded-md border border-gray-200 bg-white p-3">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs font-semibold text-gray-800">{address.label || 'Address'} · {address.name}</p>
                                {address.isDefault && <span className="rounded border border-gray-200 px-2 py-0.5 text-[9px] font-semibold uppercase text-gray-500">Default</span>}
                              </div>
                              <p className="mt-1 text-[11px] text-gray-600">{address.phone}</p>
                              <p className="mt-1 text-[11px] text-gray-600">{address.email || currentUser.email}</p>
                              <p className="mt-1 text-[11px] text-gray-600">{address.address}, {address.city}, {address.province}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {!address.isDefault && <button type="button" onClick={() => setDefaultDeliveryAddress(address.id)} className="text-[10px] font-semibold text-blue-700 hover:text-blue-800">Set default</button>}
                              <button type="button" onClick={() => startAddressEdit(address)} className="text-[10px] font-semibold text-gray-600 hover:text-gray-900">Edit</button>
                              <button type="button" onClick={() => removeDeliveryAddress(address.id)} className="text-[10px] font-semibold text-rose-600 hover:text-rose-800">Remove</button>
                            </div>
                          </div>
                        </article>
                      )) : <p className="rounded-md bg-white border border-gray-200 p-3 text-xs text-gray-500">No saved addresses yet. Add one to speed up checkout.</p>}

                      {addressFormOpen && (
                        <form onSubmit={saveAddressToBook} className="space-y-3 rounded-md border border-gray-200 bg-white p-3">
                          <h4 className="text-xs font-semibold text-gray-800">{editingAddressId ? 'Edit address' : 'Add a new address'}</h4>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <label className="text-[10px] font-semibold text-gray-600">Address label
                              <input required value={addressDraft.label} onChange={(event) => setAddressDraft((draft) => ({ ...draft, label: event.target.value }))} placeholder="Home, Work, Vacation..." className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-xs font-normal" />
                            </label>
                            <label className="text-[10px] font-semibold text-gray-600">Recipient name
                              <input required value={addressDraft.name} onChange={(event) => setAddressDraft((draft) => ({ ...draft, name: event.target.value }))} className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-xs font-normal" />
                            </label>
                            <label className="text-[10px] font-semibold text-gray-600">Phone number
                              <input required type="tel" value={addressDraft.phone} onChange={(event) => setAddressDraft((draft) => ({ ...draft, phone: event.target.value }))} className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-xs font-normal" />
                            </label>
                            <label className="text-[10px] font-semibold text-gray-600 sm:col-span-2">Email address
                              <input required type="email" autoComplete="email" aria-invalid={Boolean(addressBookError && !isValidEmail(addressDraft.email))} value={addressDraft.email} onChange={(event) => {
                                const email = event.target.value;
                                setAddressBookError(email && !isValidEmail(email) ? 'Enter a valid email address for this delivery contact.' : '');
                                setAddressDraft((draft) => ({ ...draft, email }));
                              }} className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-xs font-normal" />
                            </label>
                            <label className="text-[10px] font-semibold text-gray-600 sm:col-span-2">Street / Barangay / Landmark
                              <input required aria-invalid={Boolean(addressBookError)} value={addressDraft.address} onChange={(event) => { setAddressBookError(''); setAddressDraft((draft) => ({ ...draft, address: event.target.value })); }} className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-xs font-normal" />
                            </label>
                            <label className="text-[10px] font-semibold text-gray-600">Province
                              <select required value={addressDraft.province} onChange={(event) => {
                                setAddressBookError('');
                                const province = event.target.value;
                                setAddressDraft((draft) => ({ ...draft, province, city: (PH_PROVINCES[province] || [])[0] || '' }));
                              }} className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-normal">
                                <option value="">Select province</option>
                                {PROVINCE_OPTIONS.map((province) => <option key={province} value={province}>{province}</option>)}
                              </select>
                            </label>
                            <label className="text-[10px] font-semibold text-gray-600">City / Municipality
                              <select required value={addressDraft.city} onChange={(event) => { setAddressBookError(''); setAddressDraft((draft) => ({ ...draft, city: event.target.value })); }} className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-normal">
                                <option value="">Select city / municipality</option>
                                {(PH_PROVINCES[addressDraft.province] || []).map((city) => <option key={city} value={city}>{city}</option>)}
                              </select>
                            </label>
                          </div>
                          <label className="flex items-center gap-2 text-[10px] font-medium text-gray-600">
                            <input type="checkbox" checked={addressDraft.isDefault} onChange={(event) => setAddressDraft((draft) => ({ ...draft, isDefault: event.target.checked }))} className="accent-blue-700" />
                            Set as my default address
                          </label>
                          {addressBookError && <p role="alert" className="text-xs font-medium text-red-600">{addressBookError}</p>}
                          <div className="flex gap-2">
                            <button type="button" onClick={() => { setAddressFormOpen(false); setEditingAddressId(null); setAddressBookError(''); }} className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-[10px] font-semibold text-gray-700">Cancel</button>
                            <button type="submit" className="flex-1 rounded-md bg-blue-700 px-3 py-2 text-[10px] font-semibold text-white hover:bg-blue-800">{editingAddressId ? 'Save address' : 'Add address'}</button>
                          </div>
                        </form>
                      )}
                    </section>
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Preferred payment</p>
                      <p className="mt-1 text-sm font-semibold text-gray-800">{currentUser.paymentMethod}</p>
                    </div>
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Delivery notes</p>
                      <p className="mt-1 text-sm font-semibold text-gray-800">{currentUser.deliveryNotes || 'No notes added.'}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setProfileEdit(true)} className="flex-1 rounded-md bg-blue-700 px-4 py-3 text-xs font-semibold text-white hover:bg-blue-800">Edit profile</button>
                    <button type="button" onClick={logoutUser} className="flex-1 rounded-md border border-gray-200 px-4 py-3 text-xs font-semibold text-gray-700 hover:bg-gray-50">Logout</button>
                  </div>
                </div>
              ) : (
                <form onSubmit={saveProfile} className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-[11px] font-semibold text-gray-600">Full name
                      <input value={profileDraft.name} onChange={(event) => setProfileDraft((draft) => ({ ...draft, name: event.target.value }))} className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-xs font-normal text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-100" />
                    </label>
                    <label className="text-[11px] font-semibold text-gray-600">Phone number
                      <input value={profileDraft.phone} onChange={(event) => setProfileDraft((draft) => ({ ...draft, phone: event.target.value }))} className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-xs font-normal text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-100" />
                    </label>
                    <label className="sm:col-span-2 text-[11px] font-semibold text-gray-600">Email address
                      <input type="email" value={profileDraft.email} onChange={(event) => setProfileDraft((draft) => ({ ...draft, email: event.target.value }))} className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-xs font-normal text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-100" />
                    </label>
                    <label className="text-[11px] font-semibold text-gray-600">Preferred payment method
                      <select value={profileDraft.paymentMethod} onChange={(event) => setProfileDraft((draft) => ({ ...draft, paymentMethod: event.target.value }))} className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-normal text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-100">
                        {['GCash', 'Maya', 'Card', 'COD'].map((method) => <option key={method} value={method}>{method}</option>)}
                      </select>
                    </label>
                    <label className="text-[11px] font-semibold text-gray-600">Delivery notes
                      <input value={profileDraft.deliveryNotes} onChange={(event) => setProfileDraft((draft) => ({ ...draft, deliveryNotes: event.target.value }))} className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-xs font-normal text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-100" />
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => { setProfileEdit(false); setProfileDraft(currentUser); }} className="flex-1 rounded-md border border-gray-200 px-4 py-3 text-xs font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="flex-1 rounded-md bg-blue-700 px-4 py-3 text-xs font-semibold text-white hover:bg-blue-800">Save changes</button>
                  </div>
                </form>
              )}
            </div>
          ) : authTab === 'forgot' ? (
            <form key="forgot-password" onSubmit={submitPasswordReset} className="space-y-3">
              <p className="text-xs leading-relaxed text-gray-500">Enter the email address associated with your account to request a password reset.</p>
              <label className="block text-xs font-semibold text-gray-600">Email address
                <input required name="resetEmail" type="email" autoComplete="email" value={resetEmail} onChange={(event) => { setResetEmail(event.target.value); setResetMessage(''); }} placeholder="you@example.com" className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-xs font-normal focus:outline-none focus:ring-1 focus:ring-blue-100" />
              </label>
              {resetMessage && <p role="status" className="rounded-md border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">{resetMessage}</p>}
              <button type="submit" className="w-full rounded-md bg-blue-700 px-4 py-3 text-xs font-semibold text-white hover:bg-blue-800">Request password reset</button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-100 p-1">
                <div className="flex rounded-md">
                  {['login', 'register'].map((tab) => (
                    <button key={tab} type="button" onClick={() => setAuthTab(tab)} className={`flex-1 rounded-md py-2 text-xs font-semibold capitalize ${authTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                      {tab === 'login' ? 'Log in' : 'Create account'}
                    </button>
                  ))}
                </div>
              </div>

              <form key={authTab} onSubmit={submitAuth} className="space-y-3">
                {authTab === 'register' && (
                  <>
                    <label className="block text-xs font-semibold text-gray-600">Full name
                      <input required name="name" autoComplete="name" placeholder="Your full name" className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-xs font-normal focus:outline-none focus:ring-1 focus:ring-blue-100" />
                    </label>
                    <label className="block text-xs font-semibold text-gray-600">Phone number
                      <input required name="phone" type="tel" autoComplete="tel" placeholder="+63 917 123 4567" className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-xs font-normal focus:outline-none focus:ring-1 focus:ring-blue-100" />
                    </label>
                  </>
                )}
                <label className="block text-xs font-semibold text-gray-600">Email address
                  <input required name="email" type="email" autoComplete="email" defaultValue={authTab === 'login' ? currentUser.email || '' : ''} placeholder="you@example.com" className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-xs font-normal focus:outline-none focus:ring-1 focus:ring-blue-100" />
                </label>
                <label className="block text-xs font-semibold text-gray-600">Password
                  <input required name="password" type="password" autoComplete={authTab === 'login' ? 'current-password' : 'new-password'} minLength={8} placeholder={authTab === 'login' ? 'Enter your password' : 'At least 8 characters'} className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-xs font-normal focus:outline-none focus:ring-1 focus:ring-blue-100" />
                </label>
                {authTab === 'login' ? (
                  <div className="text-right">
                    <button type="button" onClick={() => { setAuthTab('forgot'); setResetEmail(''); setResetMessage(''); }} className="text-xs font-semibold text-blue-700 hover:text-blue-800">Forgot password?</button>
                  </div>
                ) : (
                  <label className="block text-xs font-semibold text-gray-600">Confirm password
                    <input required name="confirmPassword" type="password" autoComplete="new-password" minLength={8} placeholder="Re-enter your password" className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-xs font-normal focus:outline-none focus:ring-1 focus:ring-blue-100" />
                  </label>
                )}
                <button type="submit" className="w-full rounded-md bg-blue-700 px-4 py-3 text-xs font-semibold text-white hover:bg-blue-800">{authTab === 'login' ? 'Log in' : 'Create account'}</button>
              </form>
            </div>
          )}
        </Modal>
      )}

      {modal === 'flowchart' && (
        <Modal title="System flowchart specification" icon="fa-diagram-project" onClose={() => setModal('')} size="max-w-2xl">
          <p className="text-sm leading-relaxed text-gray-600">Orders are routed from regional MSME makers to customers with funds held in escrow until delivery is confirmed.</p>
          <ol className="mt-5 space-y-3">
            {[
              ['Browse regional shelves', 'Filter by island group or region, search products, and compare prices and ratings.'],
              ['Check stock & basket', 'Available items can be added to the basket. Out-of-stock items show an in-stock regional alternative.'],
              ['Checkout & escrow', 'Choose a Philippine payment method and confirm the delivery address. Payment is securely held in escrow.'],
              ['Origin dispatch & package delivery', 'The maker prepares the order and routes it via ground courier or domestic air/sea delivery.'],
              ['Delivery outcome', 'Successful buyer confirmation releases escrow to the maker. Failed delivery keeps funds secure for a re-attempt.'],
              ['Review', 'After confirmed delivery, buyers can rate taste, packaging, and freshness.']
            ].map(([title, text], index) => <li key={title} className="flex gap-3 rounded-md border border-gray-200 p-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">{index + 1}</span><div><h3 className="text-xs font-semibold text-gray-900">{title}</h3><p className="mt-0.5 text-xs text-gray-500">{text}</p></div></li>)}
          </ol>
        </Modal>
      )}

      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[90] flex w-[min(90vw,24rem)] flex-col gap-2">
        {toasts.map((toast) => {
          const colors = {
            info: 'border-blue-200',
            success: 'border-emerald-200',
            warning: 'border-amber-200',
            error: 'border-rose-200'
          };
          const icons = {
            info: 'fa-circle-info text-blue-500',
            success: 'fa-circle-check text-emerald-500',
            warning: 'fa-triangle-exclamation text-amber-500',
            error: 'fa-circle-xmark text-rose-500'
          };
          return <div key={toast.id} className={`flex items-center gap-2.5 rounded-lg border bg-white px-4 py-3 text-xs text-gray-800 shadow-sm ${colors[toast.type]}`}>
            <i className={`fa-solid ${icons[toast.type]}`} aria-hidden="true"></i><span className="font-medium">{toast.message}</span>
          </div>;
        })}
      </div>
    </div>
  );
}

export default App;
