import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OpportunityForm from "../components/OpportunityForm";
import { opportunityAPI } from "../services/api";
import { getErrorMessage } from "../utils/helpers";

const CreateOpportunity = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (payload) => {
    setSubmitting(true);
    try {
      const { data } = await opportunityAPI.create(payload);
      toast.success("Opportunity created");
      navigate(`/opportunity/${data.data._id}`, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not create opportunity"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="h1 text-secondary">New opportunity</h1>
      <p className="mt-1 text-sm text-slate-500">
        Add a customer opportunity to your pipeline.
      </p>
      <div className="card mt-6 p-6">
        <OpportunityForm
          mode="create"
          submitting={submitting}
          onSubmit={handleCreate}
          onCancel={() => navigate("/dashboard")}
        />
      </div>
    </div>
  );
};

export default CreateOpportunity;
