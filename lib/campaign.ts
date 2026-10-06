export function getCampaignTitle(date = new Date()) {
  const month = new Intl.DateTimeFormat("en-US", {
    month: "long",
    timeZone: "Europe/Istanbul",
  }).format(date);
  return `${month} Sale`;
}

