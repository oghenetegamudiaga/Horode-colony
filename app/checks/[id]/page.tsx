import React from 'react';

export default function CheckResultsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-4 py-4">
      <h1 className="type-page-title text-text">Check results</h1>
      <p className="text-[14px] text-text-muted">
        Review flagged text issues and suggested corrections.
      </p>
    </div>
  );
}
