// ingredient-analyzer/js/klaviyo-capture.js
// Client-side Klaviyo posting. Public endpoints (company_id only) — safe in-browser.
export const COMPANY_ID = 'SXFMie';
export const EMAIL_LIST_ID = 'WLb5bq';
export const METRIC_NAME = 'Requested Ingredient Report';
const REVISION = '2024-10-15';

export function buildKlaviyoPayloads({ email, pets, productType, competitorSupplement, reportPayload, listId = EMAIL_LIST_ID }) {
  const subscription = {
    data: {
      type: 'subscription',
      attributes: {
        custom_source: 'Ingredient Analyzer',
        profile: {
          data: {
            type: 'profile',
            attributes: {
              email,
              properties: {
                pets,
                analyzing_product_type: productType,
                lead_source: 'ingredient-analyzer',
                competitor_supplement: !!competitorSupplement,
              },
            },
          },
        },
      },
      relationships: { list: { data: { type: 'list', id: listId } } },
    },
  };
  const event = {
    data: {
      type: 'event',
      attributes: {
        properties: reportPayload,
        metric: { data: { type: 'metric', attributes: { name: METRIC_NAME } } },
        profile: { data: { type: 'profile', attributes: { email } } },
      },
    },
  };
  return { subscription, event };
}

export async function submitCapture(args, fetchImpl = fetch) {
  const { subscription, event } = buildKlaviyoPayloads(args);
  const headers = { 'Content-Type': 'application/json', revision: REVISION };
  const base = 'https://a.klaviyo.com/client';
  const subRes = await fetchImpl(`${base}/subscriptions/?company_id=${COMPANY_ID}`, { method: 'POST', headers, body: JSON.stringify(subscription) });
  if (!subRes.ok) return { ok: false };
  const evtRes = await fetchImpl(`${base}/events/?company_id=${COMPANY_ID}`, { method: 'POST', headers, body: JSON.stringify(event) });
  return { ok: !!evtRes.ok };
}
