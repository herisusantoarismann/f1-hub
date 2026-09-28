/**
 * Formula 1 Teams & Constructors Comprehensive Intelligence Database
 * Includes Headquarters details, history, technical facilities, management structure, and car specs.
 * Updated with the official 2026 11-team grid, active drivers, and official reserve/third drivers.
 */

export interface TeamLeader {
    name: string;
    role: string;
    nationality: string;
    bio: string;
    headshotUrl?: string;
}

export interface TeamHeadquarters {
    facilityName: string;
    location: string;
    country: string;
    establishedYear: number;
    facilitySize: string;
    workforce: string;
    powerUnitPartner: string;
    keyFacilities: string[];
    description: string;
}

export interface TeamCarSpecs {
    carModel: string;
    chassis: string;
    engine: string;
    transmission: string;
    brakes: string;
    weightKg: number;
    aerodynamics?: string;
    fuelSpec?: string;
}

export interface TeamActiveDriver {
    driverId: string;
    permanentNumber: string;
    code: string;
    givenName: string;
    familyName: string;
    nationality: string;
}

export interface TeamReserveDriver {
    driverId: string;
    givenName: string;
    familyName: string;
    nationality: string;
    role: string;
    permanentNumber?: string;
    constructorId: string;
    officialTeamName: string;
}

export interface TeamTechnicalProfile {
    constructorId: string;
    officialTeamName: string;
    carModel: string;
    headquarters: TeamHeadquarters;
    management: TeamLeader[];
    carSpecs: TeamCarSpecs;
    celebrationHeadline?: string;
    celebrationDescription?: string;
    activeDrivers: TeamActiveDriver[];
    reserveDrivers: TeamReserveDriver[];
}

