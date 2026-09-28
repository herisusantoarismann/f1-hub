/**
 * Formula 1 Driver Career & Junior Ladder Database
 * Details driver journey from Karting, F4, F3, F2 to F1,
 * including F1 team tenures and championship winning years.
 */

export interface JuniorCareerStep {
    years: string;
    category: string;
    team?: string;
    result: string;
    isChampion?: boolean;
}

export interface F1TeamStint {
    years: string;
    teamName: string;
    constructorId: string;
    role: string;
    championships?: number[];
    wins?: number;
    podiums?: number;
    highlights?: string;
    isCurrent?: boolean;
}

export interface DriverWorldChampionship {
    total: number;
    years: number[];
}

export interface DriverCareerProfile {
    driverId: string;
    fullName: string;
    worldChampionships?: DriverWorldChampionship;
    juniorTitles: { year: number | string; title: string; category: string }[];
    f1Career: F1TeamStint[];
    juniorCareer: JuniorCareerStep[];
    careerSummary: string;
}

export const DRIVERS_CAREER_DATABASE: Record<string, DriverCareerProfile> = {
    hamilton: {
        driverId: "hamilton",
        fullName: "Lewis Hamilton",
        worldChampionships: {
            total: 7,
            years: [2008, 2014, 2015, 2017, 2018, 2019, 2020],
        },
        juniorTitles: [
            {
                year: 2003,
                title: "Formula Renault 2.0 UK Champion",
                category: "Formula Renault",
            },
            {
                year: 2005,
                title: "Formula 3 Euro Series Champion",
                category: "Formula 3",
            },
            { year: 2006, title: "GP2 Series Champion", category: "GP2 / F2" },
        ],
        f1Career: [
            {
                years: "2007–2012",
                teamName: "Vodafone McLaren Mercedes",
                constructorId: "mclaren",
                role: "Race Driver",
                championships: [2008],
                wins: 21,
                podiums: 49,
                highlights:
                    "First World Championship in 2008; historic rookie title battle in 2007.",
            },
            {
                years: "2013–2024",
                teamName: "Mercedes-AMG Petronas F1 Team",
                constructorId: "mercedes",
                role: "Race Driver",
                championships: [2014, 2015, 2017, 2018, 2019, 2020],
                wins: 84,
                podiums: 152,
                highlights:
                    "6 World Drivers' Championships and 8 consecutive Constructors' titles.",
            },
            {
                years: "2025–Present",
                teamName: "Scuderia Ferrari HP",
                constructorId: "ferrari",
                role: "Race Driver",
                highlights:
                    "Blockbuster transfer to Maranello chasing a record-breaking 8th World Title.",
                isCurrent: true,
            },
        ],
        juniorCareer: [
            {
                years: "1993–2001",
                category: "Karting",
                result: "Multiple British & European Karting Champion",
                isChampion: true,
            },
            {
                years: "2001–2003",
                category: "Formula Renault 2.0 UK",
                team: "Manor Motorsport",
                result: "Champion (2003 with 10 wins)",
                isChampion: true,
            },
            {
                years: "2004–2005",
                category: "Formula 3 Euro Series",
                team: "ASM Formule 3",
                result: "Champion (2005 with 15 wins)",
                isChampion: true,
            },
            {
                years: "2006",
                category: "GP2 Series (now F2)",
                team: "ART Grand Prix",
                result: "Champion (Rookie Season)",
                isChampion: true,
            },
        ],
        careerSummary:
            "One of the most decorated drivers in motorsport history with a joint-record 7 World Championships, over 100 Grand Prix wins, and pole positions.",
    },

    max_verstappen: {
        driverId: "max_verstappen",
        fullName: "Max Verstappen",
        worldChampionships: {
            total: 3,
            years: [2021, 2022, 2023],
        },
        juniorTitles: [
            {
                year: 2013,
                title: "CIK-FIA World KZ Karting Champion",
                category: "Karting",
            },
            {
                year: 2014,
                title: "Masters of Formula 3 Winner",
                category: "Formula 3",
            },
        ],
        f1Career: [
            {
                years: "2015–2016",
                teamName: "Scuderia Toro Rosso",
                constructorId: "rb",
                role: "Race Driver",
                highlights:
                    "Youngest ever F1 driver to start a Grand Prix at 17 years and 166 days.",
            },
            {
                years: "2016–Present",
                teamName: "Oracle Red Bull Racing",
                constructorId: "red_bull",
                role: "Race Driver",
                championships: [2021, 2022, 2023],
                wins: 60,
                podiums: 110,
                highlights:
                    "Youngest race winner in F1 history (Spain 2016) and 3 consecutive World Championships.",
                isCurrent: true,
            },
        ],
        juniorCareer: [
            {
                years: "2005–2013",
                category: "Karting",
                result: "World KZ Championship Winner & WSK Euro Series Champion",
                isChampion: true,
            },
            {
                years: "2014",
                category: "Florida Winter Series",
                team: "Ferrari Driver Academy support",
                result: "2 race wins",
                isChampion: false,
            },
            {
                years: "2014",
                category: "FIA European Formula 3",
                team: "Van Amersfoort Racing",
                result: "3rd overall (10 race wins, 6 consecutive wins)",
                isChampion: false,
            },
            {
                years: "2014",
                category: "Masters of Formula 3",
                team: "Motopark",
                result: "Winner",
                isChampion: true,
            },
        ],
        careerSummary:
            "Meteoric rise through karting and F3 directly into Formula 1 at age 17, redefining domination with Red Bull Racing and capturing 3 World Titles.",
    },

    alonso: {
        driverId: "alonso",
        fullName: "Fernando Alonso",
        worldChampionships: {
            total: 2,
            years: [2005, 2006],
        },
        juniorTitles: [
            {
                year: 1999,
                title: "Euro Open by Nissan Champion",
                category: "Formula Nissan",
            },
        ],
        f1Career: [
            {
                years: "2001",
                teamName: "European Minardi F1 Team",
                constructorId: "williams",
                role: "Race Driver",
                highlights:
                    "F1 debut displaying exceptional pace in underpowered machinery.",
            },
            {
                years: "2003–2006",
                teamName: "Mild Seven Renault F1 Team",
                constructorId: "alpine",
                role: "Race Driver",
                championships: [2005, 2006],
                wins: 15,
                podiums: 37,
                highlights:
                    "Ended Schumacher's reign with back-to-back World Championships.",
            },
            {
                years: "2007",
                teamName: "Vodafone McLaren Mercedes",
                constructorId: "mclaren",
                role: "Race Driver",
                wins: 4,
                podiums: 12,
                highlights:
                    "Fierce 4-way championship fight finishing equal points with Hamilton.",
            },
            {
                years: "2008–2009",
                teamName: "ING Renault F1 Team",
                constructorId: "alpine",
                role: "Race Driver",
                wins: 2,
                podiums: 4,
                highlights: "Sensational victory in Fuji 2008.",
            },
            {
                years: "2010–2014",
                teamName: "Scuderia Ferrari",
                constructorId: "ferrari",
                role: "Race Driver",
                wins: 11,
                podiums: 44,
                highlights:
                    "Three-time World Championship runner-up (2010, 2012, 2013).",
            },
            {
                years: "2015–2018",
                teamName: "McLaren Honda / Renault",
                constructorId: "mclaren",
                role: "Race Driver",
                highlights:
                    "Lead driver during the McLaren revival era before two-year F1 sabbatical.",
            },
            {
                years: "2021–2022",
                teamName: "Alpine F1 Team",
                constructorId: "alpine",
                role: "Race Driver",
                podiums: 1,
                highlights:
                    "Returned to the podium in Qatar 2021 after 7-year absence.",
            },
            {
                years: "2023–Present",
                teamName: "Aston Martin Aramco F1 Team",
                constructorId: "aston_martin",
                role: "Race Driver",
                podiums: 8,
                highlights:
                    "Record-extending longevity with 400+ Grand Prix entries and masterclass podiums.",
                isCurrent: true,
            },
        ],
        juniorCareer: [
            {
                years: "1988–1998",
                category: "Karting",
                result: "World Junior Karting Cup Champion (1996) & Spanish Champion",
                isChampion: true,
            },
            {
                years: "1999",
                category: "Euro Open by Nissan",
                team: "Campos Motorsport",
                result: "Champion (6 wins, 9 pole positions)",
                isChampion: true,
            },
            {
                years: "2000",
                category: "International Formula 3000 (now F2)",
                team: "Team Astromega",
                result: "4th overall (Winner at Spa-Francorchamps)",
                isChampion: false,
            },
        ],
        careerSummary:
            "Double World Champion and master of racecraft, holding the all-time record for most race starts across four different decades of Formula 1 racing.",
    },

    norris: {
        driverId: "norris",
        fullName: "Lando Norris",
        juniorTitles: [
            {
                year: 2015,
                title: "MSA Formula Championship (F4)",
                category: "Formula 4",
            },
            {
                year: 2016,
                title: "Toyota Racing Series Champion",
                category: "Formula Regional",
            },
            {
                year: 2016,
                title: "Formula Renault 2.0 Eurocup Champion",
                category: "Formula Renault",
            },
            {
                year: 2017,
                title: "FIA Formula 3 European Champion",
                category: "Formula 3",
            },
        ],
        f1Career: [
            {
                years: "2019–Present",
                teamName: "McLaren Formula 1 Team",
                constructorId: "mclaren",
                role: "Race Driver",
                wins: 3,
                podiums: 26,
                highlights:
                    "Breakthrough Miami GP winner, lead McLaren title protagonist in 2024–2026.",
                isCurrent: true,
            },
        ],
        juniorCareer: [
            {
                years: "2008–2014",
                category: "Karting",
                result: "World CIK-FIA KF World Champion (youngest in history)",
                isChampion: true,
            },
            {
                years: "2015",
                category: "MSA Formula Championship (UK F4)",
                team: "Carlin",
                result: "Champion (8 wins, 10 poles)",
                isChampion: true,
            },
            {
                years: "2016",
                category: "Toyota Racing Series NZ",
                team: "M2 Competition",
                result: "Champion (6 wins)",
                isChampion: true,
            },
            {
                years: "2016",
                category: "Eurocup Formula Renault 2.0",
                team: "Josef Kaufmann Racing",
                result: "Champion (5 wins)",
                isChampion: true,
            },
            {
                years: "2017",
                category: "FIA Formula 3 European Championship",
                team: "Carlin",
                result: "Champion (9 wins, 20 podiums)",
                isChampion: true,
            },
            {
                years: "2018",
                category: "FIA Formula 2 Championship",
                team: "Carlin",
                result: "Vice-Champion (Runner-up to George Russell)",
                isChampion: false,
            },
        ],
        careerSummary:
            "One of the most prolific junior CVs in modern motorsport, winning titles across F4, Eurocup, and F3 before spearheading McLaren's resurgence.",
    },

    leclerc: {
        driverId: "leclerc",
        fullName: "Charles Leclerc",
        juniorTitles: [
            { year: 2016, title: "GP3 Series Champion", category: "GP3 / F3" },
            {
                year: 2017,
                title: "FIA Formula 2 Champion",
                category: "Formula 2",
            },
        ],
        f1Career: [
            {
                years: "2018",
                teamName: "Alfa Romeo Sauber F1 Team",
                constructorId: "sauber",
                role: "Race Driver",
                highlights:
                    "Sensational rookie season scoring points regularly in a lower-midfield car.",
            },
            {
                years: "2019–Present",
                teamName: "Scuderia Ferrari HP",
                constructorId: "ferrari",
                role: "Race Driver",
                wins: 8,
                podiums: 42,
                highlights:
                    "Pole position master, Monaco GP winner 2024, and Ferrari team focal point.",
                isCurrent: true,
            },
        ],
        juniorCareer: [
            {
                years: "2005–2013",
                category: "Karting",
                result: "CIK-FIA KF2 Cup Winner & WSK Euro Series Champion",
                isChampion: true,
            },
            {
                years: "2014",
                category: "Formula Renault 2.0 Alps",
                team: "Fortec Motorsports",
                result: "Vice-Champion (2 wins, 7 podiums)",
                isChampion: false,
            },
            {
                years: "2015",
                category: "FIA Formula 3 European Championship",
                team: "Van Amersfoort Racing",
                result: "4th overall (Best rookie, 4 wins)",
                isChampion: false,
            },
            {
                years: "2016",
                category: "GP3 Series",
                team: "ART Grand Prix",
                result: "Champion (Rookie Title)",
                isChampion: true,
            },
            {
                years: "2017",
                category: "FIA Formula 2 Championship",
                team: "Prema Racing",
                result: "Dominant Champion (7 wins, 8 pole positions)",
                isChampion: true,
            },
        ],
        careerSummary:
            "Ferrari's beloved prodigy who won back-to-back GP3 and Formula 2 championships as a rookie before claiming iconic wins at Monza, Spa, and Monaco.",
    },

    piastri: {
        driverId: "piastri",
        fullName: "Oscar Piastri",
        juniorTitles: [
            {
                year: 2019,
                title: "Formula Renault Eurocup Champion",
                category: "Formula Renault",
            },
            {
                year: 2020,
                title: "FIA Formula 3 Champion",
                category: "Formula 3",
            },
            {
                year: 2021,
                title: "FIA Formula 2 Champion",
                category: "Formula 2",
            },
        ],
        f1Career: [
            {
                years: "2023–Present",
                teamName: "McLaren Formula 1 Team",
                constructorId: "mclaren",
                role: "Race Driver",
                wins: 2,
                podiums: 10,
                highlights:
                    "Sprint race winner in rookie year (Qatar 2023) and Grand Prix victor in Hungary & Azerbaijan 2024.",
                isCurrent: true,
            },
        ],
        juniorCareer: [
            {
                years: "2011–2016",
                category: "Karting",
                result: "Australian & European Championship podiums",
                isChampion: false,
            },
            {
                years: "2017",
                category: "F4 British Championship",
                team: "TRS Arden Junior Team",
                result: "Vice-Champion (6 wins, 15 podiums)",
                isChampion: false,
            },
            {
                years: "2018–2019",
                category: "Formula Renault Eurocup",
                team: "R-ace GP",
                result: "Champion (2019 with 7 wins)",
                isChampion: true,
            },
            {
                years: "2020",
                category: "FIA Formula 3 Championship",
                team: "Prema Racing",
                result: "Champion in Rookie Season",
                isChampion: true,
            },
            {
                years: "2021",
                category: "FIA Formula 2 Championship",
                team: "Prema Racing",
                result: "Champion in Rookie Season (6 wins, 5 consecutive poles)",
                isChampion: true,
            },
        ],
        careerSummary:
            "Achieved the historic 'Triple Crown' of junior single-seaters by winning Formula Renault, F3, and F2 in consecutive rookie seasons.",
    },

    russell: {
        driverId: "russell",
        fullName: "George Russell",
        juniorTitles: [
            {
                year: 2014,
                title: "BRDC Formula 4 Champion",
                category: "Formula 4",
            },
            { year: 2017, title: "GP3 Series Champion", category: "GP3 / F3" },
            {
                year: 2018,
                title: "FIA Formula 2 Champion",
                category: "Formula 2",
            },
        ],
        f1Career: [
            {
                years: "2019–2021",
                teamName: "Williams Racing",
                constructorId: "williams",
                role: "Race Driver",
                podiums: 1,
                highlights:
                    "Earned the nickname 'Mr. Saturday' with sensational qualifying heroics and a podium in Spa 2021.",
            },
            {
                years: "2022–Present",
                teamName: "Mercedes-AMG Petronas F1 Team",
                constructorId: "mercedes",
                role: "Race Driver",
                wins: 2,
                podiums: 15,
                highlights:
                    "First F1 victory at São Paulo 2022 and team leader spearheading Mercedes' new era.",
                isCurrent: true,
            },
        ],
        juniorCareer: [
            {
                years: "2006–2013",
                category: "Karting",
                result: "Two-time CIK-FIA European Karting Champion",
                isChampion: true,
            },
            {
                years: "2014",
                category: "BRDC Formula 4 Championship",
                team: "Lanan Racing",
                result: "Champion (McLaren Autosport BRDC Award winner)",
                isChampion: true,
            },
            {
                years: "2015–2016",
                category: "FIA Formula 3 European Championship",
                team: "Carlin / HitechGP",
                result: "3rd overall (3 wins)",
                isChampion: false,
            },
            {
                years: "2017",
                category: "GP3 Series",
                team: "ART Grand Prix",
                result: "Champion in Rookie Season (4 wins)",
                isChampion: true,
            },
            {
                years: "2018",
                category: "FIA Formula 2 Championship",
                team: "ART Grand Prix",
                result: "Champion in Rookie Season (7 wins against Norris and Albon)",
                isChampion: true,
            },
        ],
        careerSummary:
            "Mercedes Academy graduate who claimed back-to-back GP3 and F2 titles before establishing himself as a Grand Prix winner at Mercedes.",
    },

    sainz: {
        driverId: "sainz",
        fullName: "Carlos Sainz Jr.",
        juniorTitles: [
            {
                year: 2011,
                title: "Formula Renault 2.0 NEC Champion",
                category: "Formula Renault",
            },
            {
                year: 2014,
                title: "Formula Renault 3.5 Series Champion",
                category: "Formula Renault 3.5",
            },
        ],
        f1Career: [
            {
                years: "2015–2017",
                teamName: "Scuderia Toro Rosso",
                constructorId: "rb",
                role: "Race Driver",
                highlights:
                    "Impressive debut alongside Verstappen showcasing racecraft and consistency.",
            },
            {
                years: "2017–2018",
                teamName: "Renault Sport F1 Team",
                constructorId: "alpine",
                role: "Race Driver",
                highlights:
                    "Midfield general scoring consistent points for Enstone.",
            },
            {
                years: "2019–2020",
                teamName: "McLaren F1 Team",
                constructorId: "mclaren",
                role: "Race Driver",
                podiums: 2,
                highlights:
                    "Crucial catalyst in McLaren's rise to P3 in the Constructors' championship.",
            },
            {
                years: "2021–2024",
                teamName: "Scuderia Ferrari",
                constructorId: "ferrari",
                role: "Race Driver",
                wins: 4,
                podiums: 25,
                highlights:
                    "Silverstone 2022, Singapore 2023 (sole non-Red Bull win), Australia 2024, and Mexico 2024 victor.",
            },
            {
                years: "2025–Present",
                teamName: "Williams Racing",
                constructorId: "williams",
                role: "Race Driver",
                highlights:
                    "High-profile signing leading Williams' ambitious multi-year rebuilding project.",
                isCurrent: true,
            },
        ],
        juniorCareer: [
            {
                years: "2006–2009",
                category: "Karting",
                result: "CIK-FIA Western European KF3 Champion",
                isChampion: true,
            },
            {
                years: "2010",
                category: "Formula BMW Europe",
                team: "EuroInternational",
                result: "4th overall (Best rookie)",
                isChampion: false,
            },
            {
                years: "2011",
                category: "Formula Renault 2.0 NEC",
                team: "Koiranen Motorsport",
                result: "Champion (10 race wins)",
                isChampion: true,
            },
            {
                years: "2012–2013",
                category: "British F3 / GP3 Series",
                team: "Carlin / MW Arden",
                result: "Multiple race winner",
                isChampion: false,
            },
            {
                years: "2014",
                category: "Formula Renault 3.5 Series",
                team: "DAMS",
                result: "Champion with 7 wins (promoted to F1)",
                isChampion: true,
            },
        ],
        careerSummary:
            "The strategic master known as the 'Smooth Operator', with Grand Prix wins for Ferrari and career stints across Toro Rosso, Renault, McLaren, and Williams.",
    },

    antonelli: {
        driverId: "antonelli",
        fullName: "Andrea Kimi Antonelli",
        juniorTitles: [
            { year: 2022, title: "Italian F4 Champion", category: "Formula 4" },
            {
                year: 2022,
                title: "ADAC Formula 4 Champion",
                category: "Formula 4",
            },
            {
                year: 2023,
                title: "Formula Regional Middle East Champion",
                category: "Formula Regional",
            },
            {
                year: 2023,
                title: "Formula Regional European (FRECA) Champion",
                category: "Formula Regional",
            },
        ],
        f1Career: [
            {
                years: "2025–Present",
                teamName: "Mercedes-AMG Petronas F1 Team",
                constructorId: "mercedes",
                role: "Race Driver",
                highlights:
                    "Hand-picked by Toto Wolff as the successor to Lewis Hamilton at Mercedes.",
                isCurrent: true,
            },
        ],
        juniorCareer: [
            {
                years: "2014–2021",
                category: "Karting",
                result: "Back-to-back CIK-FIA European Karting Champion (2020, 2021)",
                isChampion: true,
            },
            {
                years: "2022",
                category: "Italian F4 Championship",
                team: "Prema Racing",
                result: "Champion (13 wins, 14 poles)",
                isChampion: true,
            },
            {
                years: "2022",
                category: "ADAC Formula 4 Championship",
                team: "Prema Racing",
                result: "Champion (9 wins in 15 races)",
                isChampion: true,
            },
            {
                years: "2023",
                category: "Formula Regional European (FRECA)",
                team: "Prema Racing",
                result: "Champion (5 wins, 11 podiums)",
                isChampion: true,
            },
            {
                years: "2024",
                category: "FIA Formula 2 Championship",
                team: "Prema Racing",
                result: "Skipped F3 directly into F2, winning Sprint & Feature races",
                isChampion: false,
            },
        ],
        careerSummary:
            "Mercedes' Italian sensation who dominated international karting, F4, and Formula Regional before being drafted directly into the Silver Arrows F1 seat at age 18.",
    },

    bearman: {
        driverId: "bearman",
        fullName: "Oliver Bearman",
        juniorTitles: [
            { year: 2021, title: "Italian F4 Champion", category: "Formula 4" },
            {
                year: 2021,
                title: "ADAC Formula 4 Champion",
                category: "Formula 4",
            },
        ],
        f1Career: [
            {
                years: "2024",
                teamName: "Scuderia Ferrari / Haas F1 Team",
                constructorId: "ferrari",
                role: "Stand-in Reserve Driver",
                highlights:
                    "Sensational P7 finish on F1 debut in Saudi Arabia substituting for Sainz, scored points for Haas in Baku.",
            },
            {
                years: "2025–Present",
                teamName: "MoneyGram Haas F1 Team",
                constructorId: "haas",
                role: "Race Driver",
                highlights:
                    "Full-time Formula 1 race seat backed by the Ferrari Driver Academy.",
                isCurrent: true,
            },
        ],
        juniorCareer: [
            {
                years: "2013–2019",
                category: "Karting",
                result: "IAME Euro Series & Winter Cup Champion",
                isChampion: true,
            },
            {
                years: "2020",
                category: "ADAC Formula 4",
                team: "US Racing",
                result: "Rookie race winner",
                isChampion: false,
            },
            {
                years: "2021",
                category: "Italian F4 & ADAC F4",
                team: "Van Amersfoort Racing",
                result: "Historic double champion winning both series in the same season",
                isChampion: true,
            },
            {
                years: "2022",
                category: "FIA Formula 3 Championship",
                team: "Prema Racing",
                result: "3rd overall (1 win, 8 podiums)",
                isChampion: false,
            },
            {
                years: "2023–2024",
                category: "FIA Formula 2 Championship",
                team: "Prema Racing",
                result: "Baku clean sweep (P1 in Sprint & Feature) and multiple feature race wins",
                isChampion: false,
            },
        ],
        careerSummary:
            "Ferrari Driver Academy standout who famously scored points on his unexpected F1 debut in Jeddah at just 18 years old.",
    },

    bortoleto: {
        driverId: "bortoleto",
        fullName: "Gabriel Bortoleto",
        juniorTitles: [
            {
                year: 2023,
                title: "FIA Formula 3 Champion",
                category: "Formula 3",
            },
            {
                year: 2024,
                title: "FIA Formula 2 Champion",
                category: "Formula 2",
            },
        ],
        f1Career: [
            {
                years: "2025–Present",
                teamName: "Stake F1 Team Kick Sauber / Audi",
                constructorId: "sauber",
                role: "Race Driver",
                highlights:
                    "Spearheading Audi's historic factory entrance into Formula 1.",
                isCurrent: true,
            },
        ],
        juniorCareer: [
            {
                years: "2012–2019",
                category: "Karting",
                result: "Brazilian Karting Champion & 3rd in CIK-FIA World Championship",
                isChampion: true,
            },
            {
                years: "2020",
                category: "Italian F4 Championship",
                team: "Prema Powerteam",
                result: "5th overall (1 win, 5 podiums)",
                isChampion: false,
            },
            {
                years: "2021–2022",
                category: "Formula Regional European (FRECA)",
                team: "FA Racing / R-ace GP",
                result: "Multiple race winner and polesitter",
                isChampion: false,
            },
            {
                years: "2023",
                category: "FIA Formula 3 Championship",
                team: "Trident",
                result: "Champion in Rookie Season",
                isChampion: true,
            },
            {
                years: "2024",
                category: "FIA Formula 2 Championship",
                team: "Invicta Racing",
                result: "Champion in Rookie Season (Historic Monza last-to-first win)",
                isChampion: true,
            },
        ],
        careerSummary:
            "Brazilian prodigy managed by Fernando Alonso who achieved back-to-back rookie championship titles in FIA F3 and FIA F2.",
    },

    albon: {
        driverId: "albon",
        fullName: "Alexander Albon",
        juniorTitles: [
            {
                year: 2010,
                title: "CIK-FIA World Cup KF3 Champion",
                category: "Karting",
            },
        ],
        f1Career: [
            {
                years: "2019",
                teamName: "Scuderia Toro Rosso",
                constructorId: "rb",
                role: "Race Driver",
                highlights:
                    "Midfield stand-out promoted to Red Bull mid-season.",
            },
            {
                years: "2019–2020",
                teamName: "Red Bull Racing",
                constructorId: "red_bull",
                role: "Race Driver",
                podiums: 2,
                highlights: "Maiden podiums at Mugello and Bahrain 2020.",
            },
            {
                years: "2022–Present",
                teamName: "Williams Racing",
                constructorId: "williams",
                role: "Race Driver",
                highlights:
                    "Team leader who rebuilt Williams into regular points contention.",
                isCurrent: true,
            },
        ],
        juniorCareer: [
            {
                years: "2006–2011",
                category: "Karting",
                result: "CIK-FIA World Cup & European Champion",
                isChampion: true,
            },
            {
                years: "2012–2014",
                category: "Eurocup Formula Renault 2.0",
                team: "EPIC Racing / KTR",
                result: "3rd overall in 2014",
                isChampion: false,
            },
            {
                years: "2015",
                category: "FIA Formula 3 European Championship",
                team: "Signature",
                result: "7th overall (2 poles, 5 podiums)",
                isChampion: false,
            },
            {
                years: "2016",
                category: "GP3 Series",
                team: "ART Grand Prix",
                result: "Vice-Champion (4 wins, battle with Leclerc)",
                isChampion: false,
            },
            {
                years: "2017–2018",
                category: "FIA Formula 2 Championship",
                team: "ART / DAMS",
                result: "3rd overall in 2018 (4 wins, 3 poles)",
                isChampion: false,
            },
        ],
        careerSummary:
            "Resilient Thai-British driver who fought back to Formula 1 through determination, establishing himself as team leader at Williams Racing.",
    },

    gasly: {
        driverId: "gasly",
        fullName: "Pierre Gasly",
        juniorTitles: [
            {
                year: 2013,
                title: "Eurocup Formula Renault 2.0 Champion",
                category: "Formula Renault",
            },
            { year: 2016, title: "GP2 Series Champion", category: "GP2 / F2" },
        ],
        f1Career: [
            {
                years: "2017–2018",
                teamName: "Scuderia Toro Rosso",
                constructorId: "rb",
                role: "Race Driver",
                highlights: "Superb P4 in Bahrain 2018 under Honda power.",
            },
            {
                years: "2019",
                teamName: "Red Bull Racing",
                constructorId: "red_bull",
                role: "Race Driver",
                highlights:
                    "First half of the 2019 campaign before returning to Toro Rosso.",
            },
            {
                years: "2019–2022",
                teamName: "Scuderia AlphaTauri",
                constructorId: "rb",
                role: "Race Driver",
                wins: 1,
                podiums: 3,
                highlights:
                    "Miracle Grand Prix victory at Monza 2020 and podium in Brazil 2019.",
            },
            {
                years: "2023–Present",
                teamName: "BWT Alpine F1 Team",
                constructorId: "alpine",
                role: "Race Driver",
                podiums: 2,
                highlights: "Podiums at Zandvoort 2023 and São Paulo 2024.",
                isCurrent: true,
            },
        ],
        juniorCareer: [
            {
                years: "2006–2010",
                category: "Karting",
                result: "French Vice-Champion & CIK-FIA European Championship 2nd",
                isChampion: false,
            },
            {
                years: "2011",
                category: "French F4 Championship",
                team: "Auto Sport Academy",
                result: "3rd overall in single-seater debut",
                isChampion: false,
            },
            {
                years: "2012–2013",
                category: "Eurocup Formula Renault 2.0",
                team: "Tech 1 Racing",
                result: "Champion in 2013 (3 wins)",
                isChampion: true,
            },
            {
                years: "2014",
                category: "Formula Renault 3.5 Series",
                team: "Arden Motorsport",
                result: "Vice-Champion (Rookie of the Year)",
                isChampion: false,
            },
            {
                years: "2015–2016",
                category: "GP2 Series (now F2)",
                team: "DAMS / Prema Racing",
                result: "Champion in 2016 (4 wins, 5 poles)",
                isChampion: true,
            },
            {
                years: "2017",
                category: "Super Formula Championship",
                team: "Team Mugen",
                result: "Vice-Champion (Missing title by 0.5 pts due to typhoon cancellation)",
                isChampion: false,
            },
        ],
        careerSummary:
            "French Grand Prix winner with an emotional comeback story, securing victory at Monza 2020 and leading Alpine's modern charge.",
    },

    ocon: {
        driverId: "ocon",
        fullName: "Esteban Ocon",
        juniorTitles: [
            {
                year: 2014,
                title: "FIA Formula 3 European Champion",
                category: "Formula 3",
            },
            { year: 2015, title: "GP3 Series Champion", category: "GP3 / F3" },
        ],
        f1Career: [
            {
                years: "2016",
                teamName: "Manor Racing MRT",
                constructorId: "williams",
                role: "Race Driver",
                highlights: "Mid-season F1 debut at the Belgian Grand Prix.",
            },
            {
                years: "2017–2018",
                teamName: "Sahara Force India / Racing Point",
                constructorId: "aston_martin",
                role: "Race Driver",
                highlights:
                    "Super-consistent points scorer with a record run of consecutive finishes.",
            },
            {
                years: "2020–2024",
                teamName: "Renault DP World / Alpine F1 Team",
                constructorId: "alpine",
                role: "Race Driver",
                wins: 1,
                podiums: 3,
                highlights:
                    "Sensational victory at the Hungarian Grand Prix 2021 and podium at Monaco 2023.",
            },
            {
                years: "2025–Present",
                teamName: "MoneyGram Haas F1 Team",
                constructorId: "haas",
                role: "Race Driver",
                highlights:
                    "Spearheading Haas's ambitious leadership lineup alongside Oliver Bearman.",
                isCurrent: true,
            },
        ],
        juniorCareer: [
            {
                years: "2006–2011",
                category: "Karting",
                result: "French Minime & Cadet Champion, WSK Euro Series top 3",
                isChampion: true,
            },
            {
                years: "2012–2013",
                category: "Eurocup Formula Renault 2.0",
                team: "Koiranen / ART Junior",
                result: "3rd overall (2 wins)",
                isChampion: false,
            },
            {
                years: "2014",
                category: "FIA Formula 3 European Championship",
                team: "Prema Powerteam",
                result: "Champion (Beat rookie Max Verstappen with 9 wins)",
                isChampion: true,
            },
            {
                years: "2015",
                category: "GP3 Series",
                team: "ART Grand Prix",
                result: "Champion (14 consecutive podium finishes)",
                isChampion: true,
            },
            {
                years: "2016",
                category: "DTM (German Touring Cars)",
                team: "Mercedes-Benz",
                result: "Raced 10 rounds before mid-season F1 call-up",
                isChampion: false,
            },
        ],
        careerSummary:
            "Gritty French Grand Prix winner who beat Verstappen to the 2014 European F3 title and clinched an unforgettable victory in Hungary 2021.",
    },

    tsunoda: {
        driverId: "tsunoda",
        fullName: "Yuki Tsunoda",
        juniorTitles: [
            {
                year: 2018,
                title: "F4 Japanese Championship Champion",
                category: "Formula 4",
            },
        ],
        f1Career: [
            {
                years: "2021–2023",
                teamName: "Scuderia AlphaTauri",
                constructorId: "rb",
                role: "Race Driver",
                highlights:
                    "Scored points on F1 debut in Bahrain and a career-best P4 in Abu Dhabi 2021.",
            },
            {
                years: "2024–Present",
                teamName: "Visa Cash App RB F1 Team",
                constructorId: "rb",
                role: "Race Driver",
                highlights:
                    "Established as the undisputed team leader with regular Q3 appearances and points.",
                isCurrent: true,
            },
        ],
        juniorCareer: [
            {
                years: "2010–2016",
                category: "Karting",
                result: "All-Japan Kart Championship regional & national titles",
                isChampion: true,
            },
            {
                years: "2017–2018",
                category: "F4 Japanese Championship",
                team: "Honda Formula Dream Project",
                result: "Champion in 2018 (7 wins, 8 poles)",
                isChampion: true,
            },
            {
                years: "2019",
                category: "FIA Formula 3 Championship",
                team: "Jenzer Motorsport",
                result: "9th overall (Winner at Monza in underdog car)",
                isChampion: false,
            },
            {
                years: "2020",
                category: "FIA Formula 2 Championship",
                team: "Carlin",
                result: "3rd overall (3 wins, 4 poles, Anthoine Hubert Rookie of the Year)",
                isChampion: false,
            },
        ],
        careerSummary:
            "Honda and Red Bull backed Japanese star who rapidly ascended from Japanese F4 to Formula 1 in just three seasons.",
    },

    hulkenberg: {
        driverId: "hulkenberg",
        fullName: "Nico Hülkenberg",
        juniorTitles: [
            {
                year: 2005,
                title: "Formula BMW ADAC Champion",
                category: "Formula BMW",
            },
            {
                year: 2007,
                title: "A1 Grand Prix World Champion (for Team Germany)",
                category: "A1GP",
            },
            {
                year: 2008,
                title: "Formula 3 Euro Series Champion",
                category: "Formula 3",
            },
            { year: 2009, title: "GP2 Series Champion", category: "GP2 / F2" },
            {
                year: 2015,
                title: "24 Hours of Le Mans Overall Winner",
                category: "Endurance",
            },
        ],
        f1Career: [
            {
                years: "2010",
                teamName: "AT&T Williams",
                constructorId: "williams",
                role: "Race Driver",
                highlights:
                    "Shock maiden pole position in tricky conditions at Interlagos (Brazil 2010).",
            },
            {
                years: "2012, 2014–2016",
                teamName: "Sahara Force India F1 Team",
                constructorId: "aston_martin",
                role: "Race Driver",
                highlights:
                    "Midfield masterclass, led laps at Interlagos and finished top 10 consistently.",
            },
            {
                years: "2013",
                teamName: "Sauber F1 Team",
                constructorId: "sauber",
                role: "Race Driver",
                highlights:
                    "Sensational P3 in Italian GP qualifying, defending masterfully against Hamilton in Korea.",
            },
            {
                years: "2017–2019",
                teamName: "Renault F1 Team",
                constructorId: "alpine",
                role: "Race Driver",
                highlights:
                    "P7 in Drivers' Championship (best of the rest) in 2018 leading Renault's resurgence.",
            },
            {
                years: "2020, 2022",
                teamName: "Racing Point / Aston Martin",
                constructorId: "aston_martin",
                role: "Super-sub Reserve Driver",
                highlights:
                    "Legendary last-minute call-ups scoring points at Silverstone, Nürburgring, and Bahrain.",
            },
            {
                years: "2023–2024",
                teamName: "MoneyGram Haas F1 Team",
                constructorId: "haas",
                role: "Race Driver",
                highlights: "Qualifying heroics regularly placing Haas in Q3.",
            },
            {
                years: "2025–Present",
                teamName: "Stake F1 Team Kick Sauber / Audi",
                constructorId: "sauber",
                role: "Race Driver",
                highlights:
                    "Anchor driver chosen to develop and lead Audi's factory Formula 1 project.",
                isCurrent: true,
            },
        ],
        juniorCareer: [
            {
                years: "1997–2004",
                category: "Karting",
                result: "German Junior & Senior Kart Champion",
                isChampion: true,
            },
            {
                years: "2005",
                category: "Formula BMW ADAC",
                team: "Josef Kaufmann Racing",
                result: "Champion (8 wins in rookie year)",
                isChampion: true,
            },
            {
                years: "2006–2007",
                category: "A1 Grand Prix",
                team: "A1 Team Germany",
                result: "World Champion (Won 9 of 20 races)",
                isChampion: true,
            },
            {
                years: "2007–2008",
                category: "Formula 3 Euro Series",
                team: "ASM Formule 3",
                result: "Champion in 2008 (7 wins, Masters of F3 winner)",
                isChampion: true,
            },
            {
                years: "2009",
                category: "GP2 Series (now F2)",
                team: "ART Grand Prix",
                result: "Champion in Rookie Season (5 wins)",
                isChampion: true,
            },
        ],
        careerSummary:
            "Legendary competitor who won virtually every single junior feeder championship in existence as a rookie, alongside an overall 24 Hours of Le Mans victory.",
    },

    lawson: {
        driverId: "lawson",
        fullName: "Liam Lawson",
        juniorTitles: [
            {
                year: 2017,
                title: "NZ F1600 Championship Champion",
                category: "Formula Ford",
            },
            {
                year: 2019,
                title: "Toyota Racing Series Champion",
                category: "Formula Regional",
            },
        ],
        f1Career: [
            {
                years: "2023",
                teamName: "Scuderia AlphaTauri",
                constructorId: "rb",
                role: "Substitute Race Driver",
                highlights:
                    "Scored points in Singapore (P9) in only his third Grand Prix appearance.",
            },
            {
                years: "2024–Present",
                teamName: "Visa Cash App RB / Red Bull Racing",
                constructorId: "red_bull",
                role: "Race Driver",
                highlights:
                    "Promoted to full-time seat showcasing sharp wheel-to-wheel racecraft.",
                isCurrent: true,
            },
        ],
        juniorCareer: [
            {
                years: "2008–2015",
                category: "Karting",
                result: "Two-time New Zealand Kart Champion",
                isChampion: true,
            },
            {
                years: "2016–2017",
                category: "NZ F1600 & Australian F4",
                team: "Liam Lawson Motorsport",
                result: "Champion in NZ F1600 (Won 14 of 15 races)",
                isChampion: true,
            },
            {
                years: "2018",
                category: "ADAC Formula 4",
                team: "Van Amersfoort Racing",
                result: "Vice-Champion (3 wins, 11 podiums)",
                isChampion: false,
            },
            {
                years: "2019",
                category: "Toyota Racing Series",
                team: "M2 Competition",
                result: "Champion (Beat Marcus Armstrong & Lucas Auer)",
                isChampion: true,
            },
            {
                years: "2021–2022",
                category: "FIA Formula 2 Championship",
                team: "Hitech / Carlin",
                result: "3rd overall in 2022 (4 wins, 10 podiums)",
                isChampion: false,
            },
            {
                years: "2023",
                category: "Super Formula Japan",
                team: "Team Mugen",
                result: "Vice-Champion (First driver in 45 years to win on debut)",
                isChampion: false,
            },
        ],
        careerSummary:
            "New Zealand racer who demonstrated exceptional adaptability by winning on his debut in F2, DTM, and Super Formula before scoring points as an F1 super-sub.",
    },

    bottas: {
        driverId: "bottas",
        fullName: "Valtteri Bottas",
        juniorTitles: [
            {
                year: 2008,
                title: "Formula Renault 2.0 Eurocup Champion",
                category: "Formula Renault",
            },
            {
                year: 2008,
                title: "Formula Renault 2.0 NEC Champion",
                category: "Formula Renault",
            },
            { year: 2011, title: "GP3 Series Champion", category: "GP3 / F3" },
        ],
        f1Career: [
            {
                years: "2013–2016",
                teamName: "Williams Martini Racing",
                constructorId: "williams",
                role: "Race Driver",
                podiums: 9,
                highlights:
                    "Finished P4 in 2014 World Championship scoring multiple podiums.",
            },
            {
                years: "2017–2021",
                teamName: "Mercedes-AMG Petronas F1 Team",
                constructorId: "mercedes",
                role: "Race Driver",
                wins: 10,
                podiums: 58,
                highlights:
                    "5-time Constructors' Champion, two-time World Drivers' Championship runner-up (2019, 2020).",
            },
            {
                years: "2022–2024",
                teamName: "Alfa Romeo F1 Team / Kick Sauber",
                constructorId: "sauber",
                role: "Race Driver",
                highlights:
                    "Senior team leader who guided Alfa Romeo to P6 in the 2022 Constructors' standings.",
            },
        ],
        juniorCareer: [
            {
                years: "2001–2006",
                category: "Karting",
                result: "Multiple Finnish & Nordic Kart Champion",
                isChampion: true,
            },
            {
                years: "2007–2008",
                category: "Formula Renault 2.0 NEC & Eurocup",
                team: "Motopark Academy",
                result: "Double Champion in 2008 winning both European and North European crowns",
                isChampion: true,
            },
            {
                years: "2009–2010",
                category: "Formula 3 Euro Series",
                team: "ART Grand Prix",
                result: "3rd overall, historic back-to-back Masters of F3 winner",
                isChampion: true,
            },
            {
                years: "2011",
                category: "GP3 Series",
                team: "Lotus ART",
                result: "Champion in dramatic final weekend comeback",
                isChampion: true,
            },
        ],
        careerSummary:
            "10-time Grand Prix winner and 5-time Constructors' champion with Mercedes, known for scorching qualifying speed and immaculate teamwork.",
    },

    perez: {
        driverId: "perez",
        fullName: "Sergio Pérez",
        juniorTitles: [
            {
                year: 2007,
                title: "British Formula 3 Championship (National Class)",
                category: "Formula 3",
            },
        ],
        f1Career: [
            {
                years: "2011–2012",
                teamName: "Sauber F1 Team",
                constructorId: "sauber",
                role: "Race Driver",
                podiums: 3,
                highlights:
                    "Stunning podiums in Malaysia, Canada, and Monza 2012.",
            },
            {
                years: "2013",
                teamName: "Vodafone McLaren Mercedes",
                constructorId: "mclaren",
                role: "Race Driver",
                highlights: "One season with McLaren during transition era.",
            },
            {
                years: "2014–2020",
                teamName: "Force India / Racing Point",
                constructorId: "aston_martin",
                role: "Race Driver",
                wins: 1,
                podiums: 7,
                highlights:
                    "Legendary last-to-first maiden victory at Sakhir 2020.",
            },
            {
                years: "2021–Present",
                teamName: "Oracle Red Bull Racing",
                constructorId: "red_bull",
                role: "Race Driver",
                wins: 5,
                podiums: 29,
                highlights:
                    "Vice-Champion in 2023, two-time Constructors' Champion, Monaco and Baku specialist.",
                isCurrent: true,
            },
        ],
        juniorCareer: [
            {
                years: "1997–2004",
                category: "Karting",
                result: "Mexican Shifter Kart Champion",
                isChampion: true,
            },
            {
                years: "2005–2006",
                category: "Formula BMW ADAC",
                team: "4speed Media",
                result: "6th overall",
                isChampion: false,
            },
            {
                years: "2007–2008",
                category: "British Formula 3 Championship",
                team: "T-Sport",
                result: "National Class Champion (2007, 14 wins) & 4th in Championship Class (2008)",
                isChampion: true,
            },
            {
                years: "2009–2010",
                category: "GP2 Series (now F2)",
                team: "Arden / Barwa Addax",
                result: "Vice-Champion in 2010 (5 wins, including Monaco Feature)",
                isChampion: false,
            },
        ],
        careerSummary:
            "The 'King of the Streets' and Mexico's greatest F1 driver, boasting 6 Grand Prix wins and two World Constructors' Championship titles.",
    },

    colapinto: {
        driverId: "colapinto",
        fullName: "Franco Colapinto",
        juniorTitles: [
            {
                year: 2019,
                title: "F4 Spanish Championship Champion",
                category: "Formula 4",
            },
        ],
        f1Career: [
            {
                years: "2024",
                teamName: "Williams Racing",
                constructorId: "williams",
                role: "Race Driver",
                highlights:
                    "Instant sensation scoring points in Baku (P8) in only his second Grand Prix, becoming Argentina's first point scorer in 42 years.",
            },
            {
                years: "2025–Present",
                teamName: "Williams Racing / Alpine",
                constructorId: "williams",
                role: "Race Driver",
                highlights:
                    "Cemented his status on the Formula 1 grid with electric race pace.",
                isCurrent: true,
            },
        ],
        juniorCareer: [
            {
                years: "2013–2018",
                category: "Karting",
                result: "Argentine Champion & Youth Olympic Gold Medalist in Karting",
                isChampion: true,
            },
            {
                years: "2019",
                category: "F4 Spanish Championship",
                team: "Drivex School",
                result: "Champion (11 wins, 10 poles in 21 races)",
                isChampion: true,
            },
            {
                years: "2020",
                category: "Toyota Racing Series NZ",
                team: "Kiwi Motorsport",
                result: "3rd overall (Rookie of the Year, 1 win)",
                isChampion: false,
            },
            {
                years: "2021",
                category: "Formula Regional European (FRECA)",
                team: "MP Motorsport",
                result: "6th overall (2 wins, 4 podiums)",
                isChampion: false,
            },
            {
                years: "2022–2023",
                category: "FIA Formula 3 Championship",
                team: "Van Amersfoort / MP",
                result: "4th overall in 2023 (4 race wins)",
                isChampion: false,
            },
            {
                years: "2024",
                category: "FIA Formula 2 Championship",
                team: "MP Motorsport",
                result: "Imola Feature race winner before mid-season F1 promotion",
                isChampion: false,
            },
        ],
        careerSummary:
            "Argentine sensation who took Formula 1 by storm in late 2024, displaying blistering speed and fearless overtakes.",
    },

    stroll: {
        driverId: "stroll",
        fullName: "Lance Stroll",
        juniorTitles: [
            { year: 2014, title: "Italian F4 Champion", category: "Formula 4" },
            {
                year: 2015,
                title: "Toyota Racing Series Champion",
                category: "Formula Regional",
            },
            {
                year: 2016,
                title: "FIA Formula 3 European Champion",
                category: "Formula 3",
            },
        ],
        f1Career: [
            {
                years: "2017–2018",
                teamName: "Williams Martini Racing",
                constructorId: "williams",
                role: "Race Driver",
                podiums: 1,
                highlights:
                    "Podium in rookie season at Baku 2017 (youngest rookie podium finisher).",
            },
            {
                years: "2019–2020",
                teamName: "SportPesa / BWT Racing Point",
                constructorId: "aston_martin",
                role: "Race Driver",
                podiums: 2,
                highlights:
                    "Maiden pole position in rain at Turkey 2020 and podiums at Monza and Sakhir.",
            },
            {
                years: "2021–Present",
                teamName: "Aston Martin Aramco F1 Team",
                constructorId: "aston_martin",
                role: "Race Driver",
                highlights:
                    "Consistent points scorer in green alongside Sebastian Vettel and Fernando Alonso.",
                isCurrent: true,
            },
        ],
        juniorCareer: [
            {
                years: "2008–2013",
                category: "Karting",
                result: "Multiple Canadian & Florida Winter Tour Kart Champion",
                isChampion: true,
            },
            {
                years: "2014",
                category: "Italian F4 Championship",
                team: "Prema Powerteam",
                result: "Champion (7 wins, 14 podiums)",
                isChampion: true,
            },
            {
                years: "2015",
                category: "Toyota Racing Series NZ",
                team: "M2 Competition",
                result: "Champion (4 wins)",
                isChampion: true,
            },
            {
                years: "2015–2016",
                category: "FIA Formula 3 European Championship",
                team: "Prema Powerteam",
                result: "Champion in 2016 (Dominant 14 wins, 14 poles)",
                isChampion: true,
            },
        ],
        careerSummary:
            "Accomplished Canadian racer who swept Italian F4, TRS, and European F3 championships before claiming poles and podiums in Formula 1.",
    },

    hadjar: {
        driverId: "hadjar",
        fullName: "Isack Hadjar",
        juniorTitles: [
            {
                year: 2021,
                title: "Formula Regional European Rookie Champion",
                category: "Formula Regional",
            },
        ],
        f1Career: [
            {
                years: "2025–Present",
                teamName: "Visa Cash App RB F1 Team",
                constructorId: "rb",
                role: "Race Driver",
                highlights:
                    "Graduated from the Red Bull Junior Team as the premier rookie challenger.",
                isCurrent: true,
            },
        ],
        juniorCareer: [
            {
                years: "2015–2018",
                category: "Karting",
                result: "Top tier French & European Karting competitor",
                isChampion: false,
            },
            {
                years: "2019–2020",
                category: "French F4 Championship",
                team: "FFSA Academy",
                result: "3rd overall in 2020 (3 wins)",
                isChampion: false,
            },
            {
                years: "2021",
                category: "Formula Regional European (FRECA)",
                team: "R-ace GP",
                result: "5th overall (2 wins, Rookie Champion)",
                isChampion: true,
            },
            {
                years: "2022",
                category: "FIA Formula 3 Championship",
                team: "Hitech Grand Prix",
                result: "4th overall (3 wins, battle for title as rookie)",
                isChampion: false,
            },
            {
                years: "2023–2024",
                category: "FIA Formula 2 Championship",
                team: "Hitech / Campos Racing",
                result: "4 wins in 2024 (Melbourne, Imola, Silverstone, Spa), Title Contender",
                isChampion: false,
            },
        ],
        careerSummary:
            "Dubbed 'The Little Prost' by Helmut Marko, Hadjar proved his immense speed in F3 and F2 before earning his F1 promotion with Red Bull's sister squad.",
    },

    arvid_lindblad: {
        driverId: "arvid_lindblad",
        fullName: "Arvid Lindblad",
        juniorTitles: [
            {
                year: 2021,
                title: "WSK Euro Series OK Champion",
                category: "Karting",
            },
            {
                year: 2023,
                title: "Macau Grand Prix Formula 4 Winner",
                category: "Formula 4",
            },
        ],
        f1Career: [
            {
                years: "2025–Present",
                teamName: "Red Bull Racing / RB Development Driver",
                constructorId: "red_bull",
                role: "Test & Development Driver",
                highlights:
                    "Next-generation prodigy on the cusp of full Formula 1 race debut.",
                isCurrent: true,
            },
        ],
        juniorCareer: [
            {
                years: "2015–2022",
                category: "Karting",
                result: "WSK Euro Series & WSK Final Cup Champion",
                isChampion: true,
            },
            {
                years: "2022–2023",
                category: "Italian F4 Championship",
                team: "Prema Racing",
                result: "3rd overall in 2023 (6 race wins)",
                isChampion: false,
            },
            {
                years: "2023",
                category: "Formula 4 South East Asia / Macau GP",
                team: "Prema Racing",
                result: "Macau Grand Prix Formula 4 Winner",
                isChampion: true,
            },
            {
                years: "2024",
                category: "FIA Formula 3 Championship",
                team: "Prema Racing",
                result: "4 race wins (Historic Silverstone Sprint & Feature double win)",
                isChampion: false,
            },
            {
                years: "2025",
                category: "FIA Formula 2 Championship",
                team: "Campos Racing",
                result: "Front-running competitor",
                isChampion: false,
            },
        ],
        careerSummary:
            "British-Swedish Red Bull prodigy who made history in 2024 by becoming the first driver ever to sweep both F3 races on a single weekend at Silverstone.",
    },
};

/**
 * Returns complete career progression and championship timeline for a driver
 */
export function getDriverCareer(
    driverId?: string,
): DriverCareerProfile | undefined {
    if (!driverId) return undefined;
    const cleanId = driverId.trim().toLowerCase();
    return DRIVERS_CAREER_DATABASE[cleanId];
}
