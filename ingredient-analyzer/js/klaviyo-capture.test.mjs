import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildKlaviyoPayloads, submitCapture, EMAIL_LIST_ID, METRIC_NAME } from './klaviyo-capture.js';

const REPORT = { version: '1', pets: 'dog', product_type: 'food', flagged_gaps: [{ pillar: 'joint', label: 'Joint support' }] };
const ARGS = { email: 'a@b.com', pets: 'dog', productType: 'food', competitorSupplement: false, reportPayload: REPORT, listId: EMAIL_LIST_ID };

test('buildKlaviyoPayloads: subscription body sets email, list, and profile properties', () => {
  const { subscription } = buildKlaviyoPayloads(ARGS);
  assert.equal(subscription.data.type, 'subscription');
  const attrs = subscription.data.attributes.profile.data.attributes;
  assert.equal(attrs.email, 'a@b.com');
  assert.equal(attrs.properties.pets, 'dog');
  assert.equal(attrs.properties.analyzing_product_type, 'food');
  assert.equal(attrs.properties.lead_source, 'ingredient-analyzer');
  assert.equal(attrs.properties.competitor_supplement, false);
  assert.equal(subscription.data.relationships.list.data.id, EMAIL_LIST_ID);
});

test('buildKlaviyoPayloads: event body uses the metric name and carries the full report_payload', () => {
  const { event } = buildKlaviyoPayloads(ARGS);
  assert.equal(event.data.type, 'event');
  assert.equal(event.data.attributes.metric.data.attributes.name, METRIC_NAME);
  assert.equal(event.data.attributes.profile.data.attributes.email, 'a@b.com');
  assert.deepEqual(event.data.attributes.properties, REPORT);
});

test('submitCapture posts subscription then event and resolves ok on 2xx', async () => {
  const calls = [];
  const fakeFetch = async (url, opts) => { calls.push({ url, opts }); return { ok: true, status: 202 }; };
  const res = await submitCapture(ARGS, fakeFetch);
  assert.equal(res.ok, true);
  assert.equal(calls.length, 2);
  assert.match(calls[0].url, /\/client\/subscriptions\//);
  assert.match(calls[1].url, /\/client\/events\//);
  assert.match(calls[0].url, /company_id=SXFMie/);
});

test('submitCapture resolves ok:false when a request fails', async () => {
  const fakeFetch = async () => ({ ok: false, status: 400 });
  const res = await submitCapture(ARGS, fakeFetch);
  assert.equal(res.ok, false);
});
