import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import OpportunityForm from "../components/OpportunityForm";
import Loader from "../components/Loader";
import { opportunityAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/helpers";

const EditOpportunity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await opportunityAPI.get(id);
        if (!active) return;
        const opp = data.data;
        // Guard: only the owner can edit (backend enforces 403 too).
        if (opp.owner?._id !== user?.id) {
          toast.warn("You can only edit your own opportunities");
          navigate(`/opportunity/${id}`, { replace: true });
          return;
        }
        setOpportunity(opp);
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
  }, [id, user?.id, navigate]);

  const handleUpdate = async (payload) => {
    setSubmitting(true);
    try {
      await opportunityAPI.update(id, payload);
      toast.success("Opportunity updated");
      navigate(`/opportunity/${id}`, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not update opportunity"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader label="Loading opportunity…" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="h1 text-secondary">Edit opportunity</h1>
      <p className="mt-1 text-sm text-slate-500">{opportunity?.customerName}</p>
      <div className="card mt-6 p-6">
        <OpportunityForm
          mode="edit"
          initialValues={opportunity}
          submitting={submitting}
          onSubmit={handleUpdate}
          onCancel={() => navigate(`/opportunity/${id}`)}
        />
      </div>
    </div>
  );
};

export default EditOpportunity;