export const TEAMS_DATABASE: Record<string, TeamTechnicalProfile> = {
    mercedes: {
        constructorId: "mercedes",
        officialTeamName: "Mercedes AMG Petronas",
        carModel: "W17",
        headquarters: {
            facilityName: "Brackley Technology Centre & Brixworth Engine Base",
            location:
                "Brackley (Sasis) & Brixworth (Mesin), Northamptonshire, Inggris",
            country: "United Kingdom",
            establishedYear: 2010,
            facilitySize: "60.000 m² (Pusat Inovasi Hijau)",
            workforce: "~1.500 karyawan",
            powerUnitPartner:
                "Mercedes-AMG High Performance Powertrains (Brixworth 2026)",
            keyFacilities: [
                "Terowongan Angin Skala 60% Brackley",
                "Dyno Sel Uji Mesin HPP Brixworth Generasi 2026",
                "Pusat Pemodelan Simulasi AI & Cloud Hybrid",
                "Laboratorium Kinerja Biofuel & E-Fuel PETRONAS",
            ],
            description:
                "Pabrik Mercedes di Brackley dan pusat mesin di Brixworth memegang rekor 8 gelar Konstruktor Dunia beruntun. Untuk regulasi baru 2026, Mercedes mengembangkan mobil W17 E Performance dengan unit daya generasi terbaru dan efisiensi termal tertinggi bersama PETRONAS.",
        },
        management: [
            {
                name: "Toto Wolff",
                role: "Team Principal & CEO (Co-Owner 33%)",
                nationality: "Austrian",
                bio: "Pemimpin dan salah satu pemilik tim yang memimpin era dominasi terpanjang dalam sejarah F1 dengan filosofi 'no-blame culture'.",
            },
            {
                name: "James Allison",
                role: "Technical Director",
                nationality: "British",
                bio: "Salah satu direktur teknik terhebat di F1 yang kembali memegang kendali langsung atas rancang bangun aerodinamika aktif dan sasis W17.",
            },
            {
                name: "Andrew Shovlin",
                role: "Trackside Engineering Director",
                nationality: "British",
                bio: "Insinyur senior yang telah mengawal balapan sejak era Brawn GP, memimpin strategi performa mobil di setiap sesi balapan.",
            },
            {
                name: "Hywel Thomas",
                role: "Managing Director (Mercedes AMG HPP)",
                nationality: "British",
                bio: "Kepala pengembangan mesin di Brixworth yang merancang unit daya hibrida 50/50 generasi regulasi 2026.",
            },
        ],
        carSpecs: {
            carModel: "W17",
            chassis:
                "Struktur monokok komposit karbon-epoksi FIA 2026 dengan pelindung kokpit Halo titanium",
            engine: "Mercedes-AMG F1 M17 E Performance 1.6L V6 Turbocharged (350 kW Electric MGU-K)",
            transmission:
                "Casing serat karbon dengan gigi transmisi 8-percepatan Mercedes",
            brakes: "Cakram karbon-karbon dengan sistem kontrol hidraulik brake-by-wire generasi 2026",
            weightKg: 768,
            aerodynamics:
                "FIA Active Aero (Z-Mode High Downforce & X-Mode Low Drag)",
            fuelSpec: "100% PETRONAS Primax Sustainable Drop-in E-Fuel",
        },
        celebrationHeadline:
            "Tradisi Silver Arrows: 8 Gelar Konstruktor Berturut-turut",
        celebrationDescription:
            "Kekompakan kru Brackley dan Brixworth telah melahirkan standar keunggulan mekanikal tertinggi di era turbo hybrid modern.",
        activeDrivers: [
            {
                driverId: "russell",
                permanentNumber: "63",
                code: "RUS",
                givenName: "George",
                familyName: "Russell",
                nationality: "British",
            },
            {
                driverId: "antonelli",
                permanentNumber: "12",
                code: "ANT",
                givenName: "Andrea Kimi",
                familyName: "Antonelli",
                nationality: "Italian",
            },
        ],
        reserveDrivers: [
            {
                driverId: "vesti",
                givenName: "Frederik",
                familyName: "Vesti",
                nationality: "Danish",
                role: "Pembalap Cadangan / Ketiga",
                permanentNumber: "42",
                constructorId: "mercedes",
                officialTeamName: "Mercedes AMG Petronas",
            },
        ],
    },

    ferrari: {
        constructorId: "ferrari",
        officialTeamName: "Scuderia Ferrari HP",
        carModel: "SF-26",
        headquarters: {
            facilityName: "Gestione Sportiva Maranello",
            location: "Maranello, Emilia-Romagna, Italia",
            country: "Italy",
            establishedYear: 1929,
            facilitySize: "24.000 m² (Pusat Balap Modern)",
            workforce: "~1.200 karyawan",
            powerUnitPartner: "Ferrari Works (Fasilitas Internal Maranello)",
            keyFacilities: [
                "Sirkuit Uji Privat Pista di Fiorano",
                "Terowongan Angin Dirancang Renzo Piano",
                "Pusat Pengembangan Mesin Pembakaran Internal (ICE) & ERS",
                "Static & Dynamic Driving Simulators Kelas Dunia",
            ],
            description:
                "Satu-satunya tim yang berkompetisi di setiap musim Formula 1 sejak 1950. Gestione Sportiva di Maranello memadukan tradisi legendaris Enzo Ferrari dengan laboratorium simulasi digital superkomputer tercanggih untuk melahirkan mobil regulasi 2026 SF-26.",
        },
        management: [
            {
                name: "Frédéric Vasseur",
                role: "Team Principal & General Manager",
                nationality: "French",
                bio: "Pemimpin motorsport berpengalaman dengan filosofi pembaruan kultur teknis yang agresif dan pendekatan pit-wall berbasis data modern.",
            },
            {
                name: "Loïc Serra",
                role: "Technical Director (Chassis)",
                nationality: "French",
                bio: "Mantan direktur kinerja Mercedes yang kini memimpin arah pengembangan suspensi, aerodinamika, dan arsitektur sasis Ferrari.",
            },
            {
                name: "Enrico Gualtieri",
                role: "Technical Director (Power Unit)",
                nationality: "Italian",
                bio: "Kepala perancangan mesin V6 Turbo Hybrid Ferrari yang memimpin efisiensi termal dan ketahanan sistem 350 kW MGU-K regulasi 2026.",
            },
            {
                name: "Diego Ioverno",
                role: "Sporting Director",
                nationality: "Italian",
                bio: "Veterans Maranello yang mengoordinasikan seluruh regulasi FIA, operasional garasi, dan logistik pit stop di sirkuit.",
            },
        ],
        carSpecs: {
            carModel: "SF-26",
            chassis:
                "Monokok komposit serat karbon ultra-ringan FIA 2026 Maranello",
            engine: "Ferrari 067/1 1.6L 90° V6 Turbo Hybrid (50% ICE / 50% MGU-K 350 kW)",
            transmission:
                "Transmisi 8-percepatan longitudinal serat karbon Ferrari",
            brakes: "Sistem rem Brembo ventilasi karbon dengan brake-by-wire regeneratif terpadu",
            weightKg: 768,
            aerodynamics:
                "FIA Active Aero (Z-Mode High Downforce & X-Mode Low Drag)",
            fuelSpec: "100% Shell Advanced Sustainable Drop-in E-Fuel",
        },
        celebrationHeadline:
            "Perayaan Kemenangan Monza di Hadapan Lautan Tifosi",
        celebrationDescription:
            "Podium Monza merupakan momen paling sakral dalam Formula 1 saat ribuan pendukung Tifosi membanjiri lintasan utama.",
        activeDrivers: [
            {
                driverId: "leclerc",
                permanentNumber: "16",
                code: "LEC",
                givenName: "Charles",
                familyName: "Leclerc",
                nationality: "Monegasque",
            },
            {
                driverId: "hamilton",
                permanentNumber: "44",
                code: "HAM",
                givenName: "Lewis",
                familyName: "Hamilton",
                nationality: "British",
            },
        ],
        reserveDrivers: [
            {
                driverId: "giovinazzi",
                givenName: "Antonio",
                familyName: "Giovinazzi",
                nationality: "Italian",
                role: "Pembalap Cadangan / Ketiga",
                permanentNumber: "99",
                constructorId: "ferrari",
                officialTeamName: "Scuderia Ferrari HP",
            },
        ],
    },

    mclaren: {
        constructorId: "mclaren",
        officialTeamName: "McLaren Mastercard",
        carModel: "MCL40",
        headquarters: {
            facilityName: "McLaren Technology Centre (MTC)",
            location: "Woking, Surrey, Inggris",
            country: "United Kingdom",
            establishedYear: 1963,
            facilitySize: "500.000 m² (Kampus Danau Norman Foster)",
            workforce: "~1.100 karyawan",
            powerUnitPartner:
                "Mercedes-AMG High Performance Powertrains (Regulasi 2026)",
            keyFacilities: [
                "Terowongan Angin Baru On-Site MTC (Resmi 2023)",
                "Pusat Pembuatan Komposit Canggih",
                "Simulasi Driver-in-Loop Generasi Terbaru",
                "Fasilitas Daur Ulang & Keberlanjutan Sirkular",
            ],
            description:
                "Dirancang oleh arsitek legendaris Sir Norman Foster, MTC di Woking adalah mahakarya arsitektur modern dengan danau pendingin ramah lingkungan, terowongan angin on-site baru, dan fasilitas rekayasa serat karbon presisi tinggi untuk meracik penantang gelar regulasi 2026 MCL40.",
        },
        management: [
            {
                name: "Zak Brown",
                role: "Chief Executive Officer (CEO)",
                nationality: "American",
                bio: "Pemimpin visioner bisnis dan motorsport komersial yang berhasil membangkitkan kembali kejayaan kompetitif dan finansial McLaren.",
            },
            {
                name: "Andrea Stella",
                role: "Team Principal",
                nationality: "Italian",
                bio: "Mantan insinyur balap Michael Schumacher dan Fernando Alonso; menerapkan kepemimpinan berbasis empati, analisis ilmiah, dan peningkatan teknis bertahap.",
            },
            {
                name: "Rob Marshall",
                role: "Chief Designer & Technical Director",
                nationality: "British",
                bio: "Arsitek rekayasa senior berpengalaman 17 tahun di Red Bull yang membawa pemahaman mendalam tentang efisiensi aliran lantai sasis dan regulasi 2026.",
            },
            {
                name: "Peter Prodromou",
                role: "Technical Director (Aerodynamics)",
                nationality: "British-Cypriot",
                bio: "Ahli aerodinamika terkemuka murid Adrian Newey yang mentransformasi paket downforce dan integrasi active aero regulasi 2026.",
            },
        ],
        carSpecs: {
            carModel: "MCL40",
            chassis:
                "Monokok serat karbon cetak MTC regulasi 2026 dengan struktur keselamatan terintegrasi",
            engine: "Mercedes-AMG F1 M17 E Performance 1.6L V6 Turbo Hybrid (350 kW MGU-K)",
            transmission:
                "McLaren 8-speed sequential, paddle-operated carbon case",
            brakes: "Akebono brake-by-wire system dengan cakram karbon ventilasi & regenerative braking",
            weightKg: 768,
            aerodynamics:
                "FIA Active Aero (Z-Mode High Downforce & X-Mode Low Drag)",
            fuelSpec: "100% Advanced Sustainable Drop-in E-Fuel",
        },
        celebrationHeadline:
            "Selebrasi Kemenangan Grand Prix & Kebangkitan Juara",
        celebrationDescription:
            "Kemenangan konsisten di berbagai sirkuit membuktikan efektivitas filosofi rekayasa McLaren di bawah komando Andrea Stella.",
        activeDrivers: [
            {
                driverId: "norris",
                permanentNumber: "4",
                code: "NOR",
                givenName: "Lando",
                familyName: "Norris",
                nationality: "British",
            },
            {
                driverId: "piastri",
                permanentNumber: "81",
                code: "PIA",
                givenName: "Oscar",
                familyName: "Piastri",
                nationality: "Australian",
            },
        ],
        reserveDrivers: [
            {
                driverId: "fornaroli",
                givenName: "Leonardo",
                familyName: "Fornaroli",
                nationality: "Italian",
                role: "Pembalap Cadangan / Ketiga",
                permanentNumber: "34",
                constructorId: "mclaren",
                officialTeamName: "McLaren Mastercard",
            },
            {
                driverId: "oward",
                givenName: "Pato",
                familyName: "O'Ward",
                nationality: "Mexican",
                role: "Pembalap Cadangan / Ketiga",
                permanentNumber: "29",
                constructorId: "mclaren",
                officialTeamName: "McLaren Mastercard",
            },
        ],
    },

    red_bull: {
        constructorId: "red_bull",
        officialTeamName: "Oracle Red Bull Racing",
        carModel: "RB22",
        headquarters: {
            facilityName: "Red Bull Technology Campus",
            location: "Milton Keynes, Buckinghamshire, Inggris",
            country: "United Kingdom",
            establishedYear: 2005,
            facilitySize: "290.000 sq ft (27.000 m²)",
            workforce: "~1.400 karyawan",
            powerUnitPartner:
                "Red Bull Ford Powertrains (Era Mesin Mandiri 2026)",
            keyFacilities: [
                "Terowongan Angin Skala 60% (Bedford)",
                "Driver-in-the-Loop Simulator Mutakhir",
                "Fasilitas Dyno Mandiri Red Bull Powertrains",
                "Pusat Manufaktur Komposit Karbon Cepat",
            ],
            description:
                "Kampus teknologi Red Bull di Milton Keynes merupakan salah satu fasilitas motorsport paling terintegrasi di dunia. Memasuki regulasi 2026, Red Bull merancang sasis RB22 dan memproduksi mesin balap sendiri bekerja sama dengan Ford melalui divisi Red Bull Ford Powertrains.",
        },
        management: [
            {
                name: "Christian Horner CBE",
                role: "Team Principal & CEO",
                nationality: "British",
                bio: "Memimpin Red Bull Racing sejak musim perdana 2005, mengantarkan tim meraih 6 gelar Konstruktor Dunia dan lebih dari 115 kemenangan Grand Prix.",
            },
            {
                name: "Pierre Waché",
                role: "Technical Director",
                nationality: "French",
                bio: "Insinyur jenius yang bertanggung jawab atas pengembangan dinamika sasis, ground effect, dan integrasi aerodinamika aktif mobil penakluk gelar juara.",
            },
            {
                name: "Paul Monaghan",
                role: "Chief Engineer (Car Engineering)",
                nationality: "British",
                bio: "Memimpin keandalan operasional mekanikal mobil di lintasan dan manajemen setup balap lap-by-lap.",
            },
            {
                name: "Gianpiero Lambiase",
                role: "Head of Race Engineering",
                nationality: "Italian-British",
                bio: "Kepala teknik balap sirkuit dan race engineer utama Max Verstappen yang terkenal dengan ketenangan strategi pit wall-nya.",
            },
        ],
        carSpecs: {
            carModel: "RB22",
            chassis:
                "Monokok komposit serat karbon FIA 2026 (lebar 1900 mm, wheelbase 3400 mm)",
            engine: "Red Bull Ford Powertrains DM01 1.6L V6 Turbo Hybrid (350 kW MGU-K)",
            transmission:
                "Transmisi 8-kecepatan longitudinal sekuensial Red Bull Technology",
            brakes: "Cakram karbon-karbon dengan kaliper Brembo monobloc & 8.5 MJ regenerative recovery",
            weightKg: 768,
            aerodynamics:
                "FIA Active Aero (Z-Mode High Downforce & X-Mode Low Drag)",
            fuelSpec: "100% ExxonMobil Advanced Sustainable Drop-in E-Fuel",
        },
        celebrationHeadline: "Dominasi Juara Dunia & Rekor Pit Stop Tercepat",
        celebrationDescription:
            "Kru pit stop Red Bull Racing terkenal memegang rekor pit stop sub-2 detik terbanyak dalam sejarah modern Formula 1.",
        activeDrivers: [
            {
                driverId: "max_verstappen",
                permanentNumber: "1",
                code: "VER",
                givenName: "Max",
                familyName: "Verstappen",
                nationality: "Dutch",
            },
            {
                driverId: "hadjar",
                permanentNumber: "6",
                code: "HAD",
                givenName: "Isack",
                familyName: "Hadjar",
                nationality: "French",
            },
        ],
        reserveDrivers: [
            {
                driverId: "tsunoda_res_rb",
                givenName: "Yuki",
                familyName: "Tsunoda",
                nationality: "Japanese",
                role: "Pembalap Cadangan / Ketiga",
                permanentNumber: "22",
                constructorId: "red_bull",
                officialTeamName: "Oracle Red Bull Racing",
            },
        ],
    },

    aston_martin: {
        constructorId: "aston_martin",
        officialTeamName: "Aston Martin Aramco",
        carModel: "AMR26",
        headquarters: {
            facilityName: "AMR Technology Campus",
            location: "Silverstone, Northamptonshire, Inggris",
            country: "United Kingdom",
            establishedYear: 2023,
            facilitySize: "400.000 sq ft (Kampus F1 Paling Modern)",
            workforce: "~900 karyawan",
            powerUnitPartner: "Honda Works Factory Partner (Regulasi 2026)",
            keyFacilities: [
                "Terowongan Angin Mandiri Generasi Baru 2024",
                "Lantai Manufaktur Smart Factory Terkoneksi 5G",
                "Fasilitas R&D Bahan Bakar Berkelanjutan Aramco",
                "Simulasi Balap Driver-in-Motion Multi-Axis",
            ],
            description:
                "Dibangun dengan investasi lebih dari £200 juta oleh Lawrence Stroll tepat di seberang sirkuit Silverstone. Dilengkapi terowongan angin mandiri terbaru dan resmi menjadi tim pabrikan penuh Honda pada regulasi 2026 dengan mobil AMR26 yang dirancang di bawah supervisi legenda Adrian Newey.",
        },
        management: [
            {
                name: "Lawrence Stroll",
                role: "Executive Chairman",
                nationality: "Canadian",
                bio: "Investor visioner yang mengubah tim Silverstone menjadi kekuatan pabrikan modern dengan fasilitas termegah di Formula 1.",
            },
            {
                name: "Mike Krack",
                role: "Team Principal",
                nationality: "Luxembourgish",
                bio: "Mantan pimpinan motorsport Porsche dan BMW dengan pendekatan manajemen teknik yang tenang dan efisien.",
            },
            {
                name: "Adrian Newey OBE",
                role: "Managing Technical Partner",
                nationality: "British",
                bio: "Legenda perancang F1 pemenang 25 gelar dunia yang memimpin langsung arah konsep aerodinamika aktif dan arsitektur sasis mobil regulasi 2026 AMR26.",
            },
            {
                name: "Dan Fallows",
                role: "Technical Director",
                nationality: "British",
                bio: "Mantan kepala aerodinamika Red Bull yang mengoordinasikan implementasi paket bodi dan pendinginan mesin Honda regulasi 2026.",
            },
        ],
        carSpecs: {
            carModel: "AMR26",
            chassis:
                "Monokok serat karbon komposit regulasi FIA 2026 rancangan tim teknik Adrian Newey",
            engine: "Honda Works RA626H 1.6L V6 Turbo Hybrid (350 kW Electric MGU-K)",
            transmission:
                "Transmisi 8-percepatan karya internal Aston Martin dengan casing komposit",
            brakes: "Cakram rem karbon ventilasi dengan kaliper monobloc & regenerative recovery",
            weightKg: 768,
            aerodynamics:
                "FIA Active Aero (Z-Mode High Downforce & X-Mode Low Drag)",
            fuelSpec: "100% Aramco Advanced Sustainable Drop-in E-Fuel",
        },
        activeDrivers: [
            {
                driverId: "alonso",
                permanentNumber: "14",
                code: "ALO",
                givenName: "Fernando",
                familyName: "Alonso",
                nationality: "Spanish",
            },
            {
                driverId: "stroll",
                permanentNumber: "18",
                code: "STR",
                givenName: "Lance",
                familyName: "Stroll",
                nationality: "Canadian",
            },
        ],
        reserveDrivers: [
            {
                driverId: "crawford",
                givenName: "Jak",
                familyName: "Crawford",
                nationality: "American",
                role: "Pembalap Cadangan / Ketiga",
                permanentNumber: "35",
                constructorId: "aston_martin",
                officialTeamName: "Aston Martin Aramco",
            },
            {
                driverId: "vandoorne",
                givenName: "Stoffel",
                familyName: "Vandoorne",
                nationality: "Belgian",
                role: "Pembalap Cadangan / Ketiga",
                permanentNumber: "2",
                constructorId: "aston_martin",
                officialTeamName: "Aston Martin Aramco",
            },
        ],
    },

    alpine: {
        constructorId: "alpine",
        officialTeamName: "BWT Alpine",
        carModel: "A526",
        headquarters: {
            facilityName: "Enstone Technical Centre",
            location: "Enstone, Oxfordshire, Inggris & Viry-Châtillon, Prancis",
            country: "France / United Kingdom",
            establishedYear: 1992,
            facilitySize: "18.000 m² (Pusat Rekayasa Bersejarah)",
            workforce: "~850 karyawan",
            powerUnitPartner:
                "Mercedes-AMG High Performance Powertrains (Era Mesin Pelanggan 2026)",
            keyFacilities: [
                "Terowongan Angin Skala 60% Enstone",
                "Pusat Fabrikasi Otomatisasi Komposit",
                "Superkomputer CFD High Performance Computing",
                "Divisi Uji Ketahanan Dinamis Sasis",
            ],
            description:
                "Pabrik Enstone memiliki sejarah juara dunia bersama Benetton dan Renault. Memasuki regulasi 2026, Alpine bertransformasi dengan mengadopsi unit daya Mercedes-AMG pada sasis A526 untuk memaksimalkan fokus keunggulan aerodinamika sasis.",
        },
        management: [
            {
                name: "Oliver Oakes",
                role: "Team Principal",
                nationality: "British",
                bio: "Pemimpin muda berbakat pendiri tim Hitech GP yang membawa energi segar dan disiplin operasional di paddock Enstone.",
            },
            {
                name: "Flavio Briatore",
                role: "Executive Advisor to Renault Group",
                nationality: "Italian",
                bio: "Tokoh legendaris penemu bakat Michael Schumacher dan Fernando Alonso yang ditunjuk memimpin restrukturisasi strategis tim.",
            },
            {
                name: "David Sanchez",
                role: "Executive Technical Director",
                nationality: "French",
                bio: "Mantan kepala konsep aero Ferrari yang mengawasi integrasi sasis, suspensi, dan aliran aerodinamika aktif mobil regulasi 2026 A526.",
            },
        ],
        carSpecs: {
            carModel: "A526",
            chassis:
                "Monokok komposit serat karbon cetakan autoclave Enstone regulasi 2026",
            engine: "Mercedes-AMG F1 M17 1.6L 90° V6 Turbo Hybrid (350 kW MGU-K)",
            transmission:
                "Transmisi 8-percepatan Mercedes-AMG terintegrasi sasis Enstone",
            brakes: "Cakram dan bantalan karbon buatan Brembo/AP Racing dengan brake-by-wire",
            weightKg: 768,
            aerodynamics:
                "FIA Active Aero (Z-Mode High Downforce & X-Mode Low Drag)",
            fuelSpec: "100% Advanced Sustainable Drop-in E-Fuel",
        },
        activeDrivers: [
            {
                driverId: "gasly",
                permanentNumber: "10",
                code: "GAS",
                givenName: "Pierre",
                familyName: "Gasly",
                nationality: "French",
            },
            {
                driverId: "colapinto",
                permanentNumber: "43",
                code: "COL",
                givenName: "Franco",
                familyName: "Colapinto",
                nationality: "Argentine",
            },
        ],
        reserveDrivers: [
            {
                driverId: "paul_aron",
                givenName: "Paul",
                familyName: "Aron",
                nationality: "Estonian",
                role: "Pembalap Cadangan / Ketiga",
                permanentNumber: "25",
                constructorId: "alpine",
                officialTeamName: "BWT Alpine",
            },
            {
                driverId: "maini",
                givenName: "Kush",
                familyName: "Maini",
                nationality: "Indian",
                role: "Pembalap Cadangan / Ketiga",
                permanentNumber: "37",
                constructorId: "alpine",
                officialTeamName: "BWT Alpine",
            },
        ],
    },

    haas: {
        constructorId: "haas",
        officialTeamName: "MoneyGram Haas",
        carModel: "VF-26",
        headquarters: {
            facilityName: "Kannapolis HQ, Banbury Base & Maranello Hub",
            location: "Kannapolis (USA), Banbury (UK), & Maranello (Italia)",
            country: "United States",
            establishedYear: 2016,
            facilitySize: "Fasilitas Multi-Hub Terdistribusi Global",
            workforce: "~350 karyawan (Model Outsourcing Efisien)",
            powerUnitPartner:
                "Ferrari Works (Unit Daya 2026) & Toyota Gazoo Racing (Kemitraan Teknis)",
            keyFacilities: [
                "Hub Desain & R&D Khusus di Dalam Kompleks Ferrari Maranello",
                "Pusat Desain & Manufaktur Komponen Toyota Gazoo Racing",
                "Markas Operasional & Logistik Balap Banbury (UK)",
                "Kantor Pusat Komersial Kannapolis (North Carolina)",
            ],
            description:
                "Tim Formula 1 asal Amerika Serikat yang dipimpin Ayao Komatsu. Memasuki regulasi 2026, Haas memperkuat kolaborasi bersama Scuderia Ferrari untuk unit daya hibrida terbaru dan Toyota Gazoo Racing untuk desain, manufaktur, dan aerodinamika mobil VF-26.",
        },
        management: [
            {
                name: "Ayao Komatsu",
                role: "Team Principal",
                nationality: "Japanese",
                bio: "Insinyur lulusan Loughborough dengan pengalaman di BAR dan Lotus; membawa pendekatan engineering murni dan komunikasi langsung tanpa birokrasi.",
            },
            {
                name: "Gene Haas",
                role: "Founder & Team Owner",
                nationality: "American",
                bio: "Pengusaha industri alat berat Haas Automation dan pemilik tim NASCAR yang membawa bendera Amerika ke F1.",
            },
            {
                name: "Andrea De Zordo",
                role: "Technical Director",
                nationality: "Italian",
                bio: "Insinyur aerodinamika berpengalaman yang memimpin kantor desain Haas di Maranello, mengoptimalkan arsitektur active aero pada VF-26.",
            },
        ],
        carSpecs: {
            carModel: "VF-26",
            chassis:
                "Monokok komposit serat karbon dirancang bersama Dallara & Toyota Gazoo Racing regulasi 2026",
            engine: "Ferrari 067/1 1.6L 90° V6 Turbo Hybrid (50% ICE / 50% MGU-K 350 kW)",
            transmission:
                "Transmisi 8-percepatan longitudinal buatan Ferrari generasi 2026",
            brakes: "Cakram dan bantalan serat karbon dengan kaliper hidraulik Brembo regeneratif",
            weightKg: 768,
            aerodynamics:
                "FIA Active Aero (Z-Mode High Downforce & X-Mode Low Drag)",
            fuelSpec: "100% Shell Advanced Sustainable Drop-in E-Fuel",
        },
        activeDrivers: [
            {
                driverId: "ocon",
                permanentNumber: "31",
                code: "OCO",
                givenName: "Esteban",
                familyName: "Ocon",
                nationality: "French",
            },
            {
                driverId: "bearman",
                permanentNumber: "87",
                code: "BEA",
                givenName: "Oliver",
                familyName: "Bearman",
                nationality: "British",
            },
        ],
        reserveDrivers: [
            {
                driverId: "doohan",
                givenName: "Jack",
                familyName: "Doohan",
                nationality: "Australian",
                role: "Pembalap Cadangan / Ketiga",
                permanentNumber: "7",
                constructorId: "haas",
                officialTeamName: "MoneyGram Haas",
            },
            {
                driverId: "hirakawa",
                givenName: "Ryo",
                familyName: "Hirakawa",
                nationality: "Japanese",
                role: "Pembalap Cadangan / Ketiga",
                permanentNumber: "38",
                constructorId: "haas",
                officialTeamName: "MoneyGram Haas",
            },
        ],
    },

    rb: {
        constructorId: "rb",
        officialTeamName: "Visa Cash App Racing Bulls",
        carModel: "VCARB 03",
        headquarters: {
            facilityName: "Faenza Racing Factory & Milton Keynes Aero Base",
            location: "Faenza, Ravenna, Italia & Milton Keynes, Inggris",
            country: "Italy",
            establishedYear: 1985,
            facilitySize: "15.000 m² (Faenza) + Fasilitas Aero Baru UK",
            workforce: "~650 karyawan",
            powerUnitPartner: "Red Bull Ford Powertrains (Regulasi 2026)",
            keyFacilities: [
                "Pusat Produksi Presisi Tinggi Faenza (Bekas Pabrik Minardi)",
                "Fasilitas Terowongan Angin & Desain Aerodinamika UK",
                "Simulator Balap Driver-in-Loop Terkoneksi Red Bull Technology",
                "Pusat Pelatihan Fisik dan Kebugaran Pembalap",
            ],
            description:
                "Berbasis di Faenza (Italia) dengan fasilitas aerodinamika di Milton Keynes (UK). Mengadopsi unit daya baru Red Bull Ford Powertrains untuk meluncurkan penantang regulasi 2026 VCARB 03 dengan sinergi teknis tingkat tinggi.",
        },
        management: [
            {
                name: "Laurent Mekies",
                role: "Team Principal",
                nationality: "French",
                bio: "Mantan direktur balap Ferrari dan wakil direktur balap FIA yang kini memimpin operasional dan strategi kompetisi Visa Cash App RB.",
            },
            {
                name: "Peter Bayer",
                role: "Chief Executive Officer (CEO)",
                nationality: "Austrian",
                bio: "Mantan sekretaris jenderal F1 di FIA yang mengarahkan visi bisnis komersial dan kemitraan strategis global tim.",
            },
            {
                name: "Jody Egginton",
                role: "Technical Director",
                nationality: "British",
                bio: "Insinyur berpengalaman yang mengarahkan paket aero aktif dan integrasi suspensi depan-belakang pada VCARB 03.",
            },
        ],
        carSpecs: {
            carModel: "VCARB 03",
            chassis:
                "Monokok komposit serat karbon Faenza dengan sinergi suspensi Red Bull Technology 2026",
            engine: "Red Bull Ford Powertrains DM01 1.6L V6 Turbo Hybrid (350 kW MGU-K)",
            transmission:
                "Red Bull Technology 8-speed longitudinal gearbox regulasi 2026",
            brakes: "Cakram karbon hidraulik dengan kaliper Brembo & brake-by-wire regeneratif",
            weightKg: 768,
            aerodynamics:
                "FIA Active Aero (Z-Mode High Downforce & X-Mode Low Drag)",
            fuelSpec: "100% ExxonMobil Advanced Sustainable Drop-in E-Fuel",
        },
        activeDrivers: [
            {
                driverId: "lawson",
                permanentNumber: "30",
                code: "LAW",
                givenName: "Liam",
                familyName: "Lawson",
                nationality: "New Zealander",
            },
            {
                driverId: "lindblad",
                permanentNumber: "40",
                code: "LIN",
                givenName: "Arvid",
                familyName: "Lindblad",
                nationality: "British",
            },
        ],
        reserveDrivers: [
            {
                driverId: "tsunoda",
                givenName: "Yuki",
                familyName: "Tsunoda",
                nationality: "Japanese",
                role: "Pembalap Cadangan / Ketiga",
                permanentNumber: "22",
                constructorId: "rb",
                officialTeamName: "Visa Cash App Racing Bulls",
            },
            {
                driverId: "iwasa",
                givenName: "Ayumu",
                familyName: "Iwasa",
                nationality: "Japanese",
                role: "Pembalap Cadangan / Ketiga",
                permanentNumber: "36",
                constructorId: "rb",
                officialTeamName: "Visa Cash App Racing Bulls",
            },
        ],
    },

    williams: {
        constructorId: "williams",
        officialTeamName: "Atlassian Williams Racing",
        carModel: "FW48",
        headquarters: {
            facilityName: "Grove Operations Base",
            location: "Grove, Wantage, Oxfordshire, Inggris",
            country: "United Kingdom",
            establishedYear: 1977,
            facilitySize: "33.000 m² (Fasilitas Kampus Komprehensif)",
            workforce: "~800 karyawan",
            powerUnitPartner:
                "Mercedes-AMG High Performance Powertrains (Regulasi 2026)",
            keyFacilities: [
                "Dua Terowongan Angin Mandiri",
                "Museum Sejarah Warisan F1 Terbesar di Dunia",
                "Pusat Rekayasa Komposit & Fabrikasi Rapid Prototyping",
                "Sistem Perencanaan Sumber Daya Terpadu (Modern ERP 2024)",
            ],
            description:
                "Didirikan oleh Sir Frank Williams dan Sir Patrick Head, Williams telah mengoleksi 9 gelar Konstruktor. Di era regulasi baru 2026 bersama Carlos Sainz dan Alex Albon, fasilitas Grove merilis mobil FW48 bertenaga mesin Mercedes-AMG.",
        },
        management: [
            {
                name: "James Vowles",
                role: "Team Principal",
                nationality: "British",
                bio: "Mantan kepala strategi motorsport Mercedes yang membawa metodologi modern, transparansi, dan rencana pembangunan jangka panjang di Grove.",
            },
            {
                name: "Pat Fry",
                role: "Chief Technical Officer",
                nationality: "British",
                bio: "Insinyur veteran lebih dari 35 tahun di McLaren, Ferrari, dan Alpine yang memimpin perombakan struktur rancang bangun FW48 regulasi 2026.",
            },
            {
                name: "Sven Smeets",
                role: "Sporting Director",
                nationality: "Belgian",
                bio: "Mantan direktur motorsport Volkswagen yang mengelola operasional tim sirkuit, pit stop crew, dan akademi pembalap muda Williams.",
            },
        ],
        carSpecs: {
            carModel: "FW48",
            chassis:
                "Struktur monokok karbon-epoksi Grove berstandar regulasi FIA 2026",
            engine: "Mercedes-AMG F1 M17 E Performance 1.6L V6 Turbo (350 kW MGU-K)",
            transmission: "Transmisi 8-percepatan Mercedes-AMG generasi 2026",
            brakes: "Kaliper AP Racing dengan cakram dan bantalan karbon Carbone Industrie & regenerative recovery",
            weightKg: 768,
            aerodynamics:
                "FIA Active Aero (Z-Mode High Downforce & X-Mode Low Drag)",
            fuelSpec: "100% Advanced Sustainable Drop-in E-Fuel",
        },
        activeDrivers: [
            {
                driverId: "albon",
                permanentNumber: "23",
                code: "ALB",
                givenName: "Alexander",
                familyName: "Albon",
                nationality: "Thai",
            },
            {
                driverId: "sainz",
                permanentNumber: "55",
                code: "SAI",
                givenName: "Carlos",
                familyName: "Sainz",
                nationality: "Spanish",
            },
        ],
        reserveDrivers: [
            {
                driverId: "browning",
                givenName: "Luke",
                familyName: "Browning",
                nationality: "British",
                role: "Pembalap Cadangan / Ketiga",
                permanentNumber: "45",
                constructorId: "williams",
                officialTeamName: "Atlassian Williams Racing",
            },
        ],
    },

    kick_sauber: {
        constructorId: "kick_sauber",
        officialTeamName: "Audi F1 Team",
        carModel: "Audi R26 / C46",
        headquarters: {
            facilityName: "Hinwil Technology Campus & Neuburg Engine Centre",
            location: "Hinwil, Kanton Zürich, Swiss & Neuburg, Jerman",
            country: "Switzerland / Germany",
            establishedYear: 1993,
            facilitySize: "28.000 m² (Fasilitas Rekayasa Presisi Pabrikan)",
            workforce: "~850 karyawan (Ekspansi Penuh Pabrikan Audi AG)",
            powerUnitPartner:
                "Audi Formula Racing Factory Works PU (Neuburg an der Donau, Jerman)",
            keyFacilities: [
                "Terowongan Angin Komersial Paling Akurat di Eropa (Hinwil)",
                "Pusat R&D dan Dyno Sel Uji Mesin Hibrida Audi Sport (Neuburg)",
                "Pusat Manufaktur Aditif (3D Printing) Logam Industri Terbesar",
                "Simulasi Dinamika Kendaraan Superkomputer Generasi Terbaru",
            ],
            description:
                "Transformasi penuh Sauber Motorsport menjadi tim pabrikan resmi Audi pada regulasi 2026. Mengintegrasikan sasis presisi tinggi dari terowongan angin Hinwil Swiss dengan mesin pabrikan buatan Audi di Neuburg an der Donau Jerman di bawah komando Mattia Binotto dan Jonathan Wheatley.",
        },
        management: [
            {
                name: "Mattia Binotto",
                role: "Chief Operating Officer & Chief Technical Officer",
                nationality: "Italian-Swiss",
                bio: "Mantan Team Principal Scuderia Ferrari yang ditunjuk langsung oleh Audi AG untuk memimpin seluruh operasional pabrik dan integrasi teknis Hinwil-Neuburg untuk mobil pabrikan Audi 2026.",
            },
            {
                name: "Jonathan Wheatley",
                role: "Team Principal",
                nationality: "British",
                bio: "Mantan manajer tim legendaris Red Bull Racing yang dipercaya memimpin pit wall dan budaya pemenang tim pabrikan Audi.",
            },
            {
                name: "Beat Zehnder",
                role: "Director of Signature Logistics",
                nationality: "Swiss",
                bio: "Sosok legendaris yang telah mengabdi di Sauber sejak balapan pertama di Kyalami 1993 tanpa melewatkan satu seri pun.",
            },
        ],
        carSpecs: {
            carModel: "Audi R26 / C46",
            chassis:
                "Monokok serat karbon Hinwil dengan arsitektur sasis pabrikan Audi AG regulasi 2026",
            engine: "Audi AFR 26 1.6L V6 Turbo Hybrid (350 kW MGU-K, 100% E-Fuel)",
            transmission:
                "Transmisi 8-percepatan karya teknis pabrikan Audi Sport",
            brakes: "Brembo carbon-carbon brake discs & pads dengan kontrol regenerasi energi tinggi",
            weightKg: 768,
            aerodynamics:
                "FIA Active Aero (Z-Mode High Downforce & X-Mode Low Drag)",
            fuelSpec: "100% BP/Castrol Advanced Sustainable Drop-in E-Fuel",
        },
        activeDrivers: [
            {
                driverId: "hulkenberg",
                permanentNumber: "27",
                code: "HUL",
                givenName: "Nico",
                familyName: "Hülkenberg",
                nationality: "German",
            },
            {
                driverId: "bortoleto",
                permanentNumber: "5",
                code: "BOR",
                givenName: "Gabriel",
                familyName: "Bortoleto",
                nationality: "Brazilian",
            },
        ],
        reserveDrivers: [
            {
                driverId: "slater",
                givenName: "Freddie",
                familyName: "Slater",
                nationality: "British",
                role: "Pembalap Cadangan / Ketiga",
                permanentNumber: "46",
                constructorId: "kick_sauber",
                officialTeamName: "Audi F1 Team",
            },
        ],
    },

    cadillac: {
        constructorId: "cadillac",
        officialTeamName: "Cadillac F1 Team",
        carModel: "MAC-26",
        headquarters: {
            facilityName:
                "Cadillac Racing Global Motorsport HQ & Silverstone Base",
            location:
                "Fishers, Indiana (USA) & Silverstone, Northamptonshire, Inggris",
            country: "United States",
            establishedYear: 2026,
            facilitySize: "260.000 sq ft (24.000 m²)",
            workforce: "~600 karyawan",
            powerUnitPartner:
                "Ferrari Works Customer (Era Transisi 2026-2027) menuju GM Works PU",
            keyFacilities: [
                "Pusat Desain Indianapolis Racing Campus",
                "Fasilitas Operasional Trackside Silverstone",
                "Simulator Driver-in-Loop Generasi Baru",
                "Laboratorium Dinamika Powertrain General Motors",
            ],
            description:
                "Tim pabrikan General Motors yang resmi bergabung sebagai tim ke-11 Formula 1 pada regulasi 2026. Menghadirkan duet pembalap bintang berpengalaman Sergio Pérez dan Valtteri Bottas, dengan dukungan fasilitas kelas dunia di Fishers, Indiana dan Silverstone.",
        },
        management: [
            {
                name: "Dan Towriss",
                role: "CEO & Co-Owner",
                nationality: "American",
                bio: "Pemimpin bisnis motorsport dan teknologi Group 1001 yang memimpin langkah ekspansi Cadillac ke grid Formula 1.",
            },
            {
                name: "Michael Andretti",
                role: "Advisor & Founding Partner",
                nationality: "American",
                bio: "Tokoh legendaris motorsport Amerika Serikat dan juara CART IndyCar yang memperjuangkan masuknya tim ke grid F1.",
            },
            {
                name: "Nick Chester",
                role: "Technical Director",
                nationality: "British",
                bio: "Mantan direktur teknik Lotus dan Renault yang memimpin pengembangan konsep sasis regulasi 2026 Cadillac F1.",
            },
        ],
        carSpecs: {
            carModel: "MAC-26",
            chassis:
                "Monokok komposit serat karbon FIA 2026 rancangan tim teknik Cadillac F1 Silverstone",
            engine: "General Motors / Ferrari 1.6L V6 Turbo Hybrid (350 kW MGU-K)",
            transmission:
                "Transmisi 8-percepatan longitudinal serat karbon 2026",
            brakes: "Cakram karbon-karbon hidraulik dengan regenerative energy recovery",
            weightKg: 768,
            aerodynamics:
                "FIA Active Aero (Z-Mode High Downforce & X-Mode Low Drag)",
            fuelSpec: "100% Advanced Sustainable Drop-in E-Fuel",
        },
        celebrationHeadline:
            "Debut Bersejarah Tim ke-11 Pabrikan General Motors",
        celebrationDescription:
            "Kehadiran Cadillac F1 Team menandai era baru Formula 1 dengan 11 tim dan 22 mobil di grid World Championship regulasi 2026.",
        activeDrivers: [
            {
                driverId: "perez",
                permanentNumber: "11",
                code: "PER",
                givenName: "Sergio",
                familyName: "Pérez",
                nationality: "Mexican",
            },
            {
                driverId: "bottas",
                permanentNumber: "77",
                code: "BOT",
                givenName: "Valtteri",
                familyName: "Bottas",
                nationality: "Finnish",
            },
        ],
        reserveDrivers: [
            {
                driverId: "zhou",
                givenName: "Guanyu",
                familyName: "Zhou",
                nationality: "Chinese",
                role: "Pembalap Cadangan / Ketiga",
                permanentNumber: "24",
                constructorId: "cadillac",
                officialTeamName: "Cadillac F1 Team",
            },
            {
                driverId: "herta",
                givenName: "Colton",
                familyName: "Herta",
                nationality: "American",
                role: "Pembalap Cadangan / Ketiga",
                permanentNumber: "26",
                constructorId: "cadillac",
                officialTeamName: "Cadillac F1 Team",
            },
        ],
    },
};

