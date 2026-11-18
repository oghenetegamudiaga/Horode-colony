import React from 'react';

export default function ClientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-4 py-4">
      <h1 className="type-page-title text-text">Client details</h1>
      <p className="text-[14px] text-text-muted">
        View client history, brand dictionary, and ignore list.
      </p>
    </div>
  );
}
