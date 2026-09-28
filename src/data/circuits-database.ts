/**
 * Comprehensive Formula 1 Circuit Historical & Technical Database
 * Grounds deep heritage, iconic turns, fastest race lap records, and all-time winners.
 */

export interface IconicTurn {
    turn: string;
    name: string;
    description: string;
}

export interface CircuitLapRecord {
    time: string;
    driver: string;
    team: string;
    year: number;
}

export interface CircuitMostWins {
    driver: string;
    driverWins: number;
    team: string;
    teamWins: number;
}

export interface CircuitProfile {
    circuitId: string;
    officialName: string;
    locality: string;
    country: string;
    lengthKm: number;
    turns: number;
    drsZones: number;
    firstGrandPrix: number;
    racesHeld: number;
    lapRecord: CircuitLapRecord;
    mostWins: CircuitMostWins;
    iconicTurns: IconicTurn[];
    description: string;
}

export const CIRCUITS_DATABASE: Record<string, CircuitProfile> = {
    bahrain: {
        circuitId: "bahrain",
        officialName: "Bahrain International Circuit",
        locality: "Sakhir",
        country: "Bahrain",
        lengthKm: 5.412,
        turns: 15,
        drsZones: 3,
        firstGrandPrix: 2004,
        racesHeld: 21,
        lapRecord: {
            time: "1:31.447",
            driver: "Pedro de la Rosa",
            team: "McLaren",
            year: 2005,
        },
        mostWins: {
            driver: "Lewis Hamilton",
            driverWins: 5,
            team: "Ferrari",
            teamWins: 7,
        },
        iconicTurns: [
            {
                turn: "Turn 1",
                name: "Michael Schumacher Corner",
                description:
                    "Severe braking from 330 km/h down to 65 km/h, the premier overtaking hotspot on the track.",
            },
            {
                turn: "Turn 4",
                name: "Oasis Bend",
                description:
                    "Fast downhill right-hander testing front-left tire grip and traction on exit.",
            },
            {
                turn: "Turn 9-10",
                name: "Blind Downhill Hairpin",
                description:
                    "Tricky off-camber corner where drivers brake while turning downhill, notorious for front-wheel lockups.",
            },
            {
                turn: "Turn 11",
                name: "Uphill Sweeper",
                description:
                    "Challenging high-speed uphill fourth-gear turn testing aerodynamic downforce.",
            },
        ],
        description:
            "Modern desert oasis circuit renowned for night races under floodlights and abrasive asphalt demanding tire preservation.",
    },

    jeddah: {
        circuitId: "jeddah",
        officialName: "Jeddah Corniche Circuit",
        locality: "Jeddah",
        country: "Saudi Arabia",
        lengthKm: 6.174,
        turns: 27,
        drsZones: 3,
        firstGrandPrix: 2021,
        racesHeld: 4,
        lapRecord: {
            time: "1:30.734",
            driver: "Lewis Hamilton",
            team: "Mercedes",
            year: 2021,
        },
        mostWins: {
            driver: "Max Verstappen",
            driverWins: 2,
            team: "Red Bull Racing",
            teamWins: 3,
        },
        iconicTurns: [
            {
                turn: "Turn 1-2",
                name: "Opening Chicane",
                description:
                    "Tight left-right flick opening up the high-speed rollercoaster along the Red Sea coast.",
            },
            {
                turn: "Turn 13",
                name: "Banked Hairpin",
                description:
                    "12-degree banked horseshoe corner taken at over 200 km/h, exerting high lateral G-forces.",
            },
            {
                turn: "Turn 22",
                name: "High Speed Blind Chicane",
                description:
                    "Demanding 250 km/h direction change between unforgiving concrete perimeter barriers.",
            },
            {
                turn: "Turn 27",
                name: "Final Hairpin",
                description:
                    "Heavy braking zone feeding onto the pit straight and the final DRS zone.",
            },
        ],
        description:
            "The fastest street circuit in Formula 1 history, boasting average speeds exceeding 250 km/h past shimmering waters.",
    },

    albert_park: {
        circuitId: "albert_park",
        officialName: "Albert Park Circuit",
        locality: "Melbourne",
        country: "Australia",
        lengthKm: 5.278,
        turns: 14,
        drsZones: 4,
        firstGrandPrix: 1996,
        racesHeld: 27,
        lapRecord: {
            time: "1:19.813",
            driver: "Charles Leclerc",
            team: "Ferrari",
            year: 2024,
        },
        mostWins: {
            driver: "Michael Schumacher",
            driverWins: 4,
            team: "McLaren",
            teamWins: 11,
        },
        iconicTurns: [
            {
                turn: "Turn 1-2",
                name: "Jones Chicane",
                description:
                    "High-speed right-left chicane off the main straight with notorious turn-in curbs.",
            },
            {
                turn: "Turn 3",
                name: "Sports Center",
                description:
                    "Prime overtaking opportunity following the second DRS zone.",
            },
            {
                turn: "Turn 9-10",
                name: "Lakeside Sweeper",
                description:
                    "Ultra-rapid flat-out chicane skirting the lake taken at 260 km/h with 4G lateral load.",
            },
            {
                turn: "Turn 11-12",
                name: "Clark Chicane",
                description:
                    "Technical medium-speed sequence requiring precise curb-hopping without upsetting chassis balance.",
            },
        ],
        description:
            "Semi-permanent lakeside park track combining flowing high-speed sections with heavy braking zones and 4 DRS sectors.",
    },

    suzuka: {
        circuitId: "suzuka",
        officialName: "Suzuka International Racing Course",
        locality: "Suzuka",
        country: "Japan",
        lengthKm: 5.807,
        turns: 18,
        drsZones: 1,
        firstGrandPrix: 1987,
        racesHeld: 34,
        lapRecord: {
            time: "1:30.983",
            driver: "Lewis Hamilton",
            team: "Mercedes",
            year: 2019,
        },
        mostWins: {
            driver: "Michael Schumacher",
            driverWins: 6,
            team: "McLaren",
            teamWins: 9,
        },
        iconicTurns: [
            {
                turn: "Turn 3-7",
                name: "The 'S' Curves (Esses)",
                description:
                    "Hypnotic high-speed rhythm section testing aerodynamic balance and chassis commitment.",
            },
            {
                turn: "Turn 8-9",
                name: "Degner Curve",
                description:
                    "Deceptively tight double right-hander named after motorcycle legend Ernst Degner.",
            },
            {
                turn: "Turn 11",
                name: "Hairpin",
                description:
                    "Classic amphitheater slow corner where drivers thread the needle under braking.",
            },
            {
                turn: "Turn 13-14",
                name: "Spoon Curve",
                description:
                    "Double-apex sweeping left-hander feeding into the high-speed back straight.",
            },
            {
                turn: "Turn 15",
                name: "130R",
                description:
                    "F1's legendary 310 km/h left-hand sweep taken flat-out with heart-in-mouth bravery.",
            },
            {
                turn: "Turn 16-17",
                name: "Casio Triangle",
                description:
                    "Tight final chicane and venue of iconic championship deciders between Senna and Prost.",
            },
        ],
        description:
            "Revered worldwide as a ultimate driver's circuit, featuring the only figure-eight crossover layout in modern Formula 1.",
    },

    shanghai: {
        circuitId: "shanghai",
        officialName: "Shanghai International Circuit",
        locality: "Shanghai",
        country: "China",
        lengthKm: 5.451,
        turns: 16,
        drsZones: 2,
        firstGrandPrix: 2004,
        racesHeld: 17,
        lapRecord: {
            time: "1:32.238",
            driver: "Michael Schumacher",
            team: "Ferrari",
            year: 2004,
        },
        mostWins: {
            driver: "Lewis Hamilton",
            driverWins: 6,
            team: "Mercedes",
            teamWins: 6,
        },
        iconicTurns: [
            {
                turn: "Turn 1-4",
                name: "The Snail Corner",
                description:
                    "270-degree tightening spiral corner where speed drops continuously from 300 to 70 km/h.",
            },
            {
                turn: "Turn 7-8",
                name: "High-Speed Direction Change",
                description:
                    "Fast flowing left-right transition punishing front-left tire degradation.",
            },
            {
                turn: "Turn 14",
                name: "Back Straight Hairpin",
                description:
                    "Violent deceleration from 340 km/h down to 60 km/h at the conclusion of the 1.2km straight.",
            },
        ],
        description:
            "Designed to resemble the Chinese character 'Shang' (上), featuring the longest straight on the Asian leg.",
    },

    miami: {
        circuitId: "miami",
        officialName: "Miami International Autodrome",
        locality: "Miami Gardens",
        country: "United States",
        lengthKm: 5.412,
        turns: 19,
        drsZones: 3,
        firstGrandPrix: 2022,
        racesHeld: 3,
        lapRecord: {
            time: "1:29.708",
            driver: "Max Verstappen",
            team: "Red Bull Racing",
            year: 2023,
        },
        mostWins: {
            driver: "Max Verstappen",
            driverWins: 2,
            team: "Red Bull Racing",
            teamWins: 2,
        },
        iconicTurns: [
            {
                turn: "Turn 1-3",
                name: "Opening Complex",
                description:
                    "Tight right-hand opening corner circling the Hard Rock Stadium perimeter.",
            },
            {
                turn: "Turn 7-8",
                name: "Marina Sweeper",
                description:
                    "Flowing mid-speed bends bypassing the custom luxury yacht marina.",
            },
            {
                turn: "Turn 14-15",
                name: "Turnpike Chicane",
                description:
                    "Extreme uphill crest and blind chicane beneath the Florida Turnpike flyovers.",
            },
            {
                turn: "Turn 17",
                name: "Hairpin",
                description:
                    "Low-speed hairpin terminating the 1.3km back straight before the start/finish straight.",
            },
        ],
        description:
            "Spectacular purpose-built circuit wrapped around Hard Rock Stadium with high-speed sweeps and technical sectors.",
    },

    imola: {
        circuitId: "imola",
        officialName: "Autodromo Enzo e Dino Ferrari",
        locality: "Imola",
        country: "Italy",
        lengthKm: 4.909,
        turns: 19,
        drsZones: 1,
        firstGrandPrix: 1980,
        racesHeld: 31,
        lapRecord: {
            time: "1:15.484",
            driver: "Lewis Hamilton",
            team: "Mercedes",
            year: 2020,
        },
        mostWins: {
            driver: "Michael Schumacher",
            driverWins: 7,
            team: "Ferrari",
            teamWins: 8,
        },
        iconicTurns: [
            {
                turn: "Turn 2-4",
                name: "Variante Tamburello",
                description:
                    "Historic chicane requiring drivers to aggressively ride the high curbs.",
            },
            {
                turn: "Turn 7",
                name: "Tosa Hairpin",
                description:
                    "Banking uphill hairpin surrounded by the passionate red sea of Tifosi grandstands.",
            },
            {
                turn: "Turn 9",
                name: "Piratella",
                description:
                    "Blind, downhill fourth-gear crest where cars dance on the absolute limit of downforce.",
            },
            {
                turn: "Turn 11-12",
                name: "Acque Minerali",
                description:
                    "Double-apex downhill plunge leading immediately into a steep uphill acceleration zone.",
            },
            {
                turn: "Turn 17-18",
                name: "Rivazza",
                description:
                    "Heavy downhill braking zone into two left-handers heading toward the pit straight.",
            },
        ],
        description:
            "Steeped in motorsport lore, this historic anti-clockwise amphitheater tests courage, braking stability, and commitment.",
    },

    monaco: {
        circuitId: "monaco",
        officialName: "Circuit de Monaco",
        locality: "Monte Carlo",
        country: "Monaco",
        lengthKm: 3.337,
        turns: 19,
        drsZones: 1,
        firstGrandPrix: 1950,
        racesHeld: 70,
        lapRecord: {
            time: "1:12.909",
            driver: "Lewis Hamilton",
            team: "Mercedes",
            year: 2021,
        },
        mostWins: {
            driver: "Ayrton Senna",
            driverWins: 6,
            team: "McLaren",
            teamWins: 15,
        },
        iconicTurns: [
            {
                turn: "Turn 1",
                name: "Sainte Dévote",
                description:
                    "Famous first-corner tight right-hander past the ancient chapel where races are won or lost.",
            },
            {
                turn: "Turn 4",
                name: "Casino Square",
                description:
                    "Iconic crest sweeping past the Monte Carlo Casino with zero margin for error.",
            },
            {
                turn: "Turn 6",
                name: "Grand Hotel Hairpin",
                description:
                    "The slowest corner in all of Formula 1 (45 km/h), demanding maximum steering lock.",
            },
            {
                turn: "Turn 9",
                name: "The Tunnel",
                description:
                    "Blind high-speed blast echoing thunderously into the Mediterranean daylight.",
            },
            {
                turn: "Turn 10-11",
                name: "Nouvelle Chicane",
                description:
                    "Critical braking zone emerging from the tunnel straight directly onto the harbor front.",
            },
            {
                turn: "Turn 13-16",
                name: "Swimming Pool (Louis Chiron)",
                description:
                    "Ultra-fast chicane weaving past multimillion-dollar superyachts at 200 km/h.",
            },
            {
                turn: "Turn 18",
                name: "La Rascasse",
                description:
                    "Historic tight hairpin wrapping around the legendary restaurant towards the pit entrance.",
            },
        ],
        description:
            "The jewel in the crown of motorsport. A glittering, claustrophobic street battle where precision reigns supreme.",
    },

    villeneuve: {
        circuitId: "villeneuve",
        officialName: "Circuit Gilles-Villeneuve",
        locality: "Montreal",
        country: "Canada",
        lengthKm: 4.361,
        turns: 14,
        drsZones: 2,
        firstGrandPrix: 1978,
        racesHeld: 43,
        lapRecord: {
            time: "1:13.078",
            driver: "Valtteri Bottas",
            team: "Mercedes",
            year: 2019,
        },
        mostWins: {
            driver: "Michael Schumacher / Lewis Hamilton",
            driverWins: 7,
            team: "Ferrari",
            teamWins: 14,
        },
        iconicTurns: [
            {
                turn: "Turn 1-2",
                name: "Virage Senna",
                description:
                    "Downhill left-right horseshoe complex demanding precision traction on cold tires.",
            },
            {
                turn: "Turn 10",
                name: "L'Épingle (Hairpin)",
                description:
                    "Tight 180-degree hairpin surrounded by roaring Canadian grandstands.",
            },
            {
                turn: "Turn 13-14",
                name: "Wall of Champions",
                description:
                    "Infamous chicane exit barrier that has claimed World Champions Hill, Villeneuve, and Schumacher.",
            },
        ],
        description:
            "Located on Île Notre-Dame, a high-speed stop-and-go circuit with harsh curbs and brutal braking demands.",
    },

    catalunya: {
        circuitId: "catalunya",
        officialName: "Circuit de Barcelona-Catalunya",
        locality: "Montmeló",
        country: "Spain",
        lengthKm: 4.657,
        turns: 14,
        drsZones: 2,
        firstGrandPrix: 1991,
        racesHeld: 34,
        lapRecord: {
            time: "1:16.330",
            driver: "Max Verstappen",
            team: "Red Bull Racing",
            year: 2023,
        },
        mostWins: {
            driver: "Michael Schumacher / Lewis Hamilton",
            driverWins: 6,
            team: "Ferrari",
            teamWins: 12,
        },
        iconicTurns: [
            {
                turn: "Turn 1-2",
                name: "Elf Chicane",
                description:
                    "High-speed downhill right-left off the 1km main straight, premier overtaking zone.",
            },
            {
                turn: "Turn 3",
                name: "Curva Renault",
                description:
                    "Endless uphill sweeping right-hander that tortures front-left tire rubber.",
            },
            {
                turn: "Turn 9",
                name: "Campsa",
                description:
                    "Blind uphill sixth-gear bend taken at 240 km/h where aerodynamic commitment is vital.",
            },
            {
                turn: "Turn 13-14",
                name: "Sweeping Final Turns",
                description:
                    "Restored classic fast double-right layout launching cars onto the 330 km/h pit straight.",
            },
        ],
        description:
            "The benchmark testing facility of Formula 1, containing every combination of corner speed to reveal true car balance.",
    },

    red_bull_ring: {
        circuitId: "red_bull_ring",
        officialName: "Red Bull Ring",
        locality: "Spielberg",
        country: "Austria",
        lengthKm: 4.318,
        turns: 10,
        drsZones: 3,
        firstGrandPrix: 1970,
        racesHeld: 37,
        lapRecord: {
            time: "1:05.619",
            driver: "Carlos Sainz",
            team: "McLaren",
            year: 2020,
        },
        mostWins: {
            driver: "Max Verstappen",
            driverWins: 4,
            team: "Ferrari",
            teamWins: 7,
        },
        iconicTurns: [
            {
                turn: "Turn 1",
                name: "Niki Lauda Kurve",
                description:
                    "Uphill 90-degree right-hander feeding into the steep climb toward Turn 3.",
            },
            {
                turn: "Turn 3",
                name: "Remus",
                description:
                    "The highest elevation point on track and prime overtaking hairpin off DRS 2.",
            },
            {
                turn: "Turn 4",
                name: "Rauch",
                description:
                    "Downhill braking zone into a deceptive off-camber right-hander.",
            },
            {
                turn: "Turn 9-10",
                name: "Jochen Rindt Kurve",
                description:
                    "Ultra-fast downhill sweepers where track limits often determine pole position.",
            },
        ],
        description:
            "High-altitude Alpine blast featuring just 10 corners, generating breathless lap times under 65 seconds.",
    },

    silverstone: {
        circuitId: "silverstone",
        officialName: "Silverstone Circuit",
        locality: "Silverstone",
        country: "United Kingdom",
        lengthKm: 5.891,
        turns: 18,
        drsZones: 2,
        firstGrandPrix: 1950,
        racesHeld: 58,
        lapRecord: {
            time: "1:27.097",
            driver: "Max Verstappen",
            team: "Red Bull Racing",
            year: 2020,
        },
        mostWins: {
            driver: "Lewis Hamilton",
            driverWins: 9,
            team: "Ferrari",
            teamWins: 18,
        },
        iconicTurns: [
            {
                turn: "Turn 1",
                name: "Abbey",
                description:
                    "Blistering 290 km/h right-hand kink opening the high-speed lap.",
            },
            {
                turn: "Turn 9",
                name: "Copse",
                description:
                    "Legendary flat-out 290 km/h entry requiring maximum confidence and front-end bite.",
            },
            {
                turn: "Turn 10-14",
                name: "Maggotts-Becketts-Chapel",
                description:
                    "Motorsport's greatest complex: high-speed direction changes generating over 5G lateral load.",
            },
            {
                turn: "Turn 15",
                name: "Stowe",
                description:
                    "Fast sixth-gear corner at the end of the Hangar Straight leading into the stadium arena.",
            },
            {
                turn: "Turn 16-18",
                name: "Vale & Club",
                description:
                    "Heavy braking chicane and uphill sweep toward the Silverstone Wing pit straight.",
            },
        ],
        description:
            "The historic birthplace of Formula 1, celebrated worldwide for its breathtaking high-speed corner sequences.",
    },

    hungaroring: {
        circuitId: "hungaroring",
        officialName: "Hungaroring",
        locality: "Mogyoród",
        country: "Hungary",
        lengthKm: 4.381,
        turns: 14,
        drsZones: 2,
        firstGrandPrix: 1986,
        racesHeld: 39,
        lapRecord: {
            time: "1:16.627",
            driver: "Lewis Hamilton",
            team: "Mercedes",
            year: 2020,
        },
        mostWins: {
            driver: "Lewis Hamilton",
            driverWins: 8,
            team: "McLaren",
            teamWins: 11,
        },
        iconicTurns: [
            {
                turn: "Turn 1",
                name: "Downhill Hairpin",
                description:
                    "Prime overtaking opportunity following the start/finish straight with heavy downhill braking.",
            },
            {
                turn: "Turn 4",
                name: "Mansell Crest",
                description:
                    "Blind uphill left-hander taken in fifth gear over a sudden crest.",
            },
            {
                turn: "Turn 6-7",
                name: "Chicane",
                description:
                    "Slow, precision-dependent chicane where curb-striking balance is essential.",
            },
            {
                turn: "Turn 11",
                name: "Fast Sweeper",
                description:
                    "Sweeping right-hand bend loading the left-side suspension under intense lateral load.",
            },
        ],
        description:
            "Often called 'Monaco without barriers', a continuous, twisting ribbon of asphalt in a natural amphitheater valley.",
    },

    spa: {
        circuitId: "spa",
        officialName: "Circuit de Spa-Francorchamps",
        locality: "Stavelot",
        country: "Belgium",
        lengthKm: 7.004,
        turns: 19,
        drsZones: 2,
        firstGrandPrix: 1950,
        racesHeld: 57,
        lapRecord: {
            time: "1:44.701",
            driver: "Sergio Pérez",
            team: "Red Bull Racing",
            year: 2024,
        },
        mostWins: {
            driver: "Michael Schumacher",
            driverWins: 6,
            team: "Ferrari",
            teamWins: 18,
        },
        iconicTurns: [
            {
                turn: "Turn 1",
                name: "La Source",
                description:
                    "Tight first-gear hairpin off the start line plunging downhill into the Ardennes valley.",
            },
            {
                turn: "Turn 3-5",
                name: "Eau Rouge & Raidillon",
                description:
                    "Motorsport's most iconic crest: 17% gradient compression taken flat-out at 305 km/h.",
            },
            {
                turn: "Turn 7-9",
                name: "Les Combes & Malmedy",
                description:
                    "Highest point of the circuit and premier passing spot following the 1km Kemmel Straight.",
            },
            {
                turn: "Turn 10-11",
                name: "Bruxelles (Rivage)",
                description:
                    "Deceptive downhill 180-degree carousel testing front-end grip and patience.",
            },
            {
                turn: "Turn 12",
                name: "Pouhon (Double Gauche)",
                description:
                    "Terrifying 290 km/h double-apex downhill left-hander exerting brutal sustained lateral G.",
            },
            {
                turn: "Turn 17-18",
                name: "Blanchimont",
                description:
                    "Fearless 315 km/h left sweep leading directly into the final braking zone.",
            },
            {
                turn: "Turn 19",
                name: "Bus Stop Chicane",
                description:
                    "Final heavy braking chicane leading across the timing line and pit entrance.",
            },
        ],
        description:
            "The longest track on the calendar. An awe-inspiring cathedral of speed carving through the microclimate of the Ardennes.",
    },

    zandvoort: {
        circuitId: "zandvoort",
        officialName: "Circuit Zandvoort",
        locality: "Zandvoort",
        country: "Netherlands",
        lengthKm: 4.259,
        turns: 14,
        drsZones: 2,
        firstGrandPrix: 1952,
        racesHeld: 34,
        lapRecord: {
            time: "1:11.097",
            driver: "Lewis Hamilton",
            team: "Mercedes",
            year: 2021,
        },
        mostWins: {
            driver: "Jim Clark",
            driverWins: 4,
            team: "Ferrari",
            teamWins: 9,
        },
        iconicTurns: [
            {
                turn: "Turn 1",
                name: "Tarzan Bocht",
                description:
                    "Historic 180-degree hairpin with generous camber enabling outside overtaking moves.",
            },
            {
                turn: "Turn 3",
                name: "Hugenholtzbocht",
                description:
                    "Spectacular 19-degree parabolic bowl banking allowing multiple racing trajectories.",
            },
            {
                turn: "Turn 7",
                name: "Scheivlak",
                description:
                    "Blind fast downhill right-hander through the seaside dunes taken in fifth gear.",
            },
            {
                turn: "Turn 14",
                name: "Arie Luyendyk Bocht",
                description:
                    "18-degree banked final curve where DRS opens mid-corner at 260 km/h.",
            },
        ],
        description:
            "Old-school roller coaster set among North Sea sand dunes with steep American-style banking and orange fervor.",
    },

    monza: {
        circuitId: "monza",
        officialName: "Autodromo Nazionale Monza",
        locality: "Monza",
        country: "Italy",
        lengthKm: 5.793,
        turns: 11,
        drsZones: 2,
        firstGrandPrix: 1950,
        racesHeld: 74,
        lapRecord: {
            time: "1:21.046",
            driver: "Rubens Barrichello",
            team: "Ferrari",
            year: 2004,
        },
        mostWins: {
            driver: "Michael Schumacher / Lewis Hamilton",
            driverWins: 5,
            team: "Ferrari",
            teamWins: 20,
        },
        iconicTurns: [
            {
                turn: "Turn 1-2",
                name: "Variante del Rettifilo",
                description:
                    "Brutal deceleration from 355 km/h down to 70 km/h into a narrow right-left chicane.",
            },
            {
                turn: "Turn 3",
                name: "Curva Grande (Biassono)",
                description:
                    "Long sweeping flat-out right-hander accelerating through the historic royal park.",
            },
            {
                turn: "Turn 4-5",
                name: "Variante della Roggia",
                description:
                    "Chicane requiring drivers to mount high curbs with skinny low-downforce wings.",
            },
            {
                turn: "Turn 6-7",
                name: "Curve di Lesmo (1 & 2)",
                description:
                    "Two medium-speed right-handers where rear stability is heavily compromised by low downforce.",
            },
            {
                turn: "Turn 8-10",
                name: "Variante Ascari",
                description:
                    "Rapid left-right-left sequence named after Italy's double champion Alberto Ascari.",
            },
            {
                turn: "Turn 11",
                name: "Curva Parabolica (Alboreto)",
                description:
                    "The world's most famous opening-radius sweeper, hurtling cars back onto the main straight.",
            },
        ],
        description:
            "The Temple of Speed. The spiritual home of the Tifosi where cars run extreme low-drag wings at 360 km/h.",
    },

    baku: {
        circuitId: "baku",
        officialName: "Baku City Circuit",
        locality: "Baku",
        country: "Azerbaijan",
        lengthKm: 6.003,
        turns: 20,
        drsZones: 2,
        firstGrandPrix: 2016,
        racesHeld: 8,
        lapRecord: {
            time: "1:43.009",
            driver: "Charles Leclerc",
            team: "Ferrari",
            year: 2019,
        },
        mostWins: {
            driver: "Sergio Pérez",
            driverWins: 2,
            team: "Red Bull Racing",
            teamWins: 4,
        },
        iconicTurns: [
            {
                turn: "Turn 1-4",
                name: "90-Degree Street Corners",
                description:
                    "Heavy braking zones surrounded by unforgiving barriers creating overtaking opportunities.",
            },
            {
                turn: "Turn 8-12",
                name: "Old City Castle Section",
                description:
                    "The narrowest track section in Formula 1 (only 7.6m wide) hugging medieval stone walls.",
            },
            {
                turn: "Turn 15",
                name: "Downhill Barrier Trap",
                description:
                    "Tricky downhill left-hand entry where brake lockups regularly result in barrier collisions.",
            },
            {
                turn: "Turn 16-20",
                name: "Neftchilar Avenue Blast",
                description:
                    "2.2km flat-out blast along the Caspian Sea boulevard reaching over 350 km/h.",
            },
        ],
        description:
            "A fascinating clash of opposites: wide modern seaside boulevards juxtaposed against narrow medieval castle gates.",
    },

    marina_bay: {
        circuitId: "marina_bay",
        officialName: "Marina Bay Street Circuit",
        locality: "Marina Bay",
        country: "Singapore",
        lengthKm: 4.94,
        turns: 19,
        drsZones: 4,
        firstGrandPrix: 2008,
        racesHeld: 15,
        lapRecord: {
            time: "1:34.486",
            driver: "Daniel Ricciardo",
            team: "RB",
            year: 2024,
        },
        mostWins: {
            driver: "Sebastian Vettel",
            driverWins: 5,
            team: "Mercedes / Ferrari / Red Bull",
            teamWins: 4,
        },
        iconicTurns: [
            {
                turn: "Turn 1-3",
                name: "Sheares Complex",
                description:
                    "Braking zone under floodlights off the pit straight named after Benjamin Sheares Bridge.",
            },
            {
                turn: "Turn 7",
                name: "Memorial Corner",
                description:
                    "Key passing hotspot leading from Republic Boulevard toward Raffles Avenue.",
            },
            {
                turn: "Turn 13",
                name: "Anderson Bridge Hairpin",
                description:
                    "Tight corner crossing the historic steel pedestrian bridge with picturesque skyline views.",
            },
            {
                turn: "Turn 16-17",
                name: "New Padang Straight",
                description:
                    "High-speed flat straight bypassing the former floating grandstand section.",
            },
        ],
        description:
            "The original night race. An exhausting physical crucible of 80% tropical humidity, bumps, and concrete barriers.",
    },

    americas: {
        circuitId: "americas",
        officialName: "Circuit of the Americas",
        locality: "Austin",
        country: "United States",
        lengthKm: 5.513,
        turns: 20,
        drsZones: 2,
        firstGrandPrix: 2012,
        racesHeld: 12,
        lapRecord: {
            time: "1:36.169",
            driver: "Charles Leclerc",
            team: "Ferrari",
            year: 2019,
        },
        mostWins: {
            driver: "Lewis Hamilton",
            driverWins: 5,
            team: "Mercedes",
            teamWins: 5,
        },
        iconicTurns: [
            {
                turn: "Turn 1",
                name: "Big Red",
                description:
                    "Dramatic 41-meter steep uphill blind hairpin allowing daring wide overtaking lines.",
            },
            {
                turn: "Turn 3-6",
                name: "The Esses",
                description:
                    "Rapid sweeping sequence paying homage to Silverstone's Maggotts/Becketts.",
            },
            {
                turn: "Turn 11",
                name: "Hairpin",
                description:
                    "Sharp left-hander launching cars down the 1km back straight.",
            },
            {
                turn: "Turn 12-15",
                name: "Stadium Amphitheater",
                description:
                    "Tight complex enveloped by grandstands inspired by Hockenheim's Motodrom.",
            },
            {
                turn: "Turn 16-18",
                name: "Triple-Apex Carousel",
                description:
                    "Massive multi-apex right-hander modeled after Istanbul Park's legendary Turn 8.",
            },
        ],
        description:
            "Masterful modern circuit featuring dramatic elevation changes and corner designs inspired by legendary circuits.",
    },

    rodriguez: {
        circuitId: "rodriguez",
        officialName: "Autódromo Hermanos Rodríguez",
        locality: "Mexico City",
        country: "Mexico",
        lengthKm: 4.304,
        turns: 17,
        drsZones: 3,
        firstGrandPrix: 1963,
        racesHeld: 24,
        lapRecord: {
            time: "1:17.774",
            driver: "Valtteri Bottas",
            team: "Mercedes",
            year: 2021,
        },
        mostWins: {
            driver: "Max Verstappen",
            driverWins: 5,
            team: "Red Bull Racing",
            teamWins: 5,
        },
        iconicTurns: [
            {
                turn: "Turn 1-3",
                name: "Moisés Solana Chicane",
                description:
                    "Braking zone after the 1.2km straight where thin air produces 360 km/h top speeds.",
            },
            {
                turn: "Turn 7-11",
                name: "Lake Esses",
                description:
                    "Rapid high-downforce sweeps through the former lakebed park grounds.",
            },
            {
                turn: "Turn 12-16",
                name: "Foro Sol Stadium Arena",
                description:
                    "Atmospheric passage through a packed baseball stadium surrounded by 30,000 cheering fans.",
            },
        ],
        description:
            "Perched at 2,285m above sea level where thin air cuts aerodynamic drag and engine cooling demands to the limit.",
    },

    interlagos: {
        circuitId: "interlagos",
        officialName: "Autódromo José Carlos Pace",
        locality: "São Paulo",
        country: "Brazil",
        lengthKm: 4.309,
        turns: 15,
        drsZones: 2,
        firstGrandPrix: 1973,
        racesHeld: 41,
        lapRecord: {
            time: "1:10.540",
            driver: "Valtteri Bottas",
            team: "Mercedes",
            year: 2018,
        },
        mostWins: {
            driver: "Alain Prost",
            driverWins: 6,
            team: "McLaren",
            teamWins: 12,
        },
        iconicTurns: [
            {
                turn: "Turn 1-2",
                name: "Senna 'S'",
                description:
                    "Downhill left-right plunge off the main straight, venue of legendary overtaking moves.",
            },
            {
                turn: "Turn 3",
                name: "Curva do Sol",
                description:
                    "Long sweeping left accelerating into the Reta Oposta second DRS zone.",
            },
            {
                turn: "Turn 4-5",
                name: "Descida do Lago",
                description:
                    "Heavy braking zone over tricky track bumps leading into the infield.",
            },
            {
                turn: "Turn 10",
                name: "Bico de Pato (Duck's Beak)",
                description:
                    "Extremely tight hairpin where precise throttle control prevents wheelspin.",
            },
            {
                turn: "Turn 12",
                name: "Junção",
                description:
                    "Crucial left turn preceding the long uphill acceleration through the natural amphitheater bowl.",
            },
            {
                turn: "Turn 14-15",
                name: "Subida dos Boxes",
                description:
                    "Flat-out uphill climb curving left past the pit lane entrance to the start/finish line.",
            },
        ],
        description:
            "Atmospheric anti-clockwise natural bowl known for unpredictable weather, passionate fans, and dramatic championship showdowns.",
    },

    vegas: {
        circuitId: "vegas",
        officialName: "Las Vegas Strip Circuit",
        locality: "Las Vegas",
        country: "United States",
        lengthKm: 6.201,
        turns: 17,
        drsZones: 2,
        firstGrandPrix: 2023,
        racesHeld: 2,
        lapRecord: {
            time: "1:35.490",
            driver: "Oscar Piastri",
            team: "McLaren",
            year: 2023,
        },
        mostWins: {
            driver: "Max Verstappen / George Russell",
            driverWins: 1,
            team: "Red Bull / Mercedes",
            teamWins: 1,
        },
        iconicTurns: [
            {
                turn: "Turn 1-3",
                name: "Paddock Hairpin",
                description:
                    "Tight hairpin sequence wrapping directly around the permanent F1 pit building.",
            },
            {
                turn: "Turn 5-9",
                name: "The Sphere Complex",
                description:
                    "Curving around the dazzling $2.3B LED Sphere with sweeping medium-speed turns.",
            },
            {
                turn: "Turn 12",
                name: "Turn onto The Strip",
                description:
                    "Left-hander unleashing cars onto the 1.9km blast down Las Vegas Boulevard.",
            },
            {
                turn: "Turn 14",
                name: "Strip Chicane",
                description:
                    "Severe braking from 350 km/h past the Bellagio Fountains onto Harmon Avenue.",
            },
        ],
        description:
            "A dazzling night spectacular racing directly down neon-lit Las Vegas Boulevard at top speeds matching Monza.",
    },

    losail: {
        circuitId: "losail",
        officialName: "Lusail International Circuit",
        locality: "Lusail",
        country: "Qatar",
        lengthKm: 5.419,
        turns: 16,
        drsZones: 1,
        firstGrandPrix: 2021,
        racesHeld: 3,
        lapRecord: {
            time: "1:24.319",
            driver: "Max Verstappen",
            team: "Red Bull Racing",
            year: 2023,
        },
        mostWins: {
            driver: "Lewis Hamilton / Max Verstappen",
            driverWins: 1,
            team: "Mercedes / Red Bull",
            teamWins: 1,
        },
        iconicTurns: [
            {
                turn: "Turn 1",
                name: "Turn 1 Braking",
                description:
                    "Heavy braking zone terminating the 1.06km pit straight.",
            },
            {
                turn: "Turn 4-5",
                name: "Flowing Esses",
                description:
                    "High-speed sweeping turns maintaining momentum through the desert landscape.",
            },
            {
                turn: "Turn 12-14",
                name: "Triple-Apex Sweeper",
                description:
                    "Extreme high-speed triple-apex right-hander subjecting tires and drivers to over 5G lateral load.",
            },
            {
                turn: "Turn 16",
                name: "Final Corner",
                description:
                    "Medium-speed right turn setting up crucial exit speed onto the main straight.",
            },
        ],
        description:
            "Ultra-smooth and fast flowing venue illuminated by state-of-the-art LED floodlights across the desert night.",
    },

    yas_marina: {
        circuitId: "yas_marina",
        officialName: "Yas Marina Circuit",
        locality: "Yas Island",
        country: "United Arab Emirates",
        lengthKm: 5.281,
        turns: 16,
        drsZones: 2,
        firstGrandPrix: 2009,
        racesHeld: 16,
        lapRecord: {
            time: "1:26.103",
            driver: "Max Verstappen",
            team: "Red Bull Racing",
            year: 2021,
        },
        mostWins: {
            driver: "Lewis Hamilton",
            driverWins: 5,
            team: "Red Bull Racing",
            teamWins: 7,
        },
        iconicTurns: [
            {
                turn: "Turn 1",
                name: "Opening Left",
                description: "Fourth-gear left hander off the start straight.",
            },
            {
                turn: "Turn 5",
                name: "North Hairpin",
                description:
                    "Reconfigured hairpin opening onto the 1.2km back straight with premier DRS overtaking.",
            },
            {
                turn: "Turn 9",
                name: "Banked South Sweeper",
                description:
                    "Fast banked turn replacing the old clumsy chicanes to promote closer racing.",
            },
            {
                turn: "Turn 12-14",
                name: "Marina & W Hotel Complex",
                description:
                    "Scenic 90-degree corners passing directly beneath the illuminated canopy of the W Hotel.",
            },
        ],
        description:
            "The twilight finale of the season, transitioning from golden Arabian sunset to dazzling floodlit fireworks.",
    },

    sepang: {
        circuitId: "sepang",
        officialName: "Sepang International Circuit",
        locality: "Sepang",
        country: "Malaysia",
        lengthKm: 5.543,
        turns: 15,
        drsZones: 2,
        firstGrandPrix: 1999,
        racesHeld: 19,
        lapRecord: {
            time: "1:34.080",
            driver: "Sebastian Vettel",
            team: "Ferrari",
            year: 2017,
        },
        mostWins: {
            driver: "Sebastian Vettel",
            driverWins: 4,
            team: "Ferrari",
            teamWins: 7,
        },
        iconicTurns: [
            {
                turn: "Turn 1-2",
                name: "Downhill Double Chicane",
                description:
                    "Severe downhill braking off the wide main straight leading into a tight right-left transition.",
            },
            {
                turn: "Turn 5-6",
                name: "High-Speed Sweepers",
                description:
                    "Fast flowing esses testing aero downforce and lateral neck endurance under tropical heat.",
            },
            {
                turn: "Turn 14",
                name: "Hairpin Infield",
                description:
                    "Critical slow-speed hairpin determining top speed down the 900-meter back straight.",
            },
            {
                turn: "Turn 15",
                name: "Sun Hairpin",
                description:
                    "Extreme braking corner separated from the main straight only by the iconic canopy grandstand.",
            },
        ],
        description:
            "Hermann Tilke masterpiece famed for wide tracks, heavy monsoon rain squalls, and intense tropical heat testing drivers to the limit.",
    },

    madrid: {
        circuitId: "madrid",
        officialName: "Circuito de Madrid (IFEMA)",
        locality: "Madrid",
        country: "Spain",
        lengthKm: 5.474,
        turns: 20,
        drsZones: 2,
        firstGrandPrix: 2026,
        racesHeld: 0,
        lapRecord: {
            time: "1:14.200",
            driver: "FIA Projected",
            team: "Formula 1",
            year: 2026,
        },
        mostWins: {
            driver: "Inaugural Race",
            driverWins: 0,
            team: "2026 Debut",
            teamWins: 0,
        },
        iconicTurns: [
            {
                turn: "Turn 1-3",
                name: "IFEMA Pavilion Loop",
                description:
                    "Technical street section winding past Madrid's premier convention pavilions.",
            },
            {
                turn: "Turn 10-12",
                name: "Valdebebas Banked Sweeper",
                description:
                    "Spectacular steeply-banked curved section designed to promote maximum overtaking.",
            },
            {
                turn: "Turn 17-19",
                name: "Tunnel Underpass",
                description:
                    "High-speed descent threading beneath the highway before bursting back toward the pit straight.",
            },
        ],
        description:
            "Modern hybrid street and purpose-built circuit hosting the Spanish Grand Prix from 2026, featuring dramatic banking and urban tunnels.",
    },

    madring: {
        circuitId: "madring",
        officialName: "Circuito de Madrid (IFEMA)",
        locality: "Madrid",
        country: "Spain",
        lengthKm: 5.474,
        turns: 20,
        drsZones: 2,
        firstGrandPrix: 2026,
        racesHeld: 0,
        lapRecord: {
            time: "1:14.200",
            driver: "FIA Projected",
            team: "Formula 1",
            year: 2026,
        },
        mostWins: {
            driver: "Inaugural Race",
            driverWins: 0,
            team: "2026 Debut",
            teamWins: 0,
        },
        iconicTurns: [
            {
                turn: "Turn 1-3",
                name: "IFEMA Pavilion Loop",
                description:
                    "Technical street section winding past Madrid's premier convention pavilions.",
            },
            {
                turn: "Turn 10-12",
                name: "Valdebebas Banked Sweeper",
                description:
                    "Spectacular steeply-banked curved section designed to promote maximum overtaking.",
            },
            {
                turn: "Turn 17-19",
                name: "Tunnel Underpass",
                description:
                    "High-speed descent threading beneath the highway before bursting back toward the pit straight.",
            },
        ],
        description:
            "Modern hybrid street and purpose-built circuit hosting the Spanish Grand Prix from 2026, featuring dramatic banking and urban tunnels.",
    },
};

/**
 * Returns complete historical and technical database record for a circuit.
 */
export function getCircuitDatabase(
    circuitId?: string,
): CircuitProfile | undefined {
    if (!circuitId) return undefined;
    const cleanId = circuitId.toLowerCase().trim();
    return CIRCUITS_DATABASE[cleanId];
}

/**
 * Returns all circuits in the database.
 */
export function getAllCircuitsDatabase(): CircuitProfile[] {
    return Object.values(CIRCUITS_DATABASE);
}
