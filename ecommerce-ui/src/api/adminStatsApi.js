
export function getAdminStatsApi(axiosPrivate) {
  return axiosPrivate.get("/api/admin/stats/overview");
}
