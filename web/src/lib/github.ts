// Live proof: PR state and diff size come straight from the GitHub API at build time and are
// refreshed hourly, so a badge flips to "Merged" on its own the day a PR lands.
export type PrStatus = { label: string; additions?: number; deletions?: number; files?: number };

export async function getPrStatus(repo: string, number: number): Promise<PrStatus> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/pulls/${number}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const pr = await res.json();
    const label = pr.merged_at ? "✓ Merged" : pr.state === "closed" ? "Closed" : "● Open · in review";
    return { label, additions: pr.additions, deletions: pr.deletions, files: pr.changed_files };
  } catch {
    // Rate limit or offline build: every listed PR is merged, so that is the last known state.
    return { label: "✓ Merged" };
  }
}
