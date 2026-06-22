import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { opportunityAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  STAGE_STYLES,
  PRIORITY_STYLES,
} from "../utils/constants";
import { formatCurrency, formatDate, getErrorMessage } from "../utils/helpers";

const Row = ({ label, children }) => (
  <div className="flex flex-col gap-0.5 border-b border-slate-100 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
    <span className="text-sm text-slate-400">{label}</span>
    <span className="text-sm font-medium text-secondary">{children}</span>
  </div>
);

const Badge = ({ className, children }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
    {children}
  </span>
);

const OpportunityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await opportunityAPI.get(id);
        if (active) setOpportunity(data.data);
      } catch (error) {
        toast.error(getErrorMessage(error, "Opportunity not found"));
        navigate("/dashboard", { replace: true });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id, navigate]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await opportunityAPI.remove(id);
      toast.success("Opportunity deleted");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not delete opportunity"));
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader label="Loading opportunity…" />
      </div>
    );
  }

  if (!opportunity) return null;

  const isOwner = opportunity.owner?._id === user?.id;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/dashboard" className="text-sm text-primary hover:underline">
        ← Back to dashboard
      </Link>

      <div className="card mt-4 animate-fade-in p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary">
              {opportunity.customerName}
            </h1>
            <p className="mt-1 max-w-prose text-sm text-slate-500">
              {opportunity.requirement}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge className={STAGE_STYLES[opportunity.stage]}>
                {opportunity.stage}
              </Badge>
              <Badge className={PRIORITY_STYLES[opportunity.priority]}>
                {opportunity.priority} priority
              </Badge>
              {isOwner && (
                <Badge className="bg-primary/10 text-primary">Your record</Badge>
              )}
            </div>
          </div>

          {isOwner && (
            <div className="flex gap-2">
              <Link to={`/edit-opportunity/${opportunity._id}`}>
                <Button variant="secondary" size="sm">
                  Edit
                </Button>
              </Link>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setConfirmOpen(true)}
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="mt-6">
          <Row label="Estimated value">{formatCurrency(opportunity.estimatedValue)}</Row>
          <Row label="Owner">{opportunity.owner?.name || "—"}</Row>
          <Row label="Contact name">{opportunity.contactName || "—"}</Row>
          <Row label="Contact email">{opportunity.contactEmail || "—"}</Row>
          <Row label="Contact phone">{opportunity.contactPhone || "—"}</Row>
          <Row label="Next follow-up">{formatDate(opportunity.nextFollowUpDate)}</Row>
          <Row label="Created">{formatDate(opportunity.createdAt)}</Row>
          <Row label="Last updated">{formatDate(opportunity.updatedAt)}</Row>
        </div>

        {opportunity.notes && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-secondary">Notes</h2>
            <p className="mt-1 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
              {opportunity.notes}
            </p>
          </div>
        )}
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete opportunity?"
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={handleDelete}
      >
        This will permanently remove <strong>{opportunity.customerName}</strong>{" "}
        from your pipeline. This action cannot be undone.
      </Modal>
    </div>
  );
};

export default OpportunityDetails;
