import { useState, useCallback, Dispatch, SetStateAction } from "react";
import api from "~/lib/api";
import { useAuthStore } from "~/store/auth";
import { DashboardData } from "../types";


interface UseDashboardsReturn {
    dashboardData: DashboardData | null;
    fetchDashboardData: () => Promise<void>;
    loading: boolean;
    error: string | null;
    refreshing: boolean;
    onRefresh: () => void;
    setRefreshing: Dispatch<SetStateAction<boolean>>;
};

export function useDashboards(): UseDashboardsReturn {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const { token } = useAuthStore();

    // ------------------- Fetching Functions -------------------
    const fetchDashboardData = useCallback(async () => {

        try {
            setLoading(true);
            const { data } = await api.get("/api/v1/dashboards", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            setDashboardData(data);
        }
        catch (error: any) {
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    }, [token]);


    const onRefresh = async () => {
        setRefreshing(true);
        await fetchDashboardData();
        setRefreshing(false);
    };

    // ------------------- Return -------------------

    return {
        dashboardData,
        loading,
        error,
        refreshing,
        fetchDashboardData,
        onRefresh,
        setRefreshing,
    };
}
