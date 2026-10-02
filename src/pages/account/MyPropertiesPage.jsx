import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useSession } from "../../features/auth/hooks/useSession";
import { useMyProperties } from "../../features/properties/hooks/useProperties";
import { usePropertyMutation } from "../../features/property-management/hooks/usePropertyMutation";
import QueryState from "../../components/ui/QueryState";
import EmptyState from "../../components/ui/EmptyState";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Feedback from "../../components/ui/Feedback";
import { categories, categoryLabel } from "../../utils/constants";
import PropertyImage from "../../features/properties/components/PropertyImage";
import { formatPrice } from "../../utils/formatPrice";

export default function MyPropertiesPage() {
  const { data: user } = useSession();
  const query = useMyProperties(user?.id);
  const remove = usePropertyMutation("remove");
  const [pending, setPending] = useState(null);
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get("page")) || 1);
  function change(key, value) {
    const next = new URLSearchParams(params);
    next.set(key, value);
    next.set("page", "1");
    setParams(next, { replace: true });
  }
  function actions(property) {
    return (
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Link
          to={`/account/properties/${property.id}/preview`}
          className="py-2 hover:underline"
        >
          View
        </Link>
        <Link
          to={`/account/properties/${property.id}/edit`}
          className="py-2 hover:underline"
        >
          Edit
        </Link>
        <button
          className="py-2 text-error"
          onClick={() => {
            remove.reset();
            setPending(property);
          }}
        >
          Delete
        </button>
      </div>
    );
  }
  return (
    <section>
      <title>My properties | Ghar Realty</title>
      <div className="mb-8 grid items-end gap-4 sm:grid-cols-2 xl:grid-cols-[1.7fr_1fr_1.1fr_auto]">
        <Input
          label="Search listings"
          placeholder="Search by title or location"
          value={params.get("q") || ""}
          onChange={(e) => change("q", e.target.value)}
        />
        <Select
          label="Status"
          value={params.get("status") || ""}
          onChange={(e) => change("status", e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </Select>
        <Select
          label="Category"
          value={params.get("category") || ""}
          onChange={(e) => change("category", e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {categoryLabel(c)}
            </option>
          ))}
        </Select>
        <Link
          to="/account/properties/new"
          className="inline-flex min-h-12 items-center justify-center rounded-sm bg-action px-6 text-sm text-on-action"
        >
          + Add property
        </Link>
      </div>
      <QueryState query={query}>
        {(items) => {
          const filtered = items
            .filter(
              (p) =>
                (!params.get("q") ||
                  [p.title, p.location.area, p.location.city]
                    .join(" ")
                    .toLowerCase()
                    .includes(params.get("q").toLowerCase())) &&
                (!params.get("category") ||
                  p.category === params.get("category")) &&
                (!params.get("status") || p.status === params.get("status")),
            )
            .sort((a, b) =>
              params.get("sort") === "price"
                ? a.price - b.price
                : b.createdAt.localeCompare(a.createdAt),
            );
          const rows = filtered.slice((page - 1) * 6, page * 6);
          return (
            <>
              {!rows.length ? (
                <EmptyState title="No matching listings">
                  <Link to="/account/properties/new" className="underline">
                    Start a new listing
                  </Link>
                </EmptyState>
              ) : (
                <>
                  <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-surface text-muted">
                        <tr>
                          {["Property", "Status", "Price", "Actions"].map(
                            (label) => (
                              <th
                                key={label}
                                className="p-4 font-normal uppercase text-xs"
                              >
                                {label}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((p) => (
                          <tr key={p.id} className="border-b border-border">
                            <td className="py-4 pr-4 pl-4">
                              <div className="flex items-center gap-4">
                                <div className="h-20 w-26 shrink-0 overflow-hidden bg-surface">
                                  <PropertyImage
                                    src={p.images?.[0]}
                                    alt={p.title || "Property"}
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {p.title || "Untitled draft"}
                                  </p>
                                  <p className="mt-2 text-xs text-muted">
                                    Updated{" "}
                                    {new Date(
                                      p.updatedAt || p.createdAt,
                                    ).toLocaleDateString("en-GB", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="pr-4 capitalize">{p.status}</td>
                            <td className="pr-4">{formatPrice(p)}</td>
                            <td>{actions(p)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="grid gap-4 lg:hidden">
                    {rows.map((p) => (
                      <article key={p.id} className="border border-border p-5">
                        <p className="text-xs uppercase text-muted">
                          {p.status}
                        </p>
                        <h2 className="my-3 text-lg font-semibold">
                          {p.title || "Untitled draft"}
                        </h2>
                        <p className="mb-3 text-sm">{formatPrice(p)}</p>
                        {actions(p)}
                      </article>
                    ))}
                  </div>
                </>
              )}
              <p className="mt-6 text-xs text-muted">
                {filtered.length
                  ? `Showing ${(page - 1) * 6 + 1}–${Math.min(page * 6, filtered.length)} of ${filtered.length} listings`
                  : "No listings"}
              </p>
              <nav aria-label="Listing pagination" className="mt-4 flex gap-4">
                {[
                  [-1, "Previous"],
                  [1, "Next"],
                ].map(([offset, label]) => (
                  <Button
                    key={label}
                    variant="secondary"
                    disabled={
                      offset < 0
                        ? page <= 1
                        : page >= Math.ceil(filtered.length / 6)
                    }
                    onClick={() => {
                      const next = new URLSearchParams(params);
                      next.set("page", page + offset);
                      setParams(next);
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </nav>
            </>
          );
        }}
      </QueryState>
      <Modal
        title="Delete this listing?"
        open={!!pending}
        onClose={() => {
          if (!remove.isPending) setPending(null);
        }}
      >
        <p className="mb-6 text-sm text-muted">
          {pending?.title || "Untitled draft"} will be removed from your
          listings and saved homes.
        </p>
        <Feedback error={remove.error} />
        <div className="mt-6 flex gap-3">
          <Button
            loading={remove.isPending}
            onClick={async () => {
              try {
                await remove.mutateAsync(pending.id);
                setPending(null);
              } catch {
                /* Keep confirmation open for retry. */
              }
            }}
          >
            Delete listing
          </Button>
          <Button
            variant="secondary"
            disabled={remove.isPending}
            onClick={() => setPending(null)}
          >
            Keep listing
          </Button>
        </div>
      </Modal>
    </section>
  );
}