/**
 * Helper to fetch detailed technical profile for a constructor
 */
export function getTeamTechnicalProfile(
    constructorId: string,
): TeamTechnicalProfile | null {
    // Map alternative IDs (e.g. racing_bulls -> rb, sauber / audi -> kick_sauber)
    const normalizedId =
        constructorId === "racing_bulls"
            ? "rb"
            : constructorId === "sauber" || constructorId === "audi"
              ? "kick_sauber"
              : constructorId;

    return TEAMS_DATABASE[normalizedId] || null;
}

/**
 * Returns the official full team name for a given constructor ID.
 * Falls back to provided fallback name or capitalized ID.
 */
export function getOfficialTeamName(
    constructorId: string,
    fallbackName?: string,
): string {
    const profile = getTeamTechnicalProfile(constructorId);
    if (profile?.officialTeamName) {
        return profile.officialTeamName;
    }
    return fallbackName || constructorId.replace(/_/g, " ").toUpperCase();
}

/**
 * Aggregates all official reserve and test drivers across all F1 teams.
 */
export function getAllReserveDrivers(): TeamReserveDriver[] {
    const reserves: TeamReserveDriver[] = [];
    for (const key of Object.keys(TEAMS_DATABASE)) {
        const team = TEAMS_DATABASE[key];
        if (team.reserveDrivers && Array.isArray(team.reserveDrivers)) {
            reserves.push(...team.reserveDrivers);
        }
    }
    return reserves;
}
