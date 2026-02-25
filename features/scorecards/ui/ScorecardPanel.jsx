"use client";

import { useState, useEffect } from "react";
import { scorecardsApi } from "../api/scorecardsApi";
import { ScorecardForm } from "./ScorecardForm";
import { ScorecardsList } from "./ScorecardsList";
import { Loading } from "@/shared/components/feedback/Loading";
import { ClipboardCheck, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/features/team-member-management/model/usePermissions";
import { PERMISSIONS } from "@/shared/lib/permissions";

export function ScorecardPanel({ applicationId }) {
  const { hasPermission } = usePermissions();
  const canManageApplications = hasPermission(PERMISSIONS.MANAGE_APPLICATIONS);
  const [tab, setTab] = useState("all"); // "all" | "mine"
  const [myScorecard, setMyScorecard] = useState(null);
  const [loadingMine, setLoadingMine] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchMine = async () => {
      try {
        setLoadingMine(true);
        const data = await scorecardsApi.getMine(applicationId);
        setMyScorecard(data);
      } catch {
        setMyScorecard(null);
      } finally {
        setLoadingMine(false);
      }
    };
    fetchMine();
  }, [applicationId, refreshKey]);

  const handleSaved = () => {
    setRefreshKey((k) => k + 1);
    setTab("all");
  };

  return (
    <div className="space-y-4">
      {/* Tab toggle */}
      <div className="flex gap-2">
        <Button
          variant={tab === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("all")}
        >
          <List size={14} className="mr-1.5" />
          All Evaluations
        </Button>
        {canManageApplications && (
          <Button
            variant={tab === "mine" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("mine")}
          >
            <ClipboardCheck size={14} className="mr-1.5" />
            {myScorecard ? "Edit My Evaluation" : "Add My Evaluation"}
          </Button>
        )}
      </div>

      {/* Content */}
      {tab === "all" && (
        <ScorecardsList key={refreshKey} applicationId={applicationId} />
      )}

      {tab === "mine" &&
        (loadingMine ? (
          <Loading />
        ) : (
          <ScorecardForm
            applicationId={applicationId}
            existingScorecard={myScorecard}
            onSaved={handleSaved}
          />
        ))}
    </div>
  );
}
