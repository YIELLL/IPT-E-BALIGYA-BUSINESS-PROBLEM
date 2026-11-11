import React from 'react';
import PhilippineSun from './PhilippineSun';

export default function AboutPage({ onBackToShop, onOpenFlowchart }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Navigation breadcrumb */}
      <div className="mb-6">
        <button
          type="button"
          onClick={onBackToShop}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition"
        >
          <i className="fa-solid fa-arrow-left text-[11px]" aria-hidden="true"></i>
          <span>Back to marketplace</span>
        </button>
      </div>

      {/* Page Header — with Philippine sun watermark */}
      <header className="relative mb-10 max-w-3xl overflow-hidden border-b border-gray-200 pb-8">
        {/* Faint official Philippine sun watermark, top-right corner */}
        <PhilippineSun className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 opacity-25" />
        <span className="relative text-2xs font-semibold uppercase tracking-wider text-gray-400">Platform Overview</span>
        <h1 className="relative mt-2 font-serif text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">About E-Baligya</h1>
        <p className="relative mt-3 text-base leading-relaxed text-gray-600">
          A dedicated inter-island digital marketplace built to connect authentic regional Filipino MSMEs directly with buyers nationwide, eliminating predatory middlemen while securing transactions through automated milestone escrow.
        </p>
      </header>

      {/* 1. Business Description & Mission */}
      <section className="mb-12">
        <div className="mb-5 flex items-center gap-2.5">
          <i className="fa-solid fa-store text-sm text-gray-400" aria-hidden="true"></i>
          <h2 className="text-base font-semibold text-gray-900">Business Description</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="h-[3px] bg-amber-100" />
            <div className="p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Core Mission</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                E-Baligya empowers local micro, small, and medium enterprises (MSMEs) by providing direct national digital distribution for certified regional delicacies (pasalubong).
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="h-[3px] bg-amber-100" />
            <div className="p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">The Problem Solved</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                Regional delicacies are historically trapped behind fragmented local retail or compromised by multi-tiered wholesale distributors who inflate prices and erode freshness.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="h-[3px] bg-amber-100" />
            <div className="p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Logistics &amp; Trust</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                Through integrated domestic routing and buyer-confirmed escrow disbursements, both producers and customers participate in a transparent, accountable transaction lifecycle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. System Flow */}
      <section className="mb-12">
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <i className="fa-solid fa-diagram-project text-sm text-gray-400" aria-hidden="true"></i>
            <h2 className="text-base font-semibold text-gray-900">System Flow</h2>
          </div>
          {onOpenFlowchart && (
            <button
              type="button"
              onClick={onOpenFlowchart}
              className="inline-flex items-center gap-1.5 self-start rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition sm:self-auto"
            >
              <i className="fa-solid fa-diagram-project text-xs text-gray-400" aria-hidden="true"></i>
              <span>View specification dialog</span>
            </button>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Browse Regional Shelves',
              description: 'Filter catalog offerings by island group or specific administrative region. Search products by delicacy name, regional maker, or province.',
              icon: 'fa-magnifying-glass'
            },
            {
              step: '02',
              title: 'Stock & Alternative Recommendations',
              description: 'Real-time stock reservation ensures inventory accuracy. Out-of-stock items immediately surface in-stock regional alternatives from nearby hubs.',
              icon: 'fa-boxes-stacked'
            },
            {
              step: '03',
              title: 'Checkout & Escrow Holding',
              description: 'Buyers select preferred Philippine payment channels (GCash, Maya, Card, COD) and confirm address. Funds are held in escrow rather than direct release.',
              icon: 'fa-shield-halved'
            },
            {
              step: '04',
              title: 'Origin Hub Dispatch & Transit',
              description: 'The artisan MSME packs the delicacy at the regional hub. Domestic multi-modal transit delivers the package across islands.',
              icon: 'fa-plane-departure'
            },
            {
              step: '05',
              title: 'Delivery Confirmation & Payout',
              description: 'Doorstep handover is logged and confirmed by the recipient. Confirmation automatically triggers the escrow release to the regional producer.',
              icon: 'fa-circle-check'
            },
            {
              step: '06',
              title: 'Multi-Axis Quality Review',
              description: 'Buyers evaluate taste, packaging, and freshness. Direct maker reviews establish regional reputation and guide packaging preservation.',
              icon: 'fa-star'
            }
          ].map((item) => (
            <div key={item.step} className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-5">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="tabular font-mono text-xs font-bold text-gray-400">{item.step}</span>
                  <i className={`fa-solid ${item.icon} text-xs text-gray-400`} aria-hidden="true"></i>
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Why It Matters */}
      <section className="mb-12">
        <div className="mb-5 flex items-center gap-2.5">
          <i className="fa-solid fa-heart text-sm text-gray-400" aria-hidden="true"></i>
          <h2 className="text-base font-semibold text-gray-900">Why It Matters</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">1</span>
              <h3 className="text-sm font-semibold text-gray-900">Economic Inclusivity</h3>
            </div>
            <p className="text-xs leading-relaxed text-gray-500">
              Regional producers capture fair margins for their specialized labor rather than surrendering up to 40% in wholesale broker markups, stimulating rural job creation.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">2</span>
              <h3 className="text-sm font-semibold text-gray-900">Culinary Heritage</h3>
            </div>
            <p className="text-xs leading-relaxed text-gray-500">
              Heirloom delicacies—such as Maguindanao kumukunsi, Maranao palapa, and Samar salukara—are sustained and documented, preserving Filipino artisanal traditions.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">3</span>
              <h3 className="text-sm font-semibold text-gray-900">Verified Origin</h3>
            </div>
            <p className="text-xs leading-relaxed text-gray-500">
              Consumers receive authentic delicacies directly from certified producers, eliminating fraudulent imitation products and stale stock from unauthorized resellers.
            </p>
          </div>
        </div>
      </section>

      {/* Return to Marketplace Call to Action */}
      <section className="rounded-lg border border-gray-200 bg-gray-50 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h3 className="text-sm font-semibold text-gray-900 sm:text-base">Ready to explore regional specialties?</h3>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Discover authentic sweets, savory staples, and specialty delicacies from all 17 Philippine regions.
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToShop}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-800 transition"
          >
            <span>Browse delicacies</span>
            <i className="fa-solid fa-arrow-right text-[11px]" aria-hidden="true"></i>
          </button>
        </div>
      </section>
    </div>
  );
}

