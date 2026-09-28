import { useParams } from "react-router";
import { useSession } from "../../features/auth/hooks/useSession";
import { useProperty } from "../../features/properties/hooks/useProperties";
import PropertyForm from "../../features/property-management/components/PropertyForm";
import QueryState from "../../components/ui/QueryState";
import EmptyState from "../../components/ui/EmptyState";

export default function PropertyFormPage() {
  const { id } = useParams();
  const session = useSession();
  const query = useProperty(id);
  if (!id) return <PropertyForm user={session.data} />;
  return (
    <QueryState query={query}>
      {(property) =>
        property.seller.id === session.data.id ? (
          <PropertyForm
            key={property.id}
            property={property}
            user={session.data}
          />
        ) : (
          <EmptyState title="This listing belongs to another owner">
            You can only edit your own listings.
          </EmptyState>
        )
      }
    </QueryState>
  );
}
