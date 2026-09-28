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
import Pagination from "../../components/ui/Pagination";
import { categories, categoryLabel } from "../../utils/constants";
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
        <Link to={`/properties/${property.id}`} className="py-2 underline">
          View
        </Link>
        <Link
          to={`/account/properties/${property.id}/edit`}
          className="py-2 underline"
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">My properties</h1>
        <Link
          to="/account/properties/new"
          className="inline-flex min-h-12 items-center bg-action px-5 text-sm text-on-action"
        >
          + List a property
        </Link>
      </div>
      <div className="my-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Input
          label="Search listings"
          value={params.get("q") || ""}
          onChange={(e) => change("q", e.target.value)}
        />
        <Select
          label="Category"
          value={params.get("category") || ""}
          onChange={(e) => change("category", e.target.value)}
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {categoryLabel(c)}
            </option>
          ))}
        </Select>
        <Select
          label="Status"
          value={params.get("status") || ""}
          onChange={(e) => change("status", e.target.value)}
        >
          <option value="">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </Select>
        <Select
          label="Sort"
          value={params.get("sort") || "latest"}
          onChange={(e) => change("sort", e.target.value)}
        >
          <option value="latest">Latest</option>
          <option value="price">Price low to high</option>
        </Select>
      </div>
      <QueryState query={query}>
        {(items) => {
          const filtered = items
            .filter(
              (p) =>
                (!params.get("q") ||
                  p.title
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
                      <thead className="border-b border-border text-muted">
                        <tr>
                          {["Property", "Price", "Status", "Actions"].map(
                            (label) => (
                              <th key={label} className="py-4 pr-4 font-normal">
                                {label}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((p) => (
                          <tr key={p.id} className="border-b border-border">
                            <td className="max-w-64 py-5 pr-4">
                              <p className="truncate font-medium">
                                {p.title || "Untitled draft"}
                              </p>
                              <p className="mt-2 text-xs text-muted">
                                {p.location.city || "Location not set"}
                              </p>
                            </td>
                            <td className="pr-4">{formatPrice(p)}</td>
                            <td className="pr-4 capitalize">{p.status}</td>
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
              <Pagination
                page={page}
                pages={Math.ceil(filtered.length / 6)}
                onChange={(value) => {
                  const next = new URLSearchParams(params);
                  next.set("page", value);
                  setParams(next);
                }}
              />
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
