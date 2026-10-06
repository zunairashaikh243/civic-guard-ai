import { getHaversineDistance } from './aiEngine';

/**
 * Generates an optimized Traveling Salesperson route sequence for a list of assigned infrastructure issues.
 */
export function generateOptimizedRoute(issues, startDepot = { name: "Central Municipal Depot", lat: 40.7128, lng: -74.0060 }) {
  if (!issues || issues.length === 0) return { route: [], totalDistanceKm: 0, estimatedTimeMinutes: 0 };

  // Nearest Neighbor Algorithm for TSP
  let unvisited = [...issues];
  let currentPos = startDepot;
  let route = [];
  let totalDistanceKm = 0;

  let stepNumber = 1;

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = getHaversineDistance(currentPos.lat, currentPos.lng, unvisited[i].lat, unvisited[i].lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIdx = i;
      }
    }

    const nearestIssue = unvisited[nearestIdx];
    totalDistanceKm += minDistance;
    route.push({
      step: stepNumber++,
      issue: nearestIssue,
      distanceFromPrevKm: parseFloat(minDistance.toFixed(2)),
      estimatedArrival: `+${Math.round(totalDistanceKm * 6 + stepNumber * 15)} mins`
    });

    currentPos = nearestIssue;
    unvisited.splice(nearestIdx, 1);
  }

  // Return to Depot
  const returnDist = getHaversineDistance(currentPos.lat, currentPos.lng, startDepot.lat, startDepot.lng);
  totalDistanceKm += returnDist;

  const estimatedTimeMinutes = Math.round(totalDistanceKm * 4 + route.length * 25);
  const fuelSavingsLitres = (totalDistanceKm * 0.45).toFixed(1);

  return {
    depot: startDepot,
    route,
    totalDistanceKm: parseFloat(totalDistanceKm.toFixed(2)),
    estimatedTimeMinutes,
    fuelSavingsLitres,
    summary: `${route.length} stops, ${totalDistanceKm.toFixed(1)} km total travel, ~${estimatedTimeMinutes} mins crew shift time.`
  };
}
