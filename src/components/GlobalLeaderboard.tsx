"use client";

import { useMemo } from "react";
import { mockGlobalUsage } from "@/data/mockGlobalUsage";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy } from "lucide-react";

export const GlobalLeaderboard = () => {
  const topCountries = useMemo(() => {
    return [...mockGlobalUsage]
      .sort((a, b) => b.people - a.people)
      .slice(0, 10);
  }, []);

  return (
    <Card className="glass-strong border-border/60">
      <div className="p-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Top Countries by Activity</h3>
      </div>
      <div className="px-4 pb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Country</TableHead>
              <TableHead className="text-right">Users</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topCountries.map((c, i) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-muted-foreground">{i + 1}</TableCell>
                <TableCell className="font-medium">{c.country}</TableCell>
                <TableCell className="text-right">{c.people.toLocaleString()}</TableCell>
                <TableCell className="text-right">{c.score}/5</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default GlobalLeaderboard;