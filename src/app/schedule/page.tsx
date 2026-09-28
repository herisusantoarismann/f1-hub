import { Metadata } from "next";
import { F1Service } from "@/services/f1-service";
import { ScheduleGrid } from "@/components/organisms/ScheduleGrid";

export const metadata: Metadata = {
    title: "Race Schedule & Calendar | F1 Hub",
    description:
        "Explore the full Formula 1 official race calendar, session timings, circuit locations, and weekend formats.",
};

// Revalidate this server component route every 24 hours (86400s)
export const revalidate = 86400;

export default async function SchedulePage() {
    // Fetch annotated schedule on the server with cache tag revalidation
    const races = await F1Service.getSeasonCalendar("current");
    const seasonYear = races[0]?.season ?? new Date().getFullYear().toString();

    return (
        <main className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-f1-red">
                    Official Calendar
                </span>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                    Formula 1 Race Schedule
                </h1>
                <p className="text-sm text-f1-gray mt-2 max-w-2xl">
                    Complete season breakdown with circuit details, sprint
                    weekends, and live countdowns. Powered by real-time Jolpica
                    telemetry data.
                </p>
            </div>

            <ScheduleGrid initialRaces={races} season={seasonYear} />
        </main>
    );
}
