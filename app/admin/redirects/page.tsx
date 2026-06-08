import type { Metadata } from "next";

import { DeleteRedirectButton } from "@/src/features/redirects/components/admin/delete-redirect-button";
import { RedirectForm } from "@/src/features/redirects/components/admin/redirect-form";
import { getAdminRedirects } from "@/src/features/redirects/services/redirects.service";

export const metadata: Metadata = {
  title: "SEO Redirects | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

function formatCreatedAt(value: Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

export default async function AdminRedirectsPage() {
  const redirects = await getAdminRedirects();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">SEO Redirects</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Manage permanent redirects for changed public URLs.
        </p>
      </div>

      <RedirectForm />

      <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
        {redirects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E5E7EB] text-sm">
              <thead className="bg-[#F8FAFC] text-left text-xs font-bold uppercase text-[#6B7280]">
                <tr>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {redirects.map((redirect) => (
                  <tr key={redirect.id}>
                    <td className="px-4 py-3 font-semibold text-[#111827]">
                      {redirect.sourcePath}
                    </td>
                    <td className="px-4 py-3 text-[#374151]">
                      {redirect.destinationPath}
                    </td>
                    <td className="px-4 py-3 text-[#6B7280]">
                      {formatCreatedAt(redirect.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <DeleteRedirectButton
                        redirectId={redirect.id}
                        sourcePath={redirect.sourcePath}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <h3 className="text-lg font-bold text-[#111827]">
              No redirects found
            </h3>
            <p className="mt-2 text-sm text-[#6B7280]">
              Redirects are also created automatically when a public slug
              changes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
