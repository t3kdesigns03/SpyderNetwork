"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeaturedOnCamButton } from "@/components/featured-on-cam-button";
import { SpiderIcon } from "@/components/spider-icon";
import { lakeEvents2026 } from "@/data/events";
import { useTheme } from "@/providers/theme-provider";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

export function EventsPageClient() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { mode } = useTheme();
  const isAfterDark = mode === "after-dark";

  const eventsOnDate = useMemo(() => {
    if (!selectedDate) return [];
    return lakeEvents2026.filter((e) => {
      const d = new Date(e.date);
      return (
        d.getFullYear() === selectedDate.getFullYear() &&
        d.getMonth() === selectedDate.getMonth() &&
        d.getDate() === selectedDate.getDate()
      );
    });
  }, [selectedDate]);

  const modifiers = {
    hasEvent: lakeEvents2026.map((e) => new Date(e.date)),
  };

  return (
    <div className="container py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Events 2026</h1>
        <p className="text-muted-foreground mt-1">
          Aquapalooza, Shootout, concerts, and more at the Lake
        </p>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="list">All Events</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <Card className="lg:w-[380px]">
              <CardHeader>
                <h3 className="font-semibold text-foreground">Select a date</h3>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  defaultMonth={new Date(2026, 0)}
                  modifiers={modifiers}
                  modifiersClassNames={{
                    hasEvent: "bg-primary/20 text-primary font-semibold",
                  }}
                />
              </CardContent>
            </Card>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-4">
                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
              </h3>
              {eventsOnDate.length ? (
                <div className="space-y-4">
                  {eventsOnDate.map((event) => (
                    <Card key={event.id} className="relative">
                      {isAfterDark && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -top-2 right-4 pointer-events-none z-10"
                        >
                          <motion.div
                            animate={{
                              y: [0, -4, 0],
                              boxShadow: [
                                "0 0 8px rgba(255,23,68,0.5)",
                                "0 0 14px rgba(255,23,68,0.8)",
                                "0 0 8px rgba(255,23,68,0.5)",
                              ],
                            }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                            className="rounded-full bg-[#111]/90 p-1 border border-[#ff1744]/50"
                          >
                            <SpiderIcon size={14} />
                          </motion.div>
                        </motion.div>
                      )}
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{event.title}</h4>
                          <Badge variant="secondary">{event.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        {event.featuredCamId && (
                          <div className="mt-3">
                            <FeaturedOnCamButton camId={event.featuredCamId} />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No events on this date.</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {lakeEvents2026.map((event) => (
            <Card key={event.id} className="relative">
              {isAfterDark && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-2 right-4 pointer-events-none z-10"
                >
                  <motion.div
                    animate={{
                      y: [0, -4, 0],
                      boxShadow: [
                        "0 0 8px rgba(255,23,68,0.5)",
                        "0 0 14px rgba(255,23,68,0.8)",
                        "0 0 8px rgba(255,23,68,0.5)",
                      ],
                    }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    className="rounded-full bg-[#111]/90 p-1 border border-[#ff1744]/50"
                  >
                    <SpiderIcon size={14} />
                  </motion.div>
                </motion.div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">{event.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(event.date, "MMM d, yyyy")} • {event.location}
                    </p>
                  </div>
                  <Badge variant="secondary">{event.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{event.description}</p>
                {event.featuredCamId && (
                  <div className="mt-3">
                    <FeaturedOnCamButton camId={event.featuredCamId} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
